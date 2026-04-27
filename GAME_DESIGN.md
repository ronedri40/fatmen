# 🍔 FAT MAN — Game Design Document (Draft v1)

---

## Concept Overview

**Fat Man** is a fast-paced mobile clicker game where players tap as fast as possible to feed a hungry man hamburgers. The more you click, the fatter he gets — until he explodes and you move to the next level. Stop clicking and your score starts to drain, so the pressure never lets up.

---

## Core Gameplay Loop

| Action | Result |
|--------|--------|
| Tap the screen | A hamburger flies into the man's open mouth |
| Every 10,000 clicks | The man gains one fat stage (visually gets bigger) |
| Reach max fat stage | The man **EXPLODES** → Level Up! |
| Stop clicking (>3 sec) | Score begins to decay slowly |
| Click continuously | Score climbs, fat stages advance |

---

## Fat Stages (per level)

Each level has **5 stages** of fatness before the final explosion:

1. **Slim** — Normal build, expectant look
2. **Chubby** — Noticeably wider, rosy cheeks appear
3. **Fat** — Big belly, double chin forms
4. **Very Fat** — Sweating, arms forced outward, barely moving
5. **OBESE** → 💥 **BOOM!**

---

## Levels — Around the World 🌍

Every time the man explodes, a **new character from a different country** appears. Each character has a unique look, outfit, name, and personality matching their culture. The food that flies to their mouth also changes to a national dish.

---

### 🇺🇸 Level 1 — USA: "Big Billy"
- **Look:** Cowboy hat, denim shirt with American flag patch, boots
- **Hair/Skin:** Blonde, fair skin, big grin
- **Food:** 🍔 Classic cheeseburger
- **Explosion cry:** *"YEEHAW!"*
- **Background:** Route 66 highway, diner signs

---

### 🇯🇵 Level 2 — Japan: "Takeshi-san"
- **Look:** Sumo-style fundoshi, topknot hair (mage), wide grin
- **Hair/Skin:** Black topknot, tan skin
- **Food:** 🍱 Sushi roll / Ramen bowl
- **Explosion cry:** *"ITADAKIMASU!!"*
- **Background:** Mount Fuji, cherry blossom trees

---

### 🇲🇽 Level 3 — Mexico: "El Gordo"
- **Look:** Large sombrero, colorful poncho, thick black mustache
- **Hair/Skin:** Dark curly hair, warm brown skin
- **Food:** 🌮 Giant taco / Burrito
- **Explosion cry:** *"¡AY CARAMBA!"*
- **Background:** Cactus desert, pyramids

---

### 🇮🇹 Level 4 — Italy: "Mamma Mia Mario"
- **Look:** Chef's white hat (toque), apron, curly mustache, round glasses
- **Hair/Skin:** Dark curly hair, Mediterranean skin
- **Food:** 🍕 Whole pizza / Giant pasta bowl
- **Explosion cry:** *"MAMMA MIA!"*
- **Background:** Colosseum, Venetian canals

---

### 🇷🇺 Level 5 — Russia: "Boris the Bear"
- **Look:** Ushanka fur hat, thick padded coat, red cheeks from cold
- **Hair/Skin:** Blond/gray hair, pale with rosy cheeks, burly beard
- **Food:** 🥟 Dumplings (pelmeni) / Borscht bowl
- **Explosion cry:** *"DAVAI DAVAI!!"*
- **Background:** Snowy Red Square, onion-dome church

---

### 🇫🇷 Level 6 — France: "François le Gros"
- **Look:** Beret, black-and-white striped shirt, pencil mustache
- **Hair/Skin:** Dark beret, fair skin, sophisticated expression
- **Food:** 🥐 Croissant / Entire baguette
- **Explosion cry:** *"MON DIEU!"*
- **Background:** Eiffel Tower, Paris café

---

### 🇮🇳 Level 7 — India: "Raju Maharaja"
- **Look:** Colorful turban, traditional kurta with gold trim, sandals
- **Hair/Skin:** Dark hair, rich brown skin, warm smile
- **Food:** 🍛 Biryani mountain / Giant naan
- **Explosion cry:** *"BAHUT ACHHA!!"*
- **Background:** Taj Mahal, spice market

---

### 🇧🇷 Level 8 — Brazil: "Carnaval Carlos"
- **Look:** Carnival feathered headdress, shiny outfit, huge smile
- **Hair/Skin:** Curly dark hair, warm mixed-tone skin, very expressive
- **Food:** 🥩 Churrasco skewer / Açaí bowl
- **Explosion cry:** *"ISSO AÍ!!"*
- **Background:** Rio carnival parade, Sugarloaf Mountain

---

### 🇩🇪 Level 9 — Germany: "Hans Bratwurst"
- **Look:** Lederhosen, Bavarian hat with feather, thick blond braided beard
- **Hair/Skin:** Blond hair, fair ruddy skin
- **Food:** 🌭 Bratwurst / Giant pretzel
- **Explosion cry:** *"WUNDERBAR!!"*
- **Background:** Oktoberfest tent, Neuschwanstein castle

---

### 🇨🇳 Level 10 — China: "Wong Da Pang"
- **Look:** Traditional tangzhuang silk jacket, round hat, long thin beard
- **Hair/Skin:** Black hair, light skin, wise expression
- **Food:** 🥟 Dim sum basket / Giant dumplings
- **Explosion cry:** *"哎呀！！ (Āiyā!!)"*
- **Background:** Great Wall, red lanterns

---

## Scoring System

| Event | Points |
|-------|--------|
| Single tap / hamburger eaten | +10 pts |
| Stage advancement | +500 bonus pts |
| EXPLOSION (level complete) | +2,000 bonus pts |
| Idle decay (after 3 sec) | −8 pts/sec |
| Speed combo (>5 taps/sec) | ×1.5 multiplier |

---

## Difficulty Scaling

Each level requires **50% more clicks** to advance one fat stage:

| Level | Clicks per fat stage |
|-------|----------------------|
| 1 | 10,000 |
| 2 | 15,000 |
| 3 | 22,500 |
| 4 | 33,750 |
| 5+ | ×1.5 each time |

---

## Visual Design Principles

- **Dark mode first** — Rich `#121212` background, glassmorphism UI panels
- **Character art** — SVG-drawn cartoon characters, culturally distinctive per level
- **Hamburger (or dish) animation** — Flies from tap point → open mouth with spin
- **Fat transition** — Character body/face smoothly morphs between stages
- **Explosion** — Big 💥 burst, screen flash, then new character slides in
- **Background** — Per-level illustrated backdrop matching country theme
- **Music** — Country-themed background music per level (optional)

---

## Future Ideas

- 🏆 **Global leaderboard** — Compete with players worldwide
- 👥 **2-player mode** — Race to explode your man first
- 🎁 **Power-ups** — Auto-tapper, Double burger, Score shield
- 🎨 **Unlockable skins** — Gold, Robot, Zombie versions of each character
- 📱 **Haptic feedback** — Vibration on tap for mobile

---

*Draft v1 — Fat Man Game Studio, 2026*
