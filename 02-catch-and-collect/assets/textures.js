// Generates all game textures using Phaser graphics (Phase A)
// In Phase B, replace these with loaded sprite images

function createGameTextures(scene) {

    // Basketball texture (44x44) — radius 22
    if (!scene.textures.exists('basketball')) {
        const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0xFF8C00);
        gfx.fillCircle(22, 22, 21);
        gfx.lineStyle(2.5, 0x8B4513);
        gfx.strokeCircle(22, 22, 21);
        gfx.lineStyle(2, 0x8B4513);
        gfx.lineBetween(1, 22, 43, 22);
        gfx.lineBetween(22, 1, 22, 43);
        gfx.generateTexture('basketball', 44, 44);
        gfx.destroy();
    }

    // Bomb texture (40x48) — radius 18
    if (!scene.textures.exists('bomb')) {
        const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
        gfx.fillStyle(0x222222);
        gfx.fillCircle(20, 28, 18);
        gfx.lineStyle(2, 0x000000);
        gfx.strokeCircle(20, 28, 18);
        gfx.lineStyle(3, 0x8B4513);
        gfx.lineBetween(20, 10, 26, 4);
        gfx.fillStyle(0xFF4500);
        gfx.fillCircle(28, 3, 5);
        gfx.fillStyle(0xFFFF00);
        gfx.fillCircle(28, 3, 2.5);
        gfx.generateTexture('bomb', 40, 48);
        gfx.destroy();
    }

    // Basket texture (120x50) — wide hoop with net
    if (!scene.textures.exists('basket')) {
        const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
        // Rim
        gfx.fillStyle(0xFF6600);
        gfx.fillRect(0, 0, 120, 10);
        gfx.lineStyle(2, 0xCC5500);
        gfx.strokeRect(0, 0, 120, 10);
        // Net row 1
        gfx.lineStyle(2, 0xFFFFFF, 0.8);
        gfx.lineBetween(5, 10, 20, 26);
        gfx.lineBetween(20, 26, 35, 10);
        gfx.lineBetween(35, 10, 50, 26);
        gfx.lineBetween(50, 26, 65, 10);
        gfx.lineBetween(65, 10, 80, 26);
        gfx.lineBetween(80, 26, 95, 10);
        gfx.lineBetween(95, 10, 115, 26);
        // Net row 2
        gfx.lineStyle(1.5, 0xFFFFFF, 0.5);
        gfx.lineBetween(20, 26, 35, 42);
        gfx.lineBetween(35, 42, 50, 26);
        gfx.lineBetween(50, 26, 65, 42);
        gfx.lineBetween(65, 42, 80, 26);
        gfx.lineBetween(80, 26, 95, 42);
        gfx.generateTexture('basket', 120, 50);
        gfx.destroy();
    }
}
