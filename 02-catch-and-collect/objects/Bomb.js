// Bomb game object
// Handles creation, physics setup, and future animations/sounds

class Bomb {
    static create(scene, round) {
        const x = Phaser.Math.Between(30, 350);
        const bomb = scene.add.sprite(x, -24, 'bomb');
        scene.bombs.add(bomb);
        bomb.body.setCircle(18, 2, 10);
        bomb.body.setVelocityY(50 + (round - 1) * 80);
        return bomb;
    }

    // Future: static onHit(bomb, scene) { play explosion sound, flash screen red }
    // Future: static onDodge(bomb, scene) { play whoosh sound }
}
