# Game 1: Guess the Number - Dev Log

## Session 1: Project Setup & Core Game

### What We Built
- Complete "Guess the Number" game using Phaser.js 3
- Three scenes: MenuScene, GameScene, GameOverScene
- Full game loop: Menu -> Play -> Game Over -> Play Again

---

### Concept 1: Phaser.js & Game Config

**What is Phaser.js?**
A 2D game framework for browser games. Instead of manually drawing on a `<canvas>`, Phaser gives us scenes, input handling, rendering, and a game loop (~60fps updates).

**Game Config** is the entry point — a JavaScript object that tells Phaser how to set up the game:
- `type: Phaser.AUTO` — lets Phaser pick the best renderer (WebGL or Canvas)
- `width: 800, height: 600` — game canvas size, a common default for browser games
- `parent: 'game-container'` — which HTML element holds the canvas
- `scene: [MenuScene, GameScene, GameOverScene]` — array of scenes, first one loads automatically
- `scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }` — scales the game to fit the window while preserving aspect ratio, adds letterbox bars if needed

**Decision:** We removed `physics` config because this game doesn't need moving objects or gravity. Only add what you need.

---

### Concept 2: Why Canvas Over HTML?

- **HTML divs/buttons** — browser recalculates layout on every change ("reflow"). Fine for websites, bad for games updating 60 times per second.
- **Canvas** — like a drawing board, you draw pixels directly. No layout recalculation. Fast for animations, sprites, particles.
- Canvas gives **pixel-level control** over positioning.
- We still used HTML `<input>` for text entry (hybrid approach) because Phaser doesn't have built-in text inputs, and typing on a real input field is better UX.

---

### Concept 3: Project Structure

We chose **scene-based separation** — each scene in its own file:

```
01-guess-the-number/
  index.html          <- Entry point, loads Phaser + scripts
  main.js             <- Game config only
  scenes/
    MenuScene.js      <- Title screen, difficulty select
    GameScene.js      <- Core gameplay logic + UI
    GameOverScene.js  <- Results, play again
```

**Why not over-engineer?** For a small game, scene-based separation is enough. Architecture should grow with complexity — Game 2 might need `managers/` or `utils/`, but not this one.

---

### Concept 4: Scenes & Transitions

**Scenes** are like screens — each one has its own `create()` method that runs when the scene starts.

**Switching scenes:**
```js
this.scene.start('GameScene', { difficulty: 'Easy', maxNumber: 50 })
```

**Receiving data:**
```js
create(data) {
    console.log(data.difficulty);  // "Easy"
    console.log(data.maxNumber);   // 50
}
```

**Key learning:** When you change a data structure (e.g., renaming `range` to `max`), you must update every place that reads from it. This was a real bug we caught during review.

---

### Concept 5: `setOrigin(0.5)`

By default, Phaser positions objects from the **top-left corner**. So `text at (400, 300)` means the top-left of the text is at center screen — the text itself extends to the right and below.

`setOrigin(0.5)` shifts the anchor to the **center** of the object. Now `(400, 300)` truly centers the text on screen. Essential for centering anything.

---

### Concept 6: Interactive Objects (Buttons)

Phaser has no built-in buttons. You make any object clickable:

```js
text.setInteractive({ useHandCursor: true })
    .on('pointerover', () => text.setTint(0x00ff88))   // hover
    .on('pointerout', () => text.clearTint())           // unhover
    .on('pointerdown', () => { /* click action */ })    // click
```

**Used a data-driven loop** for difficulty buttons — an array of objects + `forEach`. Adding a 4th difficulty = just one more object in the array.

---

### Concept 7: Game Logic

- **Random number:** `Phaser.Math.Between(1, max)`
- **Input validation:** Check for NaN, out of range before processing
- **Proximity hint:** Calculate `Math.abs(guess - secret)`, if within 5 show "Very close!"
- **Order matters:** Determine direction (Too High/Too Low) first, then check proximity. Direction is primary info, closeness is bonus.
- **Win/Lose conditions:** Correct guess = win, 10 attempts exhausted = lose
- **Delayed transitions:** `this.time.delayedCall(2000, callback)` — gives player time to read feedback before scene change

---

### Concept 8: Cleanup with shutdown()

When leaving a scene, you need to clean up — especially HTML elements that live outside Phaser's canvas.

```js
this.events.on('shutdown', this.shutdown, this);
```

Phaser doesn't auto-call a method named `shutdown` — you must register it. Without this, HTML inputs stay visible when switching scenes.

---

### Mistakes & Lessons

1. **Forgot to update references after renaming data** — changed `range` to `max` in the array but `diff.range` was still used in the button text. Lesson: when changing data structures, search for all usages.

2. **Tried CSS flexbox + Phaser scale centering together** — they conflicted. Lesson: let one system handle positioning, not two.

3. **Added physics config that wasn't needed** — removed it. Lesson: don't add features "just in case." Keep it lean.

4. **Race condition awareness** — the proximity "bold text" effect resets after 1.5s via delayed call. If player guesses again within 1.5s, the reset fires on the new feedback. Not critical here, but important pattern to know for future games.

---

### What's Done

- [x] Project setup (index.html + Phaser CDN)
- [x] MenuScene (title, difficulty select)
- [x] GameScene (guessing, hints, proximity, attempts limit)
- [x] GameOverScene (win/lose, stats, play again)
- [x] Full scene loop working

---

### Concept 9: Game Modes (Relax vs Timer)

**Two-step menu flow:** Pick difficulty first, then pick mode. Keeps the UI clean — one decision per screen.

**Toggling visibility:** When hiding interactive objects, always pair visibility with interactivity:
- Hide: `btn.setVisible(false).disableInteractive()`
- Show: `btn.setVisible(true).setInteractive()`

An invisible object that's still interactive = ghost clicks. A common bug in game UI.

**Timer implementation:**
- `this.time.addEvent({ delay: 1000, callback, loop: true })` — runs every second
- Timer turns red at 5 seconds — visual urgency
- Timer is removed on win, on time-up, and in shutdown cleanup
- Each mode has one pressure mechanic: Relax = limited attempts, Timer = limited time

**Design decisions:**
- Timer mode has no attempt limit (time is the only pressure)
- Timer durations: Easy 30s, Medium 60s, Hard 90s
- `timeLimit` stored in the difficulties array alongside name and max

---

### Concept 10: Local Storage — Best Scores

**localStorage** stores key-value string pairs in the browser. Persists across sessions.

**Key structure:** Separate keys per combo — `best_Easy_relax`, `best_Hard_timer`, etc. Simple, no JSON parsing needed.

**Save logic (GameScene.saveBestScore):**
- Only saves on win
- Compares current attempts to stored best
- Lower is better — saves only if fewer attempts
- Returns `true/false` for "is new best"

**Display logic (GameOverScene):**
- Receives `isNewBest` flag from GameScene (avoids duplicate logic)
- Shows "New Best!" in green, or "Best: X" in gray

**Lesson learned:** Don't duplicate logic between scenes. Pass computed results (like `isNewBest`) rather than re-computing in the receiving scene. This caused a `this.attempts` bug — GameOverScene doesn't have `this.attempts`, only `data.attempts`.

---

### What's Done

- [x] Project setup (index.html + Phaser CDN)
- [x] MenuScene (title, difficulty select, mode select)
- [x] GameScene (guessing, hints, proximity, attempts limit)
- [x] GameScene — Timer mode (countdown pressure)
- [x] GameOverScene (win/lose, stats, best score, play again)
- [x] Local storage for best scores
- [x] Full scene loop working

### What's Next

- [ ] Visual polish (warm colors, styled theme)
- [ ] Dev blog post
- [ ] Deploy to portfolio
