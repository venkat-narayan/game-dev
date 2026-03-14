class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        console.log("MenuScene loaded!");

        // ── Warm backdrop ───────────────────────────────────────
        this.add.rectangle(400, 300, 920, 820, 0x1a0f14).setAlpha(0.7);

        // ── Soft ambient glows ──────────────────────────────────
        this.add.circle(120, 100, 100, 0xffaa55, 0.08);
        this.add.circle(680, 500, 130, 0xff8844, 0.06);
        this.add.circle(720, 80, 75, 0xffcc77, 0.05);
        this.add.rectangle(400, 540, 700, 180, 0xffaa55, 0.03);

        // ── Title ───────────────────────────────────────────────
        this.title = this.add.text(400, 180, 'Guess the Number', {
            fontSize: '64px',
            fontFamily: 'Arial Black, Arial',
            fill: '#fff5e6',
            stroke: '#cc8833',
            strokeThickness: 5
        }).setOrigin(0.5);

        // ── Subtitle ────────────────────────────────────────────
        this.subtitle = this.add.text(400, 260, 'Pick a difficulty to start', {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#eeccaa'
        }).setOrigin(0.5);

        // ── Difficulty buttons ──────────────────────────────────
        this.difficultyButtons = [];
        this.difficulties = [
            { name: 'Easy',   max: 50,   timeLimit: 30  },
            { name: 'Medium', max: 100,  timeLimit: 60  },
            { name: 'Hard',   max: 500,  timeLimit: 90  }
        ];

        this.difficulties.forEach((diff, index) => {
            const y = 360 + index * 80;
            const label = `${diff.name} (1-${diff.max})`;

            const btn = createStyledButton(this, 400, y, label, () => {
                this.showModeSelection(diff);
            }, {
                width: 320,
                height: 58,
                fontSize: '28px',
                bgColor: 0x4a2a15,
                bgAlpha: 0.55,
                strokeColor: '#996633',
                textColor: '#fff0dd'
            });

            this.difficultyButtons.push(btn);
        });

        // ── Mode selection (hidden initially) ───────────────────
        this.modeGroup = this.add.group();

        this.modeTitle = this.add.text(400, 280, 'Choose your mode:', {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#eeccaa'
        }).setOrigin(0.5).setVisible(false);

        this.modeGroup.add(this.modeTitle);

        ['Relax', 'Timer'].forEach((mode, index) => {
            const y = 360 + index * 80;

            const btn = createStyledButton(this, 400, y, mode, () => {
                this.startGameWithMode(mode);
            }, {
                width: 260,
                height: 56,
                fontSize: '32px',
                bgColor: 0x4a2a15,
                bgAlpha: 0.55,
                strokeColor: '#996633',
                textColor: '#fff0dd'
            });

            btn.setVisible(false);
            this.modeGroup.add(btn);
        });
    }

    showModeSelection(diff) {
        this.difficultyButtons.forEach(btn => {
            btn.setVisible(false).disableInteractive();
        });
        this.subtitle.setVisible(false);

        this.modeTitle.setVisible(true);
        this.modeGroup.getChildren().forEach(child => {
            if (child !== this.modeTitle) {
                child.setVisible(true).setInteractive();
            }
        });

        this.selectedDiff = diff;
    }

    startGameWithMode(mode) {
        const data = {
            difficulty: this.selectedDiff.name,
            maxNumber: this.selectedDiff.max,
            mode: mode.toLowerCase()
        };

        if (mode === 'Timer') {
            data.timeLimit = this.selectedDiff.timeLimit;
        }

        this.scene.start('GameScene', data);
    }
}