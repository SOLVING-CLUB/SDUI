"use client";

import { Product } from "@/lib/sdui/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---- Shared bits ----

function ProductCard({ p, wide }: { p: Product; wide?: boolean }) {
  return (
    <div className={`flex-shrink-0 ${wide ? "" : "w-[124px]"} rounded-xl bg-white p-2 text-left shadow-sm border border-gray-100`}>
      <div
        className="relative flex h-[96px] items-center justify-center rounded-lg text-4xl"
        style={{ background: p.bg }}
      >
        <span>{p.emoji}</span>
        <span className="absolute right-1 top-1 text-xs text-gray-300">♡</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[10px] text-gray-500">{p.qty}</span>
        <button className="rounded-md border border-green-600 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
          ADD
        </button>
      </div>
      <div className="mt-0.5 text-[13px] font-bold text-gray-900">
        ₹{p.price}
        {p.mrp ? <span className="ml-1 text-[10px] font-normal text-gray-400 line-through">₹{p.mrp}</span> : null}
      </div>
      {p.offText ? <div className="text-[10px] font-semibold text-blue-600">{p.offText}</div> : null}
      <div className="line-clamp-2 text-[11px] leading-tight text-gray-800">{p.name}</div>
      {p.tag ? (
        <span className="mt-1 inline-block rounded bg-amber-50 px-1 py-0.5 text-[9px] text-amber-800 border border-amber-200">{p.tag}</span>
      ) : null}
      <div className="mt-0.5 flex items-center gap-1 text-[9px] text-gray-500">
        {p.rating ? <span className="text-amber-500">{"★".repeat(Math.round(p.rating))}</span> : null}
        {p.ratingCount ? <span>{p.ratingCount}</span> : null}
      </div>
      <div className="mt-0.5 flex items-center gap-2 text-[9px] text-gray-500">
        {p.eta ? <span>🕐 {p.eta}</span> : null}
        {p.left ? <span>▯ {p.left} left</span> : null}
      </div>
    </div>
  );
}

// ---- Widgets ----

function CampaignBanner({ kicker, title, subtitle, emoji, titleColor, bg }: any) {
  return (
    <div className="px-4 py-3 text-center" style={{ background: bg }}>
      {kicker ? <div className="text-[11px] font-bold tracking-wide" style={{ color: titleColor }}>{kicker}</div> : null}
      <div className="text-3xl font-extrabold italic drop-shadow-sm" style={{ color: titleColor }}>
        <span className="mr-1">{emoji}</span>
        {title}
      </div>
      {subtitle ? <div className="mt-1 text-[11px] font-semibold" style={{ color: titleColor }}>{subtitle}</div> : null}
    </div>
  );
}

function InfoStrip({ icon, strong, text, bg, color }: any) {
  return (
    <div className="mx-4 my-1.5 flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] shadow-sm" style={{ background: bg, color }}>
      <span>{icon}</span>
      <span className="font-extrabold">{strong}</span>
      <span>{text}</span>
    </div>
  );
}

function DealCardGrid({ cards }: any) {
  const tall = (cards ?? []).find((c: any) => c.tall);
  const rest = (cards ?? []).filter((c: any) => !c.tall);
  return (
    <div className="flex gap-2 px-4 py-2">
      {tall ? (
        <div className="flex w-[104px] flex-shrink-0 flex-col items-center justify-between rounded-xl p-2 text-center" style={{ background: tall.bg }}>
          <div className="text-[13px] font-extrabold text-rose-600">{tall.badge}</div>
          <div className="my-1 rounded bg-gray-800 px-1.5 text-[10px] text-white line-through">{tall.mrp}</div>
          <div className="rounded bg-white px-2 py-0.5 text-[13px] font-extrabold text-rose-600 shadow">{tall.price}</div>
          <div className="mt-1 text-[12px] font-semibold text-gray-800">{tall.title}</div>
          <div className="text-4xl">{tall.emoji}</div>
        </div>
      ) : null}
      <div className="grid flex-1 grid-cols-2 gap-2">
        {rest.map((c: any, i: number) => (
          <div key={i} className="rounded-xl p-2 text-center" style={{ background: c.bg }}>
            {c.badge ? (
              <div className="mx-auto -mt-3 w-fit rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-bold text-white">
                {c.badge}
              </div>
            ) : null}
            <div className="mt-1 text-[12px] font-bold leading-tight text-gray-800">{c.title}</div>
            <div className="mt-1 text-3xl">{c.emoji}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaBannerPair({ left, right }: any) {
  const Cta = ({ c }: any) => (
    <div className="flex flex-1 items-center justify-between rounded-xl px-3 py-2.5 text-white" style={{ background: c.bg }}>
      <div>
        <div className="text-[13px] font-extrabold leading-tight">{c.title}</div>
        <div className="text-[11px]">{c.subtitle}</div>
      </div>
      <div className="text-xl">{c.emoji} ›</div>
    </div>
  );
  return (
    <div className="flex gap-2 px-4 py-1.5">
      <Cta c={left} />
      <Cta c={right} />
    </div>
  );
}

function StripBanner({ emoji, title, subtitle, bg }: any) {
  return (
    <div className="mx-0 my-1.5 flex items-center gap-3 px-4 py-2.5" style={{ background: bg }}>
      <div className="text-3xl">{emoji}</div>
      <div className="flex-1">
        <div className="text-[12px] font-bold text-gray-900">{title} ›</div>
        <div className="text-[10px] text-gray-700">{subtitle}</div>
      </div>
    </div>
  );
}

function CircleCategoryRail({ items }: any) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-2">
      {(items ?? []).map((it: any, i: number) => (
        <div key={i} className="flex w-[64px] flex-shrink-0 flex-col items-center gap-1 text-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${it.selected ? "bg-white shadow-md ring-2 ring-white" : "bg-white/60"}`}>
            {it.emoji}
          </div>
          <span className="text-[10px] leading-tight text-gray-800">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function CategoryGrid({ items, columns = 3 }: any) {
  return (
    <div className="grid gap-3 bg-white px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {(items ?? []).map((it: any, i: number) => (
        <div key={i} className="text-center">
          <div className="flex h-[88px] items-center justify-center rounded-xl text-4xl" style={{ background: it.bg }}>
            {it.emoji}
          </div>
          <div className="mt-1 text-[11px] font-medium leading-tight text-gray-800">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ title, onLight }: any) {
  return (
    <div className={`px-4 pb-1 pt-3 text-[17px] font-extrabold text-gray-900 ${onLight ? "bg-white" : ""}`}>
      {title}
    </div>
  );
}

function ProductRail({ title, products }: any) {
  return (
    <div className="py-2">
      {title ? <SectionTitle title={title} /> : null}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1">
        {(products ?? []).map((p: Product, i: number) => (
          <ProductCard key={i} p={p} />
        ))}
      </div>
    </div>
  );
}

function ProductGrid({ products, columns = 3 }: any) {
  return (
    <div className="grid gap-2 bg-white/60 px-4 py-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {(products ?? []).map((p: Product, i: number) => (
        <ProductCard key={i} p={p} wide />
      ))}
    </div>
  );
}

function SeeAllButton({ text, emoji }: any) {
  return (
    <div className="px-4 py-2">
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-[13px] font-semibold text-blue-900 shadow-sm">
        <span>{emoji}</span> {text} ›
      </button>
    </div>
  );
}

// ---- Registry: the client-side widget vocabulary ----

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

export const WIDGET_TYPES = Object.keys(WIDGET_REGISTRY);
