import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Product } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// React Native port of the widget vocabulary. Same types, same props,
// same registry pattern as the web renderer — different primitives.

function ProductCard({ p, wide }: { p: Product; wide?: boolean }) {
  return (
    <View
      style={{
        width: wide ? undefined : 124,
        flex: wide ? 1 : undefined,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: "#F3F4F6",
      }}
    >
      <View
        style={{
          height: 96,
          borderRadius: 8,
          backgroundColor: p.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 34 }}>{p.emoji}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <Text style={{ fontSize: 10, color: "#6B7280" }}>{p.qty}</Text>
        <TouchableOpacity
          style={{ borderWidth: 1, borderColor: "#16A34A", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 2 }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#15803D" }}>ADD</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 13, fontWeight: "700", color: "#111827", marginTop: 2 }}>
        ₹{p.price}{" "}
        {p.mrp ? <Text style={{ fontSize: 10, fontWeight: "400", color: "#9CA3AF", textDecorationLine: "line-through" }}>₹{p.mrp}</Text> : null}
      </Text>
      {p.offText ? <Text style={{ fontSize: 10, fontWeight: "600", color: "#2563EB" }}>{p.offText}</Text> : null}
      <Text numberOfLines={2} style={{ fontSize: 11, color: "#1F2937", lineHeight: 14 }}>{p.name}</Text>
      {p.tag ? (
        <Text style={{ fontSize: 9, color: "#92400E", backgroundColor: "#FFFBEB", alignSelf: "flex-start", paddingHorizontal: 4, borderRadius: 4, marginTop: 2 }}>
          {p.tag}
        </Text>
      ) : null}
      <View style={{ flexDirection: "row", gap: 6, marginTop: 2 }}>
        {p.rating ? <Text style={{ fontSize: 9, color: "#F59E0B" }}>{"★".repeat(Math.round(p.rating))} {p.ratingCount ?? ""}</Text> : null}
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
        {p.eta ? <Text style={{ fontSize: 9, color: "#6B7280" }}>🕐 {p.eta}</Text> : null}
        {p.left ? <Text style={{ fontSize: 9, color: "#6B7280" }}>▯ {p.left} left</Text> : null}
      </View>
    </View>
  );
}

function CampaignBanner({ kicker, title, subtitle, emoji, titleColor }: any) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, alignItems: "center" }}>
      {kicker ? <Text style={{ fontSize: 11, fontWeight: "700", color: titleColor }}>{kicker}</Text> : null}
      <Text style={{ fontSize: 30, fontWeight: "800", fontStyle: "italic", color: titleColor }}>
        {emoji} {title}
      </Text>
      {subtitle ? <Text style={{ fontSize: 11, fontWeight: "600", color: titleColor, marginTop: 4, textAlign: "center" }}>{subtitle}</Text> : null}
    </View>
  );
}

function InfoStrip({ icon, strong, text, bg, color }: any) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginVertical: 6,
        flexDirection: "row",
        justifyContent: "center",
        gap: 4,
        backgroundColor: bg,
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ fontSize: 11 }}>{icon}</Text>
      <Text style={{ fontSize: 11, fontWeight: "800", color }}>{strong}</Text>
      <Text style={{ fontSize: 11, color }}>{text}</Text>
    </View>
  );
}

function DealCardGrid({ cards }: any) {
  const tall = (cards ?? []).find((c: any) => c.tall);
  const rest = (cards ?? []).filter((c: any) => !c.tall);
  return (
    <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
      {tall ? (
        <View style={{ width: 104, borderRadius: 12, padding: 8, alignItems: "center", backgroundColor: tall.bg }}>
          <Text style={{ fontSize: 13, fontWeight: "800", color: "#E11D48" }}>{tall.badge}</Text>
          <Text style={{ fontSize: 10, color: "#fff", backgroundColor: "#1F2937", paddingHorizontal: 6, borderRadius: 4, textDecorationLine: "line-through", marginVertical: 4 }}>
            {tall.mrp}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "800", color: "#E11D48", backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
            {tall.price}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#1F2937", marginTop: 4 }}>{tall.title}</Text>
          <Text style={{ fontSize: 34 }}>{tall.emoji}</Text>
        </View>
      ) : null}
      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {rest.map((c: any, i: number) => (
          <View key={i} style={{ width: "47%", borderRadius: 12, padding: 8, alignItems: "center", backgroundColor: c.bg }}>
            {c.badge ? (
              <Text style={{ fontSize: 9, fontWeight: "700", color: "#fff", backgroundColor: "#111827", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, marginTop: -14 }}>
                {c.badge}
              </Text>
            ) : null}
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#1F2937", textAlign: "center", marginTop: 4 }}>{c.title}</Text>
            <Text style={{ fontSize: 28, marginTop: 4 }}>{c.emoji}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CtaBannerPair({ left, right }: any) {
  const Cta = ({ c }: any) => (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: c.bg }}>
      <View>
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#fff" }}>{c.title}</Text>
        <Text style={{ fontSize: 11, color: "#fff" }}>{c.subtitle}</Text>
      </View>
      <Text style={{ fontSize: 18 }}>{c.emoji} ›</Text>
    </View>
  );
  return (
    <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 6 }}>
      <Cta c={left} />
      <Cta c={right} />
    </View>
  );
}

function StripBanner({ emoji, title, subtitle, bg }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 10, marginVertical: 6, backgroundColor: bg }}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#111827" }}>{title} ›</Text>
        <Text style={{ fontSize: 10, color: "#374151" }}>{subtitle}</Text>
      </View>
    </View>
  );
}

function CircleCategoryRail({ items }: any) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
      {(items ?? []).map((it: any, i: number) => (
        <View key={i} style={{ width: 64, alignItems: "center", gap: 4 }}>
          <View
            style={{
              height: 56,
              width: 56,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: it.selected ? "#fff" : "rgba(255,255,255,0.6)",
            }}
          >
            <Text style={{ fontSize: 24 }}>{it.emoji}</Text>
          </View>
          <Text style={{ fontSize: 10, color: "#1F2937", textAlign: "center" }}>{it.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function CategoryGrid({ items }: any) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 12 }}>
      {(items ?? []).map((it: any, i: number) => (
        <View key={i} style={{ width: "33.33%", padding: 4, alignItems: "center" }}>
          <View style={{ height: 88, alignSelf: "stretch", borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: it.bg }}>
            <Text style={{ fontSize: 34 }}>{it.emoji}</Text>
          </View>
          <Text style={{ fontSize: 11, fontWeight: "500", color: "#1F2937", textAlign: "center", marginTop: 4 }}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

function SectionTitle({ title, onLight }: any) {
  return (
    <Text style={{ fontSize: 17, fontWeight: "800", color: "#111827", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, backgroundColor: onLight ? "#fff" : "transparent" }}>
      {title}
    </Text>
  );
}

function ProductRail({ title, products }: any) {
  return (
    <View style={{ paddingVertical: 8 }}>
      {title ? <SectionTitle title={title} /> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {(products ?? []).map((p: Product, i: number) => (
          <ProductCard key={i} p={p} />
        ))}
      </ScrollView>
    </View>
  );
}

function ProductGrid({ products, columns = 3 }: any) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, paddingVertical: 8 }}>
      {(products ?? []).map((p: Product, i: number) => (
        <View key={i} style={{ width: `${100 / columns}%` as any, padding: 4 }}>
          <ProductCard p={p} wide />
        </View>
      ))}
    </View>
  );
}

function SeeAllButton({ text, emoji }: any) {
  return (
    <TouchableOpacity
      style={{ marginHorizontal: 16, marginVertical: 8, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
    >
      <Text>{emoji}</Text>
      <Text style={{ fontSize: 13, fontWeight: "600", color: "#1E3A8A" }}>{text} ›</Text>
    </TouchableOpacity>
  );
}

export const WIDGET_REGISTRY: Record<string, React.FC<any>> = {
  campaign_banner: CampaignBanner,
  info_strip: InfoStrip,
  deal_card_grid: DealCardGrid,
  cta_banner_pair: CtaBannerPair,
  strip_banner: StripBanner,
  circle_category_rail: CircleCategoryRail,
  category_grid: CategoryGrid,
  section_title: SectionTitle,
  product_rail: ProductRail,
  product_grid: ProductGrid,
  see_all_button: SeeAllButton,
};
