/* ==========================================================================
   🎂 BIRTHDAY SURPRISE CONFIGURATION
   ==========================================================================
   Edit the values below to customize your surprise!
   All text, dates, images, gifts, bouquet flowers, and audio can be updated here.
   ========================================================================== */

const CONFIG = {
  // 1. TARGET DATE & TIME
  // Format: "YYYY-MM-DDTHH:MM:SS" (e.g. "2026-10-15T00:00:00")
  // Set this to midnight on the birthday!
  // TIP: Click the "Preview Mode" badge in the top-left to bypass the countdown anytime.
  TARGET_BIRTHDAY_DATE: "2026-10-15T00:00:00",

  // 2. CELEBRANT'S NAME & YOUR NAME
  BIRTHDAY_PERSON: "Susan",
  YOUR_NAME: "Nikhil",

  // 3. BACKGROUND MUSIC (Landing & Initial Journey)
  // Provide a local path (e.g., "./assets/music/song.mp3") or a web URL to an MP3.
  AUDIO_URL: "./assets/music/first.mp3",

  // 4. BALLOON REASONS (Section 3: "Reasons We Love You")
  // 5 or 6 sweet reasons. Each balloon pops to reveal one card.
  REASONS: [
    {
      title: "Your Radiant Smile",
      text: "The way your eyes crinkle when you really laugh—it instantly lights up any room and turns any tough day around."
    },
    {
      title: "Your Gentle Kindness",
      text: "How deeply and selflessly you care about the people around you. You have a heart of pure gold."
    },
    {
      title: "Our Silly Adventures",
      text: "From impromptu road trips to getting lost finding dessert late at night, every mundane moment with you is an adventure."
    },
    {
      title: "Your Unstoppable Passion",
      text: "The dedication and passion you bring to everything you set your mind to. Watching you succeed is one of my greatest joys."
    },
    {
      title: "Our Quiet Moments",
      text: "Curling up together, drinking tea, talking about everything and nothing. That quiet peace is my favorite place in the world."
    },
    {
      title: "You Are Simply You",
      text: "You are my best friend, my rock, and my favorite person to navigate this crazy, beautiful life with. Happy Birthday!"
    }
  ],

  // 5. POLAROID MEMORIES (Section 4: "A Walk Down Memory Lane")
  // Replace these with your own photo links or local image paths (e.g., "./assets/images/photo1.jpg").
  MEMORIES: [
    { image: "./assets/images/1.jpeg", caption: "Where our story began • The start of forever ✨", date: "Cherished Beginning" },
    { image: "./assets/images/2.jpeg", caption: "Golden hour smiles & sweet laughter 🌅", date: "Sunny Days" },
    { image: "./assets/images/3.jpeg", caption: "That coffee date that lasted all afternoon ☕💛", date: "Warm Memories" },
    { image: "./assets/images/4.jpeg", caption: "Late night drives with our favorite songs 🎶", date: "Road Trips" },
    { image: "./assets/images/5.jpeg", caption: "Exploring new places with my favorite person 🗺️", date: "Adventures" },
    { image: "./assets/images/6.jpeg", caption: "You make the simplest moments extraordinary 🌸", date: "Little Moments" },
    { image: "./assets/images/7.jpeg", caption: "Catching sunsets and making wishes 🌇", date: "Golden Hour" },
    { image: "./assets/images/8.jpeg", caption: "Laughing until our stomachs hurt 😂", date: "Pure Joy" },
    { image: "./assets/images/9.jpeg", caption: "Celebrating small wins and big dreams 🥂", date: "Milestones" },
    { image: "./assets/images/10.jpeg", caption: "Cozy days when the rest of the world fades 🛋️", date: "Peace & Comfort" },
    { image: "./assets/images/11.jpeg", caption: "Your smile that brightens even the rainiest days ☀️", date: "Sunshine" },
    { image: "./assets/images/12.jpeg", caption: "City strolls • Getting lost together in the best way 🏙️", date: "City Lights" },
    { image: "./assets/images/13.jpeg", caption: "Dancing like nobody's watching 💃", date: "Silly Moments" },
    { image: "./assets/images/14.jpeg", caption: "A quiet evening, warm tea, and your hand in mine 🍵", date: "Sweet Peace" },
    { image: "./assets/images/15.jpeg", caption: "Every candid snapshot of you is a work of art 📸", date: "Candid Love" },
    { image: "./assets/images/16.jpeg", caption: "Under the stars talking about our future 🌌", date: "Midnight Talks" },
    { image: "./assets/images/17.jpeg", caption: "The sweetest smile in the entire universe 💖", date: "My Favorite" },
    { image: "./assets/images/18.jpeg", caption: "A day full of sunshine, silliness & memories 🌼", date: "Pure Happiness" },
    { image: "./assets/images/19.jpeg", caption: "Finding magic in every corner with you ✨", date: "Enchantment" },
    { image: "./assets/images/20.jpeg", caption: "My rock, my comfort, my safe haven 🏡", date: "Home With You" },
    { image: "./assets/images/21.jpeg", caption: "An unforgettable trip we'll always cherish ✈️", date: "Wanderlust" },
    { image: "./assets/images/22.jpeg", caption: "You make my heart full in every single way 💕", date: "Unconditional" },
    { image: "./assets/images/23.jpeg", caption: "Picture-perfect day with my picture-perfect girl 🎀", date: "Perfection" },
    { image: "./assets/images/24.jpeg", caption: "My greatest blessing every single day 🙏", date: "Gratitude" },
    { image: "./assets/images/25.jpeg", caption: "25 memories down, a lifetime of love to go 💍✨", date: "Forever & Always" }
  ],

  // 6. FINAL BIRTHDAY LETTER (Section 5: "The Birthday Letter")
  LETTER: {
    greeting: "Dearest babyy,",
    paragraphs: [
      "Happy, happy Birthday! As the clock strikes midnight and another wonderful year of your life begins, I wanted to take a moment to remind you just how deeply loved and cherished you truly are.",
      "Looking back at everything we've shared, I am constantly amazed by how lucky I am to have you by my side. You bring a warmth, a grace, and an infectious laughter to every room you enter. Even on the busiest or most chaotic days, being with you feels like coming home.",
      "Thank you for being my greatest cheerleader, my favorite confidante, and the person who makes even ordinary moments feel extraordinary. Whether we are chasing big dreams or simply sitting together sharing a quiet cup of coffee, life with you is an adventure I never want to end.",
      "As you blow out your candles and step into this new year, my biggest wish for you is boundless happiness, good health, and the realization of every dream you hold close to your heart. May this year be as radiant, kind, and inspiring as you are to everyone lucky enough to know you.",
      "I love you more than words could ever fit on paper. Happy Birthday, my love."
    ],
    closing: "Forever & always yours,",
    signature: "Nikhil"
  },

  // 7. REAL GIFT SCRATCH CARD (Section 6: "The Scratch Card")
  // The surprise revealed underneath the silver/gold lottery scratch card!
  REAL_GIFT: {
    badge: "OFFICIAL BIRTHDAY VOUCHER",
    title: "A Weekend Getaway & Candlelight Dinner 🎫✨",
    subtitle: "Pack your bags! A romantic weekend trip + dinner at your favorite restaurant, all planned and covered.",
    couponCode: "LOVE-BABYY-2026",
    finePrint: "No expiration date • Unlimited cuddles included • Redeemable anytime"
  },

  // 8. VIRTUAL BOUQUET FLOWERS (Section 7: "The Virtual Bouquet")
  // 4 glowing seeds that bloom into colorful flowers when tapped.
  BOUQUET: {
    subtitle: "You make everything grow beautifully. Tap each seed to plant our garden.",
    completionText: "Happy Birthday to my favorite flower. 🌸",
    flowers: [
      { name: "Blush Peony", color: "#ff758f", stemHeight: 110, meaning: "Grace & Prosperity" },
      { name: "Golden Sunflower", color: "#ffd166", stemHeight: 130, meaning: "Warmth & Adoration" },
      { name: "Lavender Rose", color: "#c77dff", stemHeight: 120, meaning: "Enchantment & Love" },
      { name: "Cherry Blossom", color: "#ffb3c1", stemHeight: 105, meaning: "Beauty & New Beginnings" }
    ]
  },

  // 9. OUR SOUNDTRACK (Section 8: "Our Soundtrack")
  // The vinyl player section. The record will physically spin and play this track!
  SOUNDTRACK: {
    songTitle: "Our Song",
    artist: "Nikhil & Susan's Melody",
    // Can be an audio URL or local audio file (e.g., "./assets/music/our-song.mp3")
    audioUrl: "./assets/music/first.mp3",
    tagline: "Every good movie has a soundtrack. Here is ours. 🎵",
    lyrics: [
      "Whenever this melody plays, my mind goes right back to that unforgettable evening...",
      "Laughing in the car with the windows rolled down, singing at the top of our lungs.",
      "You looked over at me with that radiant smile, and the whole world faded away.",
      "No matter where life takes us or how fast the years spin by,",
      "You will always be my absolute favorite rhythm and harmony.",
      "Happy Birthday, Susan. Here's to countless more memories together."
    ]
  },

  // 10. SPECIAL GUEST VIDEO MESSAGE (Section 9: "A Special Guest")
  // A surprise birthday video greeting from assets/video/
  VIDEO_MESSAGE: {
    tagline: "Wait... a very special guest wants to say Happy Birthday too! 🐾",
    videoUrl: "./assets/video/Final_meow.mp4",
    caption: "A special birthday greeting from our favorite little friend! 🐱💖"
  }
};

// Expose configuration globally
window.SURPRISE_CONFIG = CONFIG;
