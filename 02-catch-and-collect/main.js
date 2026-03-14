const config = {
    type: Phaser.AUTO,
    width: 380,
    height: 680,
    backgroundColor: '#FFCC33',
    scale: {
        mode: Phaser.Scale.FIT,           // Scale to fit the container
        autoCenter: Phaser.Scale.CENTER_BOTH  // Center on screen
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, PromoteScene, GameOverScene]
};

const game = new Phaser.Game(config);