# 🎂 Birthday Surprise Web App

A lightweight, mobile-first, highly animated single-page web app built with **HTML5, Tailwind CSS, and Vanilla JavaScript**. Designed to give someone special an unforgettable digital birthday experience.

---

## 🚀 Quick Start (Instant Preview)

1. **Open directly in browser:**
   Double-click `index.html` to open it in Chrome, Safari, Edge, or Firefox.
2. **Or run with a local server (optional):**
   ```bash
   npx serve .
   ```
   or right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## ⚡ How to Preview / Test Right Now

The app has a built-in countdown gatekeeper that waits for midnight on the birthday date. To test the entire surprise immediately without changing the target date:
* **Option 1 (One-Click):** Click the **"Preview Mode: OFF"** badge in the top-left corner of the screen. It will toggle to **"Preview Mode: ON (Unlocked)"** instantly!
* **Option 2:** Open the page with `?preview=true` in the URL (e.g., `index.html?preview=true`).

---

## 🎨 How to Personalize Everything (`js/config.js`)

All user-customizable content is centralized in **`js/config.js`** with clear comments:

```javascript
const CONFIG = {
  // 1. Target Midnight Date (YYYY-MM-DDTHH:MM:SS)
  TARGET_BIRTHDAY_DATE: "2026-10-15T00:00:00",

  // 2. Names
  BIRTHDAY_PERSON: "Susan",
  YOUR_NAME: "Nikhil",

  // 3. Background Music (URL or local path)
  AUDIO_URL: "https://... or ./assets/music/your-song.mp3",

  // 4. Balloon Reasons (Pop each to reveal)
  REASONS: [ ... ],

  // 5. Polaroid Photos & Captions
  MEMORIES: [
    {
      image: "https://... or ./assets/images/photo1.jpg",
      caption: "Our road trip • Spring 2022",
      date: "Spring 2022"
    },
    ...
  ],

  // 6. Letter Content
  LETTER: {
    greeting: "Dearest Susan,",
    paragraphs: [ ... ],
    closing: "Forever & always yours,",
    signature: "Nikhil"
  },

  // 7. Real Gift Scratch Card (Underneath silver lottery layer)
  REAL_GIFT: {
    badge: "OFFICIAL BIRTHDAY VOUCHER",
    title: "A Weekend Getaway & Candlelight Dinner 🎫✨",
    subtitle: "Pack your bags! A romantic weekend trip + dinner at your favorite restaurant.",
    couponCode: "LOVE-SUSAN-2026",
    finePrint: "No expiration date • Unlimited cuddles included"
  },

  // 8. Virtual Bouquet (Tap seeds to bloom flowers)
  BOUQUET: {
    subtitle: "You make everything grow beautifully. Tap each seed to plant our garden.",
    completionText: "Happy Birthday to my favorite flower. 🌸",
    flowers: [ ... ]
  },

  // 9. Retro Vinyl Soundtrack Player
  SOUNDTRACK: {
    songTitle: "Our Song",
    artist: "Nikhil & Susan's Melody",
    audioUrl: "https://... or ./assets/music/our-song.mp3",
    tagline: "Every good movie has a soundtrack. Here is ours. 🎵",
    lyrics: [ ... ]
  },

  // 10. Special Guest Video Message (Local file in assets/video/)
  VIDEO_MESSAGE: {
    tagline: "Wait... a very special guest wants to say Happy Birthday too! 🐾",
    videoUrl: "./assets/video/Final_meow.mp4",
    caption: "A special birthday greeting from our favorite little friend! 🐱💖"
  }
};
```

---

## 📱 Complete 9-Section Application Flow

1. **The Gatekeeper (Landing Screen):**
   * *Before Midnight:* Starry night sky with live ticking countdown (Days, Hours, Mins, Secs) and romantic message.
   * *After Midnight:* Glowing 3D gift box with confetti burst and "Tap to open your surprise".
2. **Make a Wish (Virtual Cake):**
   * Centered birthday cake with organic flickering candle flame.
   * Tapping the candle blows it out with rising smoke, celebratory chimes, golden sparkles, and "Happy Birthday!" heading.
3. **Pop the Balloons (Reasons We Love You):**
   * Floating, pastel balloons with gentle physics.
   * Tapping each balloon plays a pop burst sound & animation, revealing a sweet memory card.
   * Tracks progress (`X of 6 popped`) before unlocking the next section.
4. **A Walk Down Memory Lane (25-Photo Gallery):**
   * Hanging fairy string lights glowing along the top.
   * **Dual Viewing Modes:** Toggle between a smooth swipeable **Filmstrip view** and an aesthetic **Scrapbook Grid view** displaying all 25 memories!
   * Realistic Polaroid frames with washi tape, alternating rotations, and custom captions.
   * **Full-Featured Lightbox:** Tap any photo to enlarge; browse smoothly through all 25 photos using left/right arrows, keyboard arrow keys, or mobile touch swiping!
5. **The Birthday Letter:**
   * 3D digital envelope with crimson wax seal.
   * Tapping breaks the wax seal and flips open the flap in 3D perspective.
   * Scrollable parchment paper letter smoothly slides out with romantic typography and cursive signature.
6. **The Scratch Card (The Real Gift Reveal):**
   * Digital metallic scratch-off lottery ticket using HTML5 Canvas.
   * Scratch with finger or mouse to peel away the metallic layer.
   * Reaching 70% scratched automatically reveals the gold VIP voucher with confetti!
7. **The Virtual Bouquet:**
   * Peaceful glowing seeds waiting in soil.
   * Tapping each seed animates stems growing, leaves sprouting, and vibrant flowers blooming.
   * Once all bloom, reveals *"Happy Birthday to my favorite flower. 🌸"*.
8. **Our Soundtrack (Vinyl Record Player):**
   * Retro aesthetic turntable record player with rotating tonearm and spinning vinyl record.
   * Floating musical notes rise while the track plays.
   * Displays personalized commentary and favorite lyrics in a glowing story card.
9. **A Special Guest (The Video Message - Grand Finale):**
   * Elegant, floating glassmorphic video player with soft glowing drop shadow.
   * Custom frosted glass play button with paw icon.
   * Plays your local video (`assets/video/Final_meow.mp4`) inline (`playsinline`).
   * Automatically pauses the background soundtrack while playing so the cat meows/audio are crystal clear!
   * Celebratory confetti blast when the video finishes, with a button to relive the entire surprise from the start.

---

## 🌐 Free 1-Click Deployment

* **GitHub Pages:** Push to a repository, go to `Settings > Pages`, and select the main branch.
* **Netlify:** Drag and drop the `Birthday surprise` folder directly into [Netlify Drop](https://app.netlify.com/drop).
* **Vercel:** Run `npx vercel` or import the GitHub repository.
