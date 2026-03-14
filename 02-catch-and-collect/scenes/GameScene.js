class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create(data) {
        // 1. Initialize State
        this.score = data.score || 0;
        this.lives = data.lives || 3;
        this.timeLeft = 60;
        this.round = data.round || 1;
        this.isGameOver = false;

        // 2. Set gravity for current round
        this.physics.world.gravity.y = 300 + (this.round - 1) * 150;

        // 3. Textures & Background
        createGameTextures(this);
        drawGradientSky(this);
        drawClouds(this, [{ x: 50, y: 120 }, { x: 300, y: 80 }]);

        // 4. Create player basket
        this.basket = new Basket(this);
        this.cursors = this.input.keyboard.createCursorKeys();

        // 5. HUD
        const hud = UIHelper.createHUD(this, this.score, this.lives, this.round);
        this.scoreText = hud.scoreText;
        this.timerText = hud.timerText;
        this.livesText = hud.livesText;
        this.roundText = hud.roundText;

        // 6. Physics Groups
        this.balls = this.physics.add.group();
        this.bombs = this.physics.add.group();

        // 7. Overlap Detection
        this.physics.add.overlap(this.basket.getSprite(), this.balls, this.catchBall, null, this);
        this.physics.add.overlap(this.basket.getSprite(), this.bombs, this.hitBomb, null, this);

        // 8. Start spawning
        this.startRoundSpawners();

        // 9. Timer Countdown
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.isGameOver) return;
                this.timeLeft--;
                this.timerText.setText(`${this.timeLeft}s`);
                if (this.timeLeft <= 0) this.roundComplete();
            },
            loop: true
        });
    }

    startRoundSpawners() {
        this.ballTimer = this.time.addEvent({
            delay: 1500,
            callback: () => { if (!this.isGameOver) Basketball.create(this, this.round); },
            loop: true
        });

        const bombDelay = Math.max(0, 10000 - (this.round - 1) * 5000);

        if (bombDelay === 0) {
            this.bombTimer = this.time.addEvent({
                delay: 3000,
                callback: () => { if (!this.isGameOver) Bomb.create(this, this.round); },
                loop: true
            });
        } else {
            this.bombStartTimer = this.time.delayedCall(bombDelay, () => {
                this.bombTimer = this.time.addEvent({
                    delay: 3000,
                    callback: () => { if (!this.isGameOver) Bomb.create(this, this.round); },
                    loop: true
                });
            });
        }
    }

    stopSpawners() {
        if (this.ballTimer) this.ballTimer.remove();
        if (this.bombTimer) this.bombTimer.remove();
        if (this.bombStartTimer) this.bombStartTimer.remove();
    }

    roundComplete() {
        this.isGameOver = true;
        this.stopSpawners();
        sfx.roundComplete();
        this.scene.start('PromoteScene', {
            score: this.score,
            lives: this.lives,
            round: this.round
        });
    }

    catchBall(basketSprite, ball) {
        if (this.isGameOver) return;
        ball.destroy();
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        sfx.catch();
    }

    hitBomb(basketSprite, bomb) {
        if (this.isGameOver) return;
        bomb.destroy();
        this.lives--;
        this.livesText.setText('❤️'.repeat(this.lives));
        sfx.bomb();
        if (this.lives <= 0) this.gameOver();
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        this.stopSpawners();

        const timeSurvived = (this.round - 1) * 60 + (60 - this.timeLeft);
        const bestScore = localStorage.getItem('bestScore') || 0;

        if (this.score > Number(bestScore)) {
            localStorage.setItem('bestScore', this.score);
        }

        sfx.gameOver();
        this.scene.start('GameOverScene', {
            score: this.score,
            round: this.round,
            timeSurvived: timeSurvived,
            bestScore: Math.max(this.score, Number(bestScore))
        });
    }

    update() {
        if (this.isGameOver) return;

        this.basket.update(this.cursors);

        // Missed balls — lose a life
        this.balls.getChildren().forEach(ball => {
            if (ball.y > 700) {
                ball.destroy();
                this.lives--;
                this.livesText.setText('❤️'.repeat(this.lives));
                sfx.miss();
                if (this.lives <= 0) this.gameOver();
            }
        });

        // Missed bombs — no penalty, just clean up
        this.bombs.getChildren().forEach(bomb => {
            if (bomb.y > 700) {
                bomb.destroy();
            }
        });
    }
}
