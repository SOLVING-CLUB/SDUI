import React, { useEffect, useState } from "react";
import { Platform, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { ScreenConfig, WidgetInstance } from "./types";
import { WIDGET_REGISTRY } from "./widgets";

export function ScreenRenderer({ widgets }: { widgets: WidgetInstance[] }) {
  return (
    <>
      {widgets.map((w) => {
        const Cmp = WIDGET_REGISTRY[w.type];
        return Cmp ? <Cmp key={w.id} {...w.props} /> : null; // unknown type → skip
      })}
    </>
  );
}

function RotatingPlaceholder({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % Math.max(words.length, 1)), 2000);
    return () => clearInterval(t);
  }, [words.length]);
  return <Text style={{ fontSize: 13, color: "#9CA3AF" }}>Search &quot;{words[i] ?? ""}&quot;</Text>;
}

export function HomeScreen({
  config,
  refreshing,
  onRefresh,
}: {
  config: ScreenConfig;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const [tabId, setTabId] = useState(config.tabs[0]?.id);
  const tab = config.tabs.find((t) => t.id === tabId) ?? config.tabs[0];
  if (!tab) return <Text style={{ padding: 32 }}>No tabs configured</Text>;

  const fg = tab.theme.dark ? "#fff" : "#111827";

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Themed header — pad below the Android status bar */}
      <View
        style={{
          backgroundColor: tab.theme.gradientFrom,
          paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight ?? 24 : 0) + 10,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: "600", color: fg, opacity: 0.8 }}>Blinkit in</Text>
            <Text style={{ fontSize: 24, fontWeight: "800", color: fg }}>{config.header.etaText}</Text>
            <Text style={{ fontSize: 11, fontWeight: "500", color: fg, opacity: 0.9 }}>{config.header.address} ▾</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ backgroundColor: "#fff", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 }}>💳 ₹0</Text>
            <View style={{ height: 32, width: 32, borderRadius: 999, backgroundColor: "#111827", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#fff" }}>👤</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}>
            <Text>🔍</Text>
            <RotatingPlaceholder words={config.header.searchPlaceholders} />
            <Text style={{ marginLeft: "auto", color: "#9CA3AF" }}>🎤</Text>
          </View>
        </View>

        {/* Tab bar — tabs share the full width; scrolls only when they overflow */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 4 }}
        >
          {config.tabs.map((t) => {
            const active = t.id === tab.id;
            return (
              <TouchableOpacity key={t.id} onPress={() => setTabId(t.id)} style={{ flex: 1, minWidth: 64, alignItems: "center", paddingHorizontal: 6, paddingBottom: 0, opacity: active ? 1 : 0.7 }}>
                {t.badge ? (
                  <Text style={{ position: "absolute", top: -2, right: 2, fontSize: 8, fontWeight: "700", color: "#fff", backgroundColor: t.badge.color, borderRadius: 999, paddingHorizontal: 5, zIndex: 1 }}>
                    {t.badge.text}
                  </Text>
                ) : null}
                <Text style={{ fontSize: 18 }}>{t.icon}</Text>
                <Text style={{ fontSize: 11, fontWeight: active ? "700" : "400", color: fg }}>{t.title}</Text>
                <View style={{ marginTop: 4, marginBottom: 6, height: 3, alignSelf: "stretch", marginHorizontal: 10, borderRadius: 999, backgroundColor: active ? (tab.theme.dark ? "#fff" : "#1F2937") : "transparent" }} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Widget feed */}
      <ScrollView
        style={{ flex: 1, backgroundColor: tab.theme.gradientTo }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenRenderer widgets={tab.widgets} />
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Bottom nav */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#E5E7EB", backgroundColor: "#fff", paddingTop: 8, paddingBottom: 14, paddingHorizontal: 8 }}>
        {config.bottomNav.map((n, i) => (
          <View key={i} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>{n.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: n.active ? "700" : "400", color: n.active ? "#111827" : "#6B7280" }}>{n.label}</Text>
          </View>
        ))}
        <Text style={{ backgroundColor: "#7C3AED", color: "#fff", fontSize: 11, fontWeight: "700", fontStyle: "italic", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
          district
        </Text>
      </View>
    </View>
  );
}
