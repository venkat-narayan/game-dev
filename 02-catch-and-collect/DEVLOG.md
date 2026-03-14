# Hoop Hustle — Dev Log

## Session 1 — March 14, 2026

### From Static to Dynamic: Building My First Real-Time Game

Game 1 was a number guessing game — essentially a static clicker where the player types a number and gets a response. Today I built something fundamentally different. Hoop Hustle is a **dynamic system**: gravity pulls objects, timers spawn hazards, and the player has to manage lives and a countdown — all at 60 frames per second. This was a massive jump in technical depth.

---

### What I Learned

#### 1. Arcade Physics — Gravity and Velocity

Everything in Game 1 was player-initiated. Click a button, something happens. In Game 2, the game world has its own rules. I set up Phaser's Arcade Physics with gravity on the Y-axis, and suddenly objects fall on their own — no player input needed. The key insight: **gravity is acceleration, not speed**. At `y: 300`, objects gain 300 pixels/second *every second*. They start slow and get faster, which creates that natural "falling" feel.

I also learned that not everything should have gravity. The basket stays at the bottom (gravity off), the balls fall from the sky (gravity on), and the UI text just sits there (not a physics object at all). You choose what participates in the physics world.

#### 2. Physics Groups and Collision Detection

When you have dozens of falling balls, you can't check each one individually against the basket. Phaser's **Physics Groups** let you treat a collection of objects as one unit. I created separate groups for balls and bombs, then set up overlap detection between the basket and each group.

The reason for separate groups was an important architecture decision: balls and bombs look similar (both are falling circles), but they trigger completely different logic. Catching a ball means +10 points. Catching a bomb means losing a life. One overlap rule per group keeps the code clean and readable.

#### 3. Spawning with Timed Events

Games need things to happen on a schedule. Phaser's `time.addEvent()` lets you say "do this every N milliseconds, forever." I used it to spawn a new basketball every 1.5 seconds and a new bomb every 3 seconds. Combined with `time.delayedCall()`, I made bombs appear only after a 10-second safe period — giving the player time to get comfortable before the danger starts.

#### 4. The Invisible Problem — Memory Leaks

This was the most eye-opening lesson. Once a ball falls past the bottom of the screen, the player can't see it anymore — but the computer still tracks it. The physics engine still calculates its position, its velocity, its potential collisions. After 2 minutes of gameplay, there could be 80+ invisible balls being processed every frame.

In a simple game like this, 80 objects won't crash anything. But in a bullet-hell game with thousands of projectiles? The game would lag, stutter, and eventually crash. The fix: check every frame if an object has left the screen, and `destroy()` it. **What the player can't see, the game shouldn't be tracking.**

---

### Mistakes I Made (and What They Taught Me)

#### Manual Boundary Checks vs. Framework Features

My first instinct to keep the basket on screen was to write manual `if` statements:
```js
if (this.basket.x < 40) this.basket.x = 40;
if (this.basket.x > 440) this.basket.x = 440;
```
This works, but those numbers (40 and 440) are hardcoded based on the basket being 80px wide. If I change the basket width to 120px, those numbers break silently — no error, just wrong behavior.

The Phaser way: `setCollideWorldBounds(true)`. One line. It handles any object size, any screen size, automatically. **Lesson: before writing custom logic, check if the framework already solves the problem.**

#### fontWeight vs. fontStyle

I used `fontWeight: 'bold'` in my text styles, but Phaser silently ignores it — it uses `fontStyle: 'bold'` instead. No error, no warning, just text that isn't bold. This taught me that **silent failures are the hardest bugs to catch**. The code runs fine; it just doesn't do what you expect.

#### Double-Trigger Game Over

I discovered that game over could fire twice — once from the timer hitting zero and once from losing your last life in the same frame. The fix was a simple boolean flag (`isGameOver`), checked at the top of every method that could end the game. **Lesson: in game dev, things happen simultaneously. Always guard against race conditions.**

---

### Architecture Decisions

#### The PromoteScene — Separation of Concerns

Originally, round transitions happened inside GameScene — show a "Round Complete!" text, wait 2 seconds, then start the next round. But I noticed the physics engine kept running in the background during the transition. Objects were still falling behind the announcement text.

My solution: create a dedicated **PromoteScene** that handles the entire transition. When a round ends, GameScene fully stops and hands off to PromoteScene. The player sees their stats, a preview of the next round's difficulty, and gets to choose: continue, restart, or quit. When they click "Next Round," PromoteScene passes the score, lives, and round number back to GameScene.

This was my first real experience with **scene-based architecture**. Each scene does one job:
- **MenuScene** — start the game
- **GameScene** — gameplay only
- **PromoteScene** — round transition + player choice
- **GameOverScene** — final results

#### The Big Refactor — assets/, objects/, utils/

By the end, GameScene was ~280 lines doing too many things: drawing textures, rendering clouds, creating buttons, managing physics, handling UI. I refactored into a clean structure:

```
assets/      → textures.js, background.js (visual creation)
objects/     → Basketball.js, Bomb.js, Basket.js (game entities)
utils/       → ButtonHelper.js, UIHelper.js (shared helpers)
scenes/      → MenuScene, GameScene, PromoteScene, GameOverScene
```

After the refactor, GameScene dropped to ~120 lines of pure game logic. Each file has one responsibility. Adding sounds or animations later means extending the object classes, not bloating GameScene.

#### The Color Config Idea

One thing I'd do differently: create a global config for my color palette. I kept typing hex codes like `0xFF8C00` and `0xFFA500` throughout the codebase. A single `theme.js` file with named colors (`BASKETBALL_ORANGE`, `BOMB_DARK`, `SKY_BLUE`) would make the code more readable and make it trivial to change the game's visual theme later.

---

### Game 1 vs. Game 2 — The Complexity Jump

| Aspect | Game 1 (Guess the Number) | Game 2 (Hoop Hustle) |
|--------|--------------------------|----------------------|
| Interaction | Click/type, wait for response | Real-time, continuous input |
| Game Loop | Not needed | Runs 60x/second |
| Physics | None | Gravity, velocity, collisions |
| Objects | Static text and buttons | Dynamic spawning entities |
| State | Simple (guess count, target) | Complex (score, lives, timer, round) |
| Architecture | 3 scenes, ~50 lines each | 4 scenes + assets + objects + utils |

Game 1 was a conversation. Game 2 is a simulation.

---

### What's Next

- **Sounds** — catch swoosh, bomb explosion, background music
- **Animations** — ball spinning while falling, bomb fuse flickering, screen shake on bomb hit
- **Touch controls** — make it playable on mobile
- **Polish** — particle effects, score popups, visual feedback

The foundation is solid. The architecture is ready to scale. Time to make it *feel* like a real game.
