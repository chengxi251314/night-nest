/**
 * Night Nest Design System
 * 
 * ┌─ Colors ──────────────────────────────────────┐
 * │ bg-primary:   #030310    deep void             │
 * │ bg-surface:   rgba(14,14,36,0.75) card bg      │
 * │ bg-elevated:  rgba(20,20,48,0.9)  hover        │
 * │ border:       rgba(255,255,255,0.05) subtle    │
 * │ border-glow:  rgba(143,124,255,0.12) accent    │
 * │ text-primary: #f0edf6    body                  │
 * │ text-muted:   #8a87a0    secondary             │
 * │ accent-gold:  #ffd78a    highlights             │
 * │ accent-pink:  #ff8ec7    warmth                │
 * │ accent-violet:#8f7cff    primary action        │
 * │ accent-cyan:  #78dfff    cool accent           │
 * │ accent-emerald:#74e4ae   success               │
 * │ danger:       #ff7b93    destructive           │
 * └────────────────────────────────────────────────┘
 * 
 * ┌─ Character Palettes ───────────────────────────┐
 * │ luoyin:   #c44a6a  rose-red    danger/desire   │
 * │ shenye:   #c89850  warm-gold   comfort/control │
 * │ qinhuai:  #4a9cc4  steel-blue  logic/cold      │
 * │ fuyanzhi: #50b4a0  teal-green  clinical/void   │
 * └────────────────────────────────────────────────┘
 * 
 * ┌─ Typography ───────────────────────────────────┐
 * │ display: 30px/800  hero titles                 │
 * │ h1:      22px/700  page titles                 │
 * │ h2:      18px/700  section headers             │
 * │ h3:      16px/600  card titles                 │
 * │ body:    14px/400  content                     │
 * │ caption: 12px/400  secondary text              │
 * │ label:   11px/500  tags/chips                  │
 * │ font: "PingFang SC", -apple-system, sans-serif │
 * └────────────────────────────────────────────────┘
 * 
 * ┌─ Spacing ──────────────────────────────────────┐
 * │ xs:  4px    inline gap                         │
 * │ sm:  8px    component gap                      │
 * │ md:  12px   section padding                    │
 * │ lg:  16px   card padding                       │
 * │ xl:  20px   page gap                           │
 * │ 2xl: 24px   section gap                        │
 * └────────────────────────────────────────────────┘
 * 
 * ┌─ Radii ────────────────────────────────────────┐
 * │ sm:  8px    chips/tags                         │
 * │ md:  12px   buttons/inputs                     │
 * │ lg:  16px   cards                              │
 * │ xl:  20px   panels                             │
 * │ full:999px  pills/chips                        │
 * └────────────────────────────────────────────────┘
 * 
 * ┌─ Shadows ──────────────────────────────────────┐
 * │ card:  0 2px 16px rgba(0,0,0,0.3)             │
 * │ float: 0 8px 32px rgba(0,0,0,0.4)             │
 * │ glow:  0 0 24px rgba(143,124,255,0.2)          │
 * │ btn:   0 4px 20px rgba(143,124,255,0.3)        │
 * └────────────────────────────────────────────────┘
 * 
 * ┌─ Animation Tokens ─────────────────────────────┐
 * │ fast:   150ms ease     micro-interactions       │
 * │ normal: 250ms ease     standard transitions    │
 * │ slow:   400ms ease     page/panel transitions  │
 * │ spring: cubic-bezier(0.4,0,0.2,1) smooth      │
 * └────────────────────────────────────────────────┘
 */

export const ds = {
  color: {
    bg: "#030310",
    surface: "rgba(14,14,36,0.75)",
    elevated: "rgba(20,20,48,0.9)",
    border: "rgba(255,255,255,0.05)",
    borderGlow: "rgba(143,124,255,0.12)",
    text: "#f0edf6",
    muted: "#8a87a0",
    gold: "#ffd78a",
    pink: "#ff8ec7",
    violet: "#8f7cff",
    cyan: "#78dfff",
    emerald: "#74e4ae",
    danger: "#ff7b93",
  },
  character: {
    luoyin:   { main: "#c44a6a", light: "rgba(196,74,106,0.15)", glow: "rgba(196,74,106,0.3)", dark: "rgba(80,20,40,0.5)" },
    shenye:   { main: "#c89850", light: "rgba(200,152,80,0.15)", glow: "rgba(200,152,80,0.3)", dark: "rgba(60,40,20,0.5)" },
    qinhuai:  { main: "#4a9cc4", light: "rgba(74,156,196,0.15)", glow: "rgba(74,156,196,0.3)", dark: "rgba(20,50,70,0.5)" },
    fuyanzhi: { main: "#50b4a0", light: "rgba(80,180,160,0.12)", glow: "rgba(80,180,160,0.25)", dark: "rgba(20,60,50,0.5)" },
  },
  type: {
    display: { size: 30, weight: 800, lineHeight: 1.15 },
    h1: { size: 22, weight: 700, lineHeight: 1.2 },
    h2: { size: 18, weight: 700, lineHeight: 1.25 },
    h3: { size: 16, weight: 600, lineHeight: 1.3 },
    body: { size: 14, weight: 400, lineHeight: 1.65 },
    caption: { size: 12, weight: 400, lineHeight: 1.5 },
    label: { size: 11, weight: 500, lineHeight: 1.4 },
  },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, "2xl": 24 },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, full: 999 },
  shadow: {
    card: "0 2px 16px rgba(0,0,0,0.3)",
    float: "0 8px 32px rgba(0,0,0,0.4)",
    glow: "0 0 24px rgba(143,124,255,0.2)",
    btn: "0 4px 20px rgba(143,124,255,0.3)",
  },
  anim: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "400ms ease",
    spring: "0.35s cubic-bezier(0.4,0,0.2,1)",
  },
  card: {
    background: "rgba(14,14,36,0.75)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 18,
    backdropFilter: "blur(24px)",
  },
  btn: {
    primary: {
      background: "linear-gradient(135deg, #ff8ec7, #8f7cff)",
      backgroundSize: "200% 200%",
      color: "#fff",
      fontWeight: 600,
      borderRadius: 999,
      padding: "12px 22px",
      boxShadow: "0 4px 20px rgba(143,124,255,0.3)",
    },
    ghost: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "#8a87a0",
      borderRadius: 999,
      padding: "8px 16px",
    },
  },
  input: {
    padding: "13px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)",
    color: "#f0edf6",
    fontSize: 14,
  },
  tag: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 500,
    background: "rgba(255,215,138,0.08)",
    color: "#ffd78a",
    border: "1px solid rgba(255,215,138,0.1)",
  },
} as const;
