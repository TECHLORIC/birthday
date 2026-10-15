# Project Overview
Build a highly interactive, animated, single-page web application for a personalized digital birthday surprise. The app must be fully mobile-responsive (mobile-first design) and feel magical, romantic, and engaging.

# Technical Stack
* HTML5
* Tailwind CSS (via CDN is fine for simplicity, or set up via standard build process)
* Vanilla JavaScript
* No heavy frameworks required unless strictly necessary for complex animations, but vanilla JS + CSS animations are preferred for a lightweight build.

# Design System
* **Colors:** Soft pastels, dark blue/purple starry night gradients for the opening, warm cozy tones for the letter.
* **UI Style:** Glassmorphism (translucent backgrounds with blur), soft drop shadows, rounded corners.
* **Typography:** Elegant, readable serif or script fonts for headings, clean sans-serif for body text.

# Application Flow & Features

Please build the application with the following sequential sections. The user should progress through them one by one.

## 1. The Gatekeeper (Landing Screen)
* **Visuals:** A dreamy background (starry night or glowing pastels).
* **Logic:** Read a target date/time from a JavaScript constant (set a placeholder date in the code). 
* **State A (Before Midnight):** Display a live countdown timer (Hours, Minutes, Seconds) with the text: "The surprise unlocks at midnight 🎈. Some things are worth the wait."
* **State B (After Midnight):** Hide the countdown. Show a beautiful graphic of a wrapped gift or envelope. Add a button: "Tap to open your surprise."
* **Action:** Clicking the button triggers a confetti animation, plays a background audio track (use a placeholder `<audio>` tag), and smoothly transitions to the next section.

## 2. Make a Wish (The Virtual Cake)
* **Visuals:** A digital birthday cake centered on the screen with a single lit candle (use CSS/SVG for the flame animation).
* **Text:** "First things first... Make a wish and tap the candle to blow it out!"
* **Action:** Tapping the candle stops the flame animation. A "Happy Birthday!" heading appears with a soft glow, and floating sparks fall down the screen. A "Continue" button fades in.

## 3. Pop the Balloons (Reasons We Love You)
* **Visuals:** 5-6 floating, colorful balloons moving gently via CSS animations.
* **Text:** "Pop the balloons to see why you're so special! 🎈"
* **Action:** Tapping a balloon plays a quick CSS pop/scale animation and reveals a hidden text card underneath with a placeholder sweet message (e.g., "[Reason 1]"). Once all balloons are clicked, the "Continue" button appears.

## 4. A Walk Down Memory Lane (Photo Gallery)
* **Visuals:** A cozy background. At the top, CSS/SVG "fairy lights" that gently glow. 
* **Gallery:** 4 to 5 Polaroid-style photo frames hanging below the lights. Use horizontal scrolling or swiping.
* **Content:** Use placeholder `<img>` tags (e.g., via placehold.co) and leave a small `<p>` tag under each for a caption (e.g., "[Location/Year]").

## 5. The Final Surprise (The Birthday Letter)
* **Visuals:** A digital envelope sitting in the center.
* **Text:** "One last thing... Someone wrote you a letter. Tap to open."
* **Action:** Tapping the envelope triggers a CSS animation where the envelope flap opens and a beautifully styled, scrollable piece of parchment slides up/out.
* **Content:** Include placeholder text for a 300-word letter and an elegant signature line at the bottom.

## 6. The Scratch Card (The Real Gift Reveal)
* **Visuals:** A digital "scratch-off" lottery ticket with a glittery or metallic overlay. 
* **Text:** "I couldn't just give you a digital gift... Scratch here to reveal your real present!"
* **Action:** Using HTML5 Canvas, allow the user to click and drag (or swipe on mobile) to "scratch off" the top layer. 
* **Content:** Underneath the scratch layer, reveal a beautifully styled coupon for a real-life gift (e.g., "🎫 Ticket for a Weekend Getaway" or "🍝 One Free Dinner at [Favorite Restaurant]"). Once 70% is scratched off, automatically reveal the whole card with a gentle pop animation.

## 7. The Virtual Bouquet
* **Visuals:** A dark, peaceful background with 3 to 5 glowing "seeds" on the screen.
* **Text:** "You make everything grow beautifully. Tap to plant a garden."
* **Action:** When the user taps a seed, use CSS animations (or SVG drawing paths) to animate a flower growing and blooming from that spot. 
* **Completion:** Once all the seeds are tapped and the screen is filled with a bouquet of animated flowers, a final text fades in over them: "Happy Birthday to my favorite flower."

## 8. Our Soundtrack
* **Visuals:** A retro, aesthetic vinyl record player taking up the center of the screen.
* **Text:** "Every good movie has a soundtrack. Here is ours."
* **Action:** The user taps the play button (or the needle). The vinyl record physically starts spinning (CSS rotation animation), and a specific MP3 track begins to play.
* **Visuals while playing:** As the song plays, floating musical notes gently rise in the background, and a scrolling text box displays their favorite lyrics or a short note about why this song reminds him of her.

## 9. A Special Guest (The Video Message)
* **Visuals:** A beautifully styled video container in the center of the screen. Give the video rounded corners, a soft glowing drop shadow, and perhaps a subtle floating animation before it's played.
* **Text:** "Wait... a very special guest wants to say Happy Birthday too! 🐾"
* **Action:** A custom, elegant "Play" button overlays the video. When the user taps it, the video plays. 
* **Developer Instructions:** Use the HTML5 `<video>` tag. Source the video from the newly created local directory: `assets/video/` (use a placeholder name like `cat-wishing.mp4` in the code). Ensure the video plays inline (`playsinline`) so it doesn't automatically go full-screen on iPhones, and make sure the custom UI hides once the video starts playing.

# Developer Instructions
1. Write clean, well-commented code.
2. Clearly mark the variables in the JavaScript where I need to update the `TARGET_BIRTHDAY_DATE`.
3. Clearly comment the HTML where I need to paste my real image URLs, audio file URL, and custom text.
4. Keep all CSS animations (confetti, balloon floating, popping, candle flicker) contained within standard style blocks or Tailwind arbitrary values.