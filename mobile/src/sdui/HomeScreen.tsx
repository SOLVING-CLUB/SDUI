import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomNavItem, ScreenConfig, WidgetInstance } from "./types";
import { WIDGET_REGISTRY } from "./widgets";

const BRAND_RED = "#C21B17";

// BGB diamond monogram, drawn natively so it stays crisp at any size.
function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <View style={{ width: size + 8, height: size + 8, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: BRAND_RED,
          borderRadius: 6,
          transform: [{ rotate: "45deg" }],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ transform: [{ rotate: "-45deg" }], color: "#fff", fontSize: size * 0.32, fontWeight: "900", letterSpacing: 0.5 }}>
          BGB
        </Text>
      </View>
    </View>
  );
}

// Bottom nav: config-driven items, icon keys → Ionicons (outline when idle,
// filled when active), soft pill highlight, no hardcoded extras.
const NAV_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; idle: keyof typeof Ionicons.glyphMap }> = {
  home: { active: "home", idle: "home-outline" },
  bag: { active: "bag-handle", idle: "bag-handle-outline" },
  grid: { active: "grid", idle: "grid-outline" },
  receipt: { active: "receipt", idle: "receipt-outline" },
  print: { active: "print", idle: "print-outline" },
  person: { active: "person", idle: "person-outline" },
};

function BottomNav({ items }: { items: BottomNavItem[] }) {
  const [active, setActive] = useState(() => Math.max(0, items.findIndex((n) => n.active)));
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
        paddingTop: 6,
        paddingBottom: 12,
        paddingHorizontal: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 12,
      }}
    >
      {items.map((n, i) => {
        const isActive = i === active;
        const icon = NAV_ICONS[n.icon];
        return (
          <Pressable
            key={i}
            onPress={() => setActive(i)}
            android_ripple={{ color: "#00000010", borderless: true }}
            style={{ flex: 1, alignItems: "center", gap: 2 }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 3,
                borderRadius: 999,
                backgroundColor: isActive ? "#FCE9E8" : "transparent",
              }}
            >
              {icon ? (
                <Ionicons name={isActive ? icon.active : icon.idle} size={22} color={isActive ? BRAND_RED : "#6B7280"} />
              ) : (
                <Text style={{ fontSize: 20 }}>{n.icon}</Text>
              )}
            </View>
            <Text style={{ fontSize: 10, fontWeight: isActive ? "700" : "500", color: isActive ? BRAND_RED : "#6B7280" }}>
              {n.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

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
  const fade = useRef(new Animated.Value(1)).current;
  const dirRef = useRef(1);
  const tab = config.tabs.find((t) => t.id === tabId) ?? config.tabs[0];

  // Directional fade+slide: content slips out, swaps, slips in from the
  // side of the tab you're heading toward — like the real app.
  const switchTab = (id: string) => {
    if (id === tabId) return;
    const oldI = config.tabs.findIndex((t) => t.id === tabId);
    const newI = config.tabs.findIndex((t) => t.id === id);
    dirRef.current = newI >= oldI ? 1 : -1;
    Animated.timing(fade, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
      setTabId(id);
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

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
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
            <BrandMark />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: fg, opacity: 0.85 }}>
                {config.header.brandFull ?? "Balaji Grand Bazar"} in
              </Text>
              <Text style={{ fontSize: 23, fontWeight: "800", color: fg, marginTop: -2 }}>{config.header.etaText}</Text>
              <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: "500", color: fg, opacity: 0.9 }}>
                {config.header.address} ▾
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ backgroundColor: "#fff", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 }}>💳 ₹0</Text>
            <View style={{ height: 34, width: 34, borderRadius: 999, backgroundColor: "#1F2937", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="person" size={16} color="#fff" />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11 }}>
            <Ionicons name="search" size={17} color="#6B7280" />
            <RotatingPlaceholder words={config.header.searchPlaceholders} />
            <View style={{ marginLeft: "auto", borderLeftWidth: 1, borderLeftColor: "#E5E7EB", paddingLeft: 10 }}>
              <Ionicons name="mic-outline" size={17} color="#6B7280" />
            </View>
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
              <TouchableOpacity key={t.id} onPress={() => switchTab(t.id)} style={{ flex: 1, minWidth: 64, alignItems: "center", paddingHorizontal: 6, paddingBottom: 0, opacity: active ? 1 : 0.7 }}>
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
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: tab.theme.gradientTo,
          opacity: fade,
          transform: [{ translateX: fade.interpolate({ inputRange: [0, 1], outputRange: [dirRef.current * 28, 0] }) }],
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <ScreenRenderer widgets={tab.widgets} />
          <View style={{ height: 16 }} />
        </ScrollView>
      </Animated.View>

      {/* Bottom nav */}
      <BottomNav items={config.bottomNav} />
    </View>
  );
}
