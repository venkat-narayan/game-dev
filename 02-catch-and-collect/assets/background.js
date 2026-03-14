// Shared background drawing functions for all scenes

function drawGradientSky(scene) {
    const bg = scene.add.graphics();
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFF8C55, 0xFF8C55, 1);
    bg.fillRect(0, 0, 380, 680);
    return bg;
}

function drawDarkBackground(scene) {
    const bg = scene.add.graphics();
    bg.fillGradientStyle(0x2C3E50, 0x2C3E50, 0x8B0000, 0x8B0000, 1);
    bg.fillRect(0, 0, 380, 680);
    return bg;
}

function drawClouds(scene, positions) {
    positions.forEach(({ x, y }) => {
        const cloud = scene.add.graphics();
        cloud.fillStyle(0xFFFFFF, 0.2);
        cloud.fillCircle(x, y, 20);
        cloud.fillCircle(x + 20, y - 5, 15);
        cloud.fillCircle(x + 40, y, 18);
        cloud.fillCircle(x + 15, y + 5, 14);
    });
}

function drawCard(scene, x, y, width, height) {
    const card = scene.add.graphics();
    card.fillStyle(0x000000, 0.5);
    card.fillRoundedRect(x, y, width, height, 16);
    return card;
}
