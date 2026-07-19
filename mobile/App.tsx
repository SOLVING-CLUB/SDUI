import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomeScreen } from "./src/sdui/HomeScreen";
import { ScreenConfig } from "./src/sdui/types";

// Point this at the machine running the Next.js layout API.
// On a physical phone, use your Mac's LAN IP (e.g. http://192.168.1.5:3000).
// Android emulator: http://10.0.2.2:3000 · iOS simulator: http://localhost:3000
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
const CACHE_KEY = "sdui:screen:home";

function BrandSplash() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20, backgroundColor: "#fff" }}>
      <View
        style={{
          width: 72,
          height: 72,
          backgroundColor: "#C21B17",
          borderRadius: 14,
          transform: [{ rotate: "45deg" }],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ transform: [{ rotate: "-45deg" }], color: "#fff", fontSize: 20, fontWeight: "900" }}>BGB</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: "700", color: "#374151" }}>Balaji Grand Bazar</Text>
      <ActivityIndicator color="#C21B17" />
    </View>
  );
}

export default function App() {
  const [data, setData] = useState<{ config: ScreenConfig; version: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Stale-while-revalidate: paint the cached layout instantly, then refresh
  // from the network and update cache + screen when it arrives.
  const load = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/screen/home`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const fresh = await res.json();
      setData(fresh);
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh)).catch(() => {});
    } catch (e) {
      setError((e as Error).message);
    } finally {
      if (isManual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(CACHE_KEY)
      .then((cached) => {
        if (cached && !cancelled) {
          setData((cur) => cur ?? JSON.parse(cached));
        }
      })
      .catch(() => {})
      .finally(() => {
        load();
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      {data?.config ? (
        <HomeScreen config={data.config} refreshing={refreshing} onRefresh={() => load(true)} />
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Couldn&apos;t reach the layout API</Text>
          <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>
            {error}
            {"\n\n"}Tried: {API_URL}
          </Text>
          <TouchableOpacity onPress={() => load(true)} style={{ backgroundColor: "#C21B17", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <BrandSplash />
      )}
    </SafeAreaView>
  );
}
