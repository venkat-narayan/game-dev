// Basketball game object
// Handles creation, physics setup, and future animations/sounds

class Basketball {
    static create(scene, round) {
        const x = Phaser.Math.Between(30, 350);
        const ball = scene.add.sprite(x, -22, 'basketball');
        scene.balls.add(ball);
        ball.body.setCircle(21, 1, 1);
        ball.body.setVelocityY(50 + (round - 1) * 80);
        return ball;
    }

    // Future: static onCatch(ball, scene) { play swoosh sound, score popup animation }
    // Future: static onMiss(ball, scene) { play thud sound, screen shake }
}
