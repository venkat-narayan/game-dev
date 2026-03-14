// Basket (player hoop) game object
// Handles creation, movement (keyboard + touch), physics

class Basket {
    constructor(scene) {
        this.scene = scene;
        this.speed = 400;

        // Create sprite with physics
        this.sprite = scene.add.sprite(190, 640, 'basket');
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setAllowGravity(false);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(120, 12);
        this.sprite.body.setOffset(0, 0);

        // Touch tracking
        this.touchActive = false;
        this.touchX = this.sprite.x;

        // Touch/pointer events
        scene.input.on('pointerdown', (pointer) => {
            this.touchActive = true;
            this.touchX = pointer.x;
            sfx.resume(); // Unlock audio on first touch
        });

        scene.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.touchActive = true;
                this.touchX = pointer.x;
            }
        });

        scene.input.on('pointerup', () => {
            this.touchActive = false;
            this.sprite.body.setVelocityX(0);
        });
    }

    update(cursors) {
        // Keyboard takes priority
        if (cursors.left.isDown) {
            this.sprite.body.setVelocityX(-this.speed);
            this.touchActive = false;
        } else if (cursors.right.isDown) {
            this.sprite.body.setVelocityX(this.speed);
            this.touchActive = false;
        } else if (this.touchActive) {
            // Touch follow — move toward finger position
            const diff = this.touchX - this.sprite.x;
            const deadzone = 5;

            if (Math.abs(diff) > deadzone) {
                // Speed proportional to distance for smooth feel
                const moveSpeed = Math.min(Math.abs(diff) * 8, this.speed);
                this.sprite.body.setVelocityX(diff > 0 ? moveSpeed : -moveSpeed);
            } else {
                this.sprite.body.setVelocityX(0);
            }
        } else {
            this.sprite.body.setVelocityX(0);
        }
    }

    getSprite() {
        return this.sprite;
    }
}
