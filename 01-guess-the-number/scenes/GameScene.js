// scenes/GameScene.js
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create(data) {
        console.log("GameScene loaded!", data);

        // ── Warm backdrop ──────────────────────────────────────
        this.add.rectangle(400, 300, 920, 820, 0x1a0f14).setAlpha(0.6);

        // ── Subtle ambient glows ───────────────────────────────
        this.add.circle(80, 120, 100, 0xffaa55, 0.06);
        this.add.circle(720, 480, 130, 0xff8844, 0.05);
        this.add.rectangle(400, 540, 780, 220, 0xffaa55, 0.025);

        // Game variables
        this.secretNumber = Phaser.Math.Between(1, data.maxNumber);
        console.log("Secret number (for testing):", this.secretNumber);
        this.maxNumber = data.maxNumber;
        this.difficulty = data.difficulty;
        this.mode = data.mode || 'relax';
        this.attempts = 0;
        this.maxAttempts = 10;
        this.showAttemptsLimit = this.mode === 'relax';

        // Show HTML UI
        document.getElementById('game-ui').style.display = 'block';

        // Difficulty display
        this.add.text(400, 80, `Difficulty: ${this.difficulty} (1-${this.maxNumber})`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#ddbb88'
        }).setOrigin(0.5);

        // Prompt
        this.promptText = this.add.text(400, 180, `Guess a number between 1 and ${this.maxNumber}!`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#fff0dd'
        }).setOrigin(0.5);

        // Feedback
        this.feedbackText = this.add.text(400, 260, '', {
            fontSize: '36px',
            fontFamily: 'Arial Black, Arial',
            fill: '#ffcc66',
            align: 'center',
            wordWrap: { width: 700, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // Attempts counter
        this.attemptsText = this.add.text(400, 340, `Attempts: 0${this.showAttemptsLimit ? ' / 10' : ''}`, {
            fontSize: '28px',
            fill: '#ccaa66'
        }).setOrigin(0.5);

        // Timer mode setup
        this.timerEvent = null;
        this.timerText = null;
        if (this.mode === 'timer') {
            this.timeLeft = data.timeLimit;
            this.timerText = this.add.text(400, 410, `Time: ${this.timeLeft}s`, {
                fontSize: '28px',
                fill: '#ccaa66'
            }).setOrigin(0.5);

            this.timerEvent = this.time.addEvent({
                delay: 1000,
                callback: this.updateTimer,
                callbackScope: this,
                loop: true
            });
        }

        // HTML input setup
        const submitBtn = document.getElementById('submitGuess');
        const inputEl = document.getElementById('guessInput');
        submitBtn.onclick = null;
        inputEl.onkeydown = null;
        submitBtn.onclick = () => this.handleGuess(inputEl);
        inputEl.onkeydown = (e) => { if (e.key === 'Enter') submitBtn.click(); };
        inputEl.focus();

        this.events.on('shutdown', this.shutdown, this);
    }

    updateTimer() {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
            this.timerEvent.remove();
            this.handleGameOver(false, 'time');
            return;
        }
        this.timerText.setText(`Time: ${this.timeLeft}s`);
        this.timerText.setFill(this.timeLeft <= 5 ? '#dd6644' : '#ccaa66');
    }

    handleGuess(inputEl) {
        const guess = parseInt(inputEl.value, 10);

        if (isNaN(guess) || guess < 1 || guess > this.maxNumber) {
            this.feedbackText.setText('Enter a number between 1 and ' + this.maxNumber);
            this.feedbackText.setFill('#dd7755');
            return;
        }

        this.attempts++;
        this.attemptsText.setText(`Attempts: ${this.attempts}${this.showAttemptsLimit ? ` / ${this.maxAttempts}` : ''}`);

        inputEl.value = '';
        inputEl.focus();

        if (guess === this.secretNumber) {
            this.handleGameOver(true);
            return;
        }

        // Relax mode: lose on max attempts
        if (this.mode === 'relax' && this.attempts >= this.maxAttempts) {
            this.handleGameOver(false, 'attempts');
            return;
        }

        // Normal hint + proximity
        const diff = Math.abs(guess - this.secretNumber);
        let message = guess < this.secretNumber ? 'Too Low!' : 'Too High!';
        let color = '#ee9944';

        if (diff <= 5 && diff > 0) {
            message += ' Very close!';
            color = '#ffdd66';
            this.feedbackText.setStyle({ fontSize: '52px', fontStyle: 'bold' });
            this.time.delayedCall(1500, () => {
                this.feedbackText.setStyle({ fontSize: '36px', fontStyle: 'normal' });
            });
        }

        this.feedbackText.setText(message);
        this.feedbackText.setFill(color);
    }

    handleGameOver(won, reason = 'attempts') {
        this.disableInput();

        let isNewBest = false;

        if (won) {
            this.feedbackText.setText('Correct! You win!');
            this.feedbackText.setFill('#88cc55');

            isNewBest = this.saveBestScore();

            if (this.timerEvent) this.timerEvent.remove();
            this.time.delayedCall(2200, () => this.goToGameOver(won, isNewBest));
        } else {
            let msg = reason === 'time'
                ? `Time's up! It was ${this.secretNumber}`
                : `Too many attempts! It was ${this.secretNumber}`;
            this.feedbackText.setText(msg);
            this.feedbackText.setFill('#dd6644');

            if (this.timerEvent) this.timerEvent.remove();
            this.time.delayedCall(3000, () => this.goToGameOver(won, isNewBest));
        }
    }

    saveBestScore() {
        if (!this.difficulty || !this.mode) return false;

        const key = `best_${this.difficulty}_${this.mode}`;
        const currentBestStr = localStorage.getItem(key);
        const currentBest = currentBestStr ? parseInt(currentBestStr, 10) : Infinity;

        if (this.attempts < currentBest) {
            localStorage.setItem(key, this.attempts.toString());
            console.log(`New best for ${key}: ${this.attempts} attempts`);
            return true;
        }

        return false;
    }

    goToGameOver(won, isNewBest = false) {
        this.scene.start('GameOverScene', {
            won: won,
            attempts: this.attempts,
            secret: this.secretNumber,
            difficulty: this.difficulty,
            mode: this.mode,
            isNewBest: isNewBest
        });
    }

    disableInput() {
        const inputEl = document.getElementById('guessInput');
        const submitBtn = document.getElementById('submitGuess');
        if (inputEl) inputEl.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
    }

    shutdown() {
        if (this.timerEvent) this.timerEvent.remove();
        const ui = document.getElementById('game-ui');
        if (ui) ui.style.display = 'none';
        const input = document.getElementById('guessInput');
        if (input) {
            input.value = '';
            input.disabled = false;
        }
        const btn = document.getElementById('submitGuess');
        if (btn) btn.disabled = false;
    }
}