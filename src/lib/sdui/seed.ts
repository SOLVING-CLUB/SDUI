import { ScreenConfig } from "./types";

// Seed layout replicating the Blinkit homepage reference screenshots (July 2026).
// This is *content*, not code — in production it lives only in the config store.

export const seedHomeConfig: ScreenConfig = {
  screenId: "home",
  header: {
    brand: "BGB",
    brandFull: "Balaji Grand Bazar",
    etaText: "10 minutes",
    address: "HOME - 3-14/21/4/D, srinivasapuram",
    searchPlaceholders: ["stationery", "umbrella", "kitchen appliances", "lipstick", "fever", "decorative lamp"],
  },
  bottomNav: [
    { icon: "home", label: "Home", active: true },
    { icon: "bag", label: "Order Again" },
    { icon: "grid", label: "Categories" },
    { icon: "receipt", label: "My Orders" },
  ],
  tabs: [
    {
      id: "all",
      title: "All",
      icon: "👜",
      theme: { gradientFrom: "#FBD8E6", gradientTo: "#FDEEF4", accent: "#E91E63", dark: false },
      widgets: [
        {
          id: "all-1",
          type: "campaign_banner",
          props: {
            kicker: "BIG",
            title: "Beauty Bash",
            subtitle: "17th–19th JULY",
            emoji: "💄",
            titleColor: "#E75480",
            bg: "transparent",
          },
        },
        {
          id: "all-2",
          type: "info_strip",
          props: { icon: "🎁", strong: "FREE GIFT", text: "on beauty orders above ₹499", bg: "#FFFFFF", color: "#5B2333" },
        },
        {
          id: "all-3",
          type: "deal_card_grid",
          props: {
            cards: [
              { badge: "TOP DEALS", title: "Kajal", price: "₹269", mrp: "₹450", emoji: "🖤", bg: "#FFF7E6", tall: true },
              { badge: "Up to 60% OFF", title: "Skin Care Essentials", emoji: "🧴", bg: "#FDF3F6" },
              { badge: "Up to 50% OFF", title: "Hair Care & Styling", emoji: "🧴", bg: "#FBF6EC" },
              { badge: "Up to 80% OFF", title: "Makeup & Fragrances", emoji: "💅", bg: "#FDF3F6" },
              { badge: "", title: "BIG BRANDS BIG OFFERS", emoji: "✨", bg: "#FFF1F5" },
            ],
          },
        },
        {
          id: "all-4",
          type: "cta_banner_pair",
          props: {
            left: { title: "BUY 1 GET 1", subtitle: "on Lipsticks", emoji: "💄", bg: "#F06292" },
            right: { title: "BUY 2", subtitle: "on Nail Paint", emoji: "💅", bg: "#F06292" },
          },
        },
        {
          id: "all-5",
          type: "strip_banner",
          props: {
            emoji: "🎀",
            title: "Stand a chance to get dyson Airwrap worth ₹49,900",
            subtitle: "Order beauty products worth ₹499 or more to be eligible",
            bg: "#FEF6DC",
          },
        },
        {
          id: "all-6",
          type: "product_rail",
          props: {
            title: "Frequently bought",
            products: [
              { emoji: "🍫", bg: "#F3E3D3", name: "Hide & Seek Chocolate Chip Cookies", qty: "1 pack", price: 35, mrp: 40, eta: "10 mins" },
              { emoji: "🍪", bg: "#EFE6D8", name: "Good Day Butter Cookies", qty: "200 g", price: 30, eta: "10 mins" },
              { emoji: "🥛", bg: "#E8F0F7", name: "Amul Taaza Toned Milk", qty: "500 ml", price: 29, eta: "10 mins" },
              { emoji: "🍞", bg: "#F5EBDD", name: "Britannia Brown Bread", qty: "400 g", price: 55, mrp: 60, eta: "10 mins" },
            ],
          },
        },
      ],
    },
    {
      id: "monsoon",
      title: "Monsoon",
      icon: "☂️",
      theme: { gradientFrom: "#AEC9E8", gradientTo: "#DCE9F7", accent: "#3D6FA8", dark: false },
      widgets: [
        {
          id: "mon-1",
          type: "campaign_banner",
          props: {
            kicker: "Everything you need for",
            title: "Monsoon",
            subtitle: "",
            emoji: "🧥",
            titleColor: "#FFFFFF",
            bg: "transparent",
          },
        },
        {
          id: "mon-2",
          type: "circle_category_rail",
          props: {
            items: [
              { emoji: "☂️", label: "Umbrella", selected: true },
              { emoji: "🧥", label: "Raincoats" },
              { emoji: "🧷", label: "Cloth Clips & Hangers" },
              { emoji: "🍜", label: "Soups & Snacks" },
              { emoji: "🤧", label: "Cough & Cold" },
            ],
          },
        },
        {
          id: "mon-3",
          type: "product_grid",
          props: {
            columns: 3,
            products: [
              { emoji: "☂️", bg: "#DFF0E8", name: "Citizen Basic 2 Fold Umbrella (Sea Green)", qty: "2 Fold", price: 249, mrp: 799, tag: "Auto Open", eta: "10 mins" },
              { emoji: "🌂", bg: "#E8E8EC", name: "KK 3-Fold Compact Umbrella (Jet Black)", qty: "3 Fold", price: 249, mrp: 375, offText: "₹126 OFF", tag: "Manual", left: 3, eta: "10 mins" },
              { emoji: "☔", bg: "#E3E6EB", name: "Citizen Basic 2 Fold Umbrella (Black)", qty: "2 Fold", price: 219, mrp: 799, tag: "Auto Open", eta: "10 mins" },
            ],
          },
        },
        { id: "mon-4", type: "see_all_button", props: { text: "See all products", emoji: "☂️" } },
      ],
    },
    {
      id: "electronics",
      title: "Electronics",
      icon: "🎧",
      theme: { gradientFrom: "#F6D46A", gradientTo: "#FBEDC2", accent: "#B8860B", dark: false },
      widgets: [
        { id: "ele-1", type: "section_title", props: { title: "Salon at home" } },
        {
          id: "ele-2",
          type: "product_grid",
          props: {
            columns: 3,
            products: [
              { emoji: "💇‍♀️", bg: "#F6E7EA", name: "Vega K-Shine Hair Straightener, VHSH-28 (Rose…)", qty: "20 W", price: 1049, mrp: 1399, offText: "₹350 OFF", tag: "Ceramic-Coated", rating: 3.5, ratingCount: "233", eta: "26 mins", left: 1 },
              { emoji: "🪒", bg: "#F0E1DC", name: "Bombay Shaving Company Type C Flash Charge Be…", qty: "3.7 W", price: 599, mrp: 1000, offText: "₹401 OFF", tag: "0.5-6mm", rating: 4, ratingCount: "14,567", eta: "10 mins", left: 2 },
              { emoji: "✂️", bg: "#E3F0EE", name: "Azah Face & Eyebrow Trimmer for Women", qty: "1 unit", price: 699, mrp: 999, offText: "₹300 OFF", rating: 4, ratingCount: "409", eta: "28 mins", left: 2 },
              { emoji: "💨", bg: "#E4EAF5", name: "Philips Easy Care Hair Dryer", qty: "1000 W", price: 795, mrp: 1095, offText: "₹300 OFF", eta: "10 mins" },
              { emoji: "🎧", bg: "#EFE9F5", name: "HashWOW Ear Cleaner Camera Kit", qty: "5 W", price: 749, mrp: 1999, eta: "10 mins" },
              { emoji: "🔥", bg: "#F3E9E0", name: "Havells HS4122 Hair Straightener", qty: "1 unit", price: 1619, mrp: 2495, eta: "10 mins" },
            ],
          },
        },
      ],
    },
    {
      id: "beauty",
      title: "Beauty",
      icon: "💄",
      badge: { text: "Sale", color: "#E23744" },
      theme: { gradientFrom: "#FBD8E6", gradientTo: "#FDEEF4", accent: "#E91E63", dark: false },
      widgets: [
        {
          id: "bea-1",
          type: "campaign_banner",
          props: { kicker: "BIG", title: "Beauty Bash", subtitle: "17th–19th JULY", emoji: "💄", titleColor: "#E75480", bg: "transparent" },
        },
        {
          id: "bea-2",
          type: "info_strip",
          props: { icon: "🎁", strong: "FREE GIFT", text: "on beauty orders above ₹499", bg: "#FFFFFF", color: "#5B2333" },
        },
        {
          id: "bea-3",
          type: "deal_card_grid",
          props: {
            cards: [
              { badge: "Up to 60% OFF", title: "Skin Care Essentials", emoji: "🧴", bg: "#FDF3F6" },
              { badge: "Up to 80% OFF", title: "Makeup & Fragrances", emoji: "💅", bg: "#FDF3F6" },
              { badge: "Up to 50% OFF", title: "Hair Care & Styling", emoji: "🧴", bg: "#FBF6EC" },
            ],
          },
        },
        {
          id: "bea-4",
          type: "cta_banner_pair",
          props: {
            left: { title: "BUY 1 GET 1", subtitle: "on Lipsticks", emoji: "💄", bg: "#F06292" },
            right: { title: "BUY 2", subtitle: "on Nails", emoji: "💅", bg: "#F06292" },
          },
        },
        {
          id: "bea-5",
          type: "strip_banner",
          props: {
            emoji: "🎀",
            title: "Stand a chance to get dyson Airwrap worth ₹49,900",
            subtitle: "Order beauty products worth ₹499 or more to be eligible",
            bg: "#FEF6DC",
          },
        },
        {
          id: "bea-6",
          type: "product_rail",
          props: {
            title: "Top beauty deals",
            products: [
              { emoji: "🧴", bg: "#EAD8EE", name: "BBLUNT Salon Hair Fall Control Shampoo", qty: "300 ml", price: 494, mrp: 550, eta: "10 mins" },
              { emoji: "💧", bg: "#D8E8F5", name: "Livon Hyaluronic Serum Ultra Light", qty: "100 ml", price: 245, mrp: 299, eta: "10 mins" },
              { emoji: "💋", bg: "#F5DCDC", name: "Renee Stunner Matte Lipstick", qty: "1 unit", price: 399, mrp: 499, eta: "10 mins" },
            ],
          },
        },
      ],
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      icon: "💊",
      theme: { gradientFrom: "#1B7F9E", gradientTo: "#2596B8", accent: "#0E6B87", dark: true },
      widgets: [
        {
          id: "pha-1",
          type: "campaign_banner",
          props: {
            kicker: "GET 100% GENUINE",
            title: "Prescription medicines",
            subtitle: "FREE  Doctor consultation after ordering  ·  Up to 30% OFF on medicines",
            emoji: "💊",
            titleColor: "#FFFFFF",
            bg: "transparent",
          },
        },
        { id: "pha-2", type: "section_title", props: { title: "Shop by category", onLight: true } },
        {
          id: "pha-3",
          type: "category_grid",
          props: {
            columns: 3,
            items: [
              { emoji: "🤒", label: "Cough, Cold and Fever", bg: "#DDF0F4" },
              { emoji: "🩹", label: "Stomach Care", bg: "#FBE3EA" },
              { emoji: "🩺", label: "Pain Relief & First Aid", bg: "#DFF2EA" },
              { emoji: "🩸", label: "Diabetes Care", bg: "#E8F0F7" },
              { emoji: "❤️", label: "Heart Care", bg: "#FDECEC" },
              { emoji: "🫁", label: "Respiratory Care", bg: "#E6F3EE" },
              { emoji: "👁️", label: "Eye, Ear & Oral Care", bg: "#EAF1F8" },
              { emoji: "🌸", label: "Sexual Wellness", bg: "#FBE9F1" },
              { emoji: "💊", label: "Vitamins & Supplements", bg: "#EDF4E6" },
            ],
          },
        },
      ],
    },
  ],
};
