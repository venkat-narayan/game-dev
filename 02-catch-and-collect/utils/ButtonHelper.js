// Reusable styled button creator
// Used across MenuScene, PromoteScene, GameOverScene

class ButtonHelper {
    static create(scene, x, y, label, bgColor, strokeColor, callback, options = {}) {
        const width = options.width || 200;
        const height = options.height || 36;
        const fontSize = options.fontSize || '20px';
        const radius = options.radius || 8;

        // Button background
        const btnBg = scene.add.graphics();
        btnBg.fillStyle(bgColor, 1);
        btnBg.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
        btnBg.lineStyle(2, strokeColor);
        btnBg.strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius);

        // Button text
        const btn = scene.add.text(x, y, label, {
            fontSize: fontSize,
            fill: '#FFF',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Hover effects
        btn.on('pointerover', () => btn.setScale(1.05));
        btn.on('pointerout', () => btn.setScale(1));
        btn.on('pointerdown', () => {
            sfx.click();
            callback();
        });

        return { bg: btnBg, text: btn };
    }
}
