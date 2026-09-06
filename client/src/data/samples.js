/**
 * Curated sample scenarios for instantaneous zero friction testing
 * Each sample includes prompt, visual representation, and simulated chain nodes
 */

// Helper to generate crisp SVG data URIs
function createSvgDataUri(svgContent) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

export const SAMPLE_SCENARIOS = [
  {
    id: "cyberpunk_rain",
    title: "Cyberpunk Alley Rain",
    subtitle: "Atmospheric and Lighting Drift Case",
    prompt: "Cyberpunk ramen bar in rainy Neo Shinjuku alley, wet asphalt reflections, glowing cyan and magenta holograms, deep shadows, cinematic 35mm anamorphic lens",
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#090b10"/>
            <stop offset="60%" stop-color="#121624"/>
            <stop offset="100%" stop-color="#05070a"/>
          </linearGradient>
          <radialGradient id="neonCyan" cx="30%" cy="40%" r="40%">
            <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.8"/>
            <stop offset="50%" stop-color="#0080ff" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="neonPink" cx="70%" cy="35%" r="40%">
            <stop offset="0%" stop-color="#ff0077" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="#880055" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="wetFloor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#141824"/>
            <stop offset="50%" stop-color="#222b40"/>
            <stop offset="100%" stop-color="#080a0f"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#bg)"/>
        <!-- Alley walls -->
        <polygon points="0,0 260,350 260,800 0,800" fill="#0d1017"/>
        <polygon points="800,0 540,350 540,800 800,800" fill="#10141d"/>
        <!-- Wet Ground -->
        <polygon points="260,350 540,350 800,800 0,800" fill="url(#wetFloor)"/>
        <!-- Neon Glows -->
        <circle cx="260" cy="300" r="220" fill="url(#neonCyan)"/>
        <circle cx="560" cy="280" r="200" fill="url(#neonPink)"/>
        <!-- Signboards -->
        <rect x="180" y="220" width="60" height="140" rx="6" fill="#00f0ff" opacity="0.85" filter="drop-shadow(0 0 16px #00f0ff)"/>
        <text x="210" y="295" fill="#050b14" font-family="monospace" font-size="24" font-weight="bold" text-anchor="middle" transform="rotate(-90 210 295)">RAMEN</text>
        <rect x="560" y="190" width="70" height="160" rx="6" fill="#ff0077" opacity="0.85" filter="drop-shadow(0 0 16px #ff0077)"/>
        <text x="595" y="275" fill="#ffffff" font-family="monospace" font-size="24" font-weight="bold" text-anchor="middle" transform="rotate(90 595 275)">TOKYO</text>
        <!-- Ramen cart silhouette -->
        <rect x="340" y="380" width="130" height="100" rx="4" fill="#0b0e14" stroke="#ffaa00" stroke-width="2"/>
        <polygon points="320,380 490,380 470,350 340,350" fill="#ffaa00" opacity="0.85"/>
        <circle cx="400" cy="330" r="14" fill="#000000"/>
        <!-- Rain streaks -->
        <line x1="100" y1="100" x2="90" y2="150" stroke="#00f0ff" stroke-width="1.5" opacity="0.4"/>
        <line x1="300" y1="200" x2="290" y2="260" stroke="#ffffff" stroke-width="1.2" opacity="0.3"/>
        <line x1="500" y1="120" x2="490" y2="180" stroke="#ff0077" stroke-width="1.5" opacity="0.4"/>
        <line x1="680" y1="240" x2="670" y2="300" stroke="#00f0ff" stroke-width="1.2" opacity="0.3"/>
        <line x1="420" y1="40" x2="410" y2="90" stroke="#ffffff" stroke-width="1" opacity="0.3"/>
        <!-- Reflections on wet pavement -->
        <ellipse cx="280" cy="580" rx="60" ry="12" fill="#00f0ff" opacity="0.25"/>
        <ellipse cx="540" cy="560" rx="70" ry="14" fill="#ff0077" opacity="0.25"/>
        <ellipse cx="400" cy="500" rx="45" ry="8" fill="#ffaa00" opacity="0.35"/>
      </svg>
    `),
    chainNodes: [
      { id: "node1", name: "Base Generator", type: "generation", prompt: "Cyberpunk ramen bar with misty rain and atmospheric glow" },
      { id: "node2", name: "Detail Upscaler", type: "enhancement", prompt: "Ultra sharp 8k micro clarity, aggressive edge sharpening, eliminate haze" }
    ]
  },
  {
    id: "portrait_artisan",
    title: "Artisan Studio Portrait",
    subtitle: "Texture and Anatomy Check",
    prompt: "Studio editorial portrait of an elder ceramic artisan, silver textured hair, deep character wrinkles, soft directional Rembrandt window light, muted charcoal backdrop, Kodak Tri X film aesthetic",
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <radialGradient id="portraitBg" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#242830"/>
            <stop offset="60%" stop-color="#14161a"/>
            <stop offset="100%" stop-color="#0a0b0d"/>
          </radialGradient>
          <linearGradient id="faceLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e8c4a0"/>
            <stop offset="45%" stop-color="#c89d76"/>
            <stop offset="100%" stop-color="#4a3224"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#portraitBg)"/>
        <!-- Shoulders / Torso -->
        <path d="M 220 740 Q 400 600 580 740 L 640 800 L 160 800 Z" fill="#1b1e24"/>
        <!-- Neck -->
        <rect x="360" y="440" width="80" height="120" rx="10" fill="#9e7555"/>
        <!-- Head / Face -->
        <ellipse cx="400" cy="350" rx="120" ry="150" fill="url(#faceLight)"/>
        <!-- Sculpted Silver Hair -->
        <path d="M 280 320 C 270 200, 360 140, 440 140 C 510 140, 540 210, 520 320 C 500 240, 470 200, 400 210 C 340 220, 300 260, 280 320 Z" fill="#d1d5db" opacity="0.95"/>
        <!-- Eyes -->
        <ellipse cx="360" cy="330" rx="14" ry="8" fill="#1f242d"/>
        <ellipse cx="440" cy="330" rx="14" ry="8" fill="#1f242d"/>
        <circle cx="358" cy="328" r="3" fill="#ffffff"/>
        <circle cx="438" cy="328" r="3" fill="#ffffff"/>
        <!-- Nose bridge -->
        <path d="M 400 325 L 392 380 L 412 385 Z" fill="#875f40" opacity="0.6"/>
        <!-- Character expression mouth -->
        <path d="M 370 420 Q 400 432 430 420" stroke="#523926" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Subtle Rembrandt lighting triangle on cheek -->
        <polygon points="430,345 460,370 435,385" fill="#f0d4b8" opacity="0.45"/>
      </svg>
    `),
    chainNodes: [
      { id: "node1", name: "Subject Generation", type: "generation", prompt: "Elder artisan portrait with authentic skin texture and Rembrandt lighting" },
      { id: "node2", name: "Denoise Filter", type: "enhancement", prompt: "Apply heavy skin smoothing and beauty glow filter" }
    ]
  },
  {
    id: "brutalist_chair",
    title: "Brutalist Concrete Lounge",
    subtitle: "Material and Surface Grounding",
    prompt: "Architectural brutalist lounge chair sculpted from raw cast concrete with ribbed walnut cushion, dramatic morning sunbeams casting geometric shadows, gallery concrete floor, architectural digest style",
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <defs>
          <linearGradient id="galleryWall" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#dfdfd9"/>
            <stop offset="70%" stop-color="#c6c6bd"/>
            <stop offset="100%" stop-color="#a4a499"/>
          </linearGradient>
          <linearGradient id="concreteChair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8c8d88"/>
            <stop offset="50%" stop-color="#696a65"/>
            <stop offset="100%" stop-color="#464742"/>
          </linearGradient>
          <linearGradient id="sunbeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8e7" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#ffedd5" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect width="800" height="520" fill="url(#galleryWall)"/>
        <!-- Gallery floor -->
        <polygon points="0,520 800,520 800,800 0,800" fill="#7a7b74"/>
        <!-- Sunbeam slice -->
        <polygon points="80,0 260,0 680,800 420,800" fill="url(#sunbeam)"/>
        <!-- Contact shadow (slightly diffuse, testing grounding feedback) -->
        <ellipse cx="400" cy="620" rx="180" ry="32" fill="#2d2e29" opacity="0.5"/>
        <!-- Concrete Chair Body -->
        <polygon points="260,420 440,360 560,450 360,530" fill="#999a93"/>
        <polygon points="360,530 560,450 560,570 360,650" fill="url(#concreteChair)"/>
        <polygon points="260,420 360,530 360,650 260,540" fill="#54554f"/>
        <!-- Ribbed Walnut Cushion -->
        <polygon points="310,430 430,390 510,450 380,500" fill="#784b2c"/>
        <polygon points="380,500 510,450 510,470 380,520" fill="#52311b"/>
        <!-- Architectural grid lines -->
        <line x1="0" y1="520" x2="800" y2="520" stroke="#5e5f58" stroke-width="2"/>
        <line x1="300" y1="520" x2="150" y2="800" stroke="#5e5f58" stroke-width="1.5" opacity="0.4"/>
        <line x1="600" y1="520" x2="720" y2="800" stroke="#5e5f58" stroke-width="1.5" opacity="0.4"/>
      </svg>
    `),
    chainNodes: [
      { id: "node1", name: "Brutalist Concept", type: "generation", prompt: "Minimalist concrete chair with sparse architectural negative space" },
      { id: "node2", name: "Detail Pass", type: "enhancement", prompt: "Add ornate Victorian floral scrollwork and dense gold filigree patterns" }
    ]
  }
];
