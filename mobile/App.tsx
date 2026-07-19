import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { HomeScreen } from "./src/sdui/HomeScreen";
import { ScreenConfig } from "./src/sdui/types";

// Point this at the machine running the Next.js layout API.
// On a physical phone, use your Mac's LAN IP (e.g. http://192.168.1.5:3000).
// Android emulator: http://10.0.2.2:3000 · iOS simulator: http://localhost:3000
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export default function App() {
  const [data, setData] = useState<{ config: ScreenConfig; version: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/screen/home`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: data?.config ? undefined : "#fff" }}>
      <StatusBar style="dark" />
      {data?.config ? (
        <HomeScreen config={data.config} refreshing={refreshing} onRefresh={load} />
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>
            {error ? "Couldn't reach the layout API" : "Loading layout…"}
          </Text>
          {error ? (
            <>
              <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>
                {error}
                {"\n\n"}Tried: {API_URL}
                {"\n"}Set EXPO_PUBLIC_API_URL to your Mac&apos;s LAN IP and make sure `npm run dev` is running in the web project.
              </Text>
              <TouchableOpacity onPress={load} style={{ backgroundColor: "#111827", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Retry</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}
