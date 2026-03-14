class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        console.log("GameOverScene loaded!", data);

        document.getElementById('game-ui').style.display = 'none';

        const isWin = data.won;

        // ── Warm backdrop ──────────────────────────────────────
        this.add.rectangle(400, 300, 920, 820, 0x1a0f14).setAlpha(0.7);

        // ── Ambient glows — warm green for win, warm coral for lose ──
        const glowColor = isWin ? 0x88cc55 : 0xdd6644;
        const alpha = 0.08;

        this.add.circle(140, 100, 110, glowColor, alpha);
        this.add.circle(660, 500, 140, glowColor, alpha * 0.8);
        this.add.circle(720, 80, 80, 0xffaa55, 0.05);
        this.add.rectangle(400, 520, 760, 240, glowColor, alpha * 0.35);

        // ── Title ──────────────────────────────────────────────
        const titleText = isWin ? 'You Win!' : 'Game Over!';
        const titleStroke = isWin ? '#88cc55' : '#dd6644';

        this.add.text(400, 180, titleText, {
            fontSize: '72px',
            fontFamily: 'Arial Black, Arial',
            fill: '#fff5e6',
            stroke: titleStroke,
            strokeThickness: 7
        }).setOrigin(0.5);

        // Secret number
        this.add.text(400, 280, `The number was ${data.secret}`, {
            fontSize: '48px',
            fontFamily: 'Arial Black, Arial',
            fill: '#ffcc66',
            stroke: '#99773a',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Attempts
        this.add.text(400, 360, `Attempts: ${data.attempts}`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: isWin ? '#aacc77' : '#dd8866'
        }).setOrigin(0.5);

        // Best score
        const key = `best_${data.difficulty}_${data.mode}`;
        const best = localStorage.getItem(key);
        let bestDisplay = best ? `Best: ${best}` : 'No best yet';
        let bestColor = '#ddbb88';

        if (data.isNewBest) {
            bestDisplay = 'New Best!';
            bestColor = '#ffcc44';
        }

        this.add.text(400, 420, bestDisplay, {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: bestColor
        }).setOrigin(0.5);

        // Play Again button
        createStyledButton(this, 400, 500, 'Play Again', () => {
            this.scene.start('MenuScene');
        }, {
            width: 280,
            height: 60,
            fontSize: '32px',
            bgColor: 0x4a2a15,
            bgAlpha: 0.55,
            strokeColor: '#996633',
            textColor: '#fff0dd'
        });

        this.events.on('shutdown', this.shutdown, this);
    }

    shutdown() {
        const ui = document.getElementById('game-ui');
        if (ui) ui.style.display = 'none';
    }
}