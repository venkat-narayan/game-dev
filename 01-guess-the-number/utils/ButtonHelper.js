function createStyledButton(scene, x, y, label, onClick, options = {}) {
        const width  = options.width  || 280;
        const height = options.height || 54;
        const bgColor = options.bgColor || 0x4a2a15;
        const bgAlpha = options.bgAlpha || 0.55;
        const radius  = options.radius  || 12;
        const textColor = options.textColor || '#fff0dd';
        const strokeColor = options.strokeColor || '#996633';
        const fontSize = options.fontSize || '28px';

        // Background rectangle
        const bg = scene.add.rectangle(0, 0, width, height, bgColor)
            .setStrokeStyle(2, strokeColor)
            .setAlpha(bgAlpha);

        // Text
        const text = scene.add.text(0, 0, label, {
            fontSize: fontSize,
            fontFamily: 'Arial Black, Arial',
            fill: textColor,
            stroke: '#66441e',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Container
        const container = scene.add.container(x, y, [bg, text]);
        container.setSize(width, height);
        container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

        // Hover / active effects
        container
            .on('pointerover', () => {
                bg.setFillStyle(0x664422, bgAlpha + 0.15);
                text.setFill('#ffddaa');
                container.setScale(1.04);
            })
            .on('pointerout', () => {
                bg.setFillStyle(bgColor, bgAlpha);
                text.setFill(textColor);
                container.setScale(1);
            })
            .on('pointerdown', () => {
                bg.setFillStyle(0x3a1e0a, bgAlpha + 0.2);
                scene.time.delayedCall(80, () => {
                    if (container.input && container.input.enabled) {
                        bg.setFillStyle(0x553315, bgAlpha + 0.1);
                    }
                });
            })
            .on('pointerup', onClick);

        return container;
    }