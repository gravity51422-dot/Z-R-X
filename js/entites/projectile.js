/**
 * Z⧋R⟠X // SYSTEM_CONFLICT
 * Projectile (Bullet) Module
 */

class Projectile {
    constructor(x, y, angle, damage, ownerId) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 12;
        this.damage = damage;
        this.ownerId = ownerId;
        this.active = true;
        this.distanceTraveled = 0;
        this.maxDistance = 600;
    }

    update() {
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;

        this.x += vx;
        this.y += vy;
        this.distanceTraveled += this.speed;

        if (this.distanceTraveled > this.maxDistance) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // 레이저 형태의 발사체
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f0ff';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-15, 0);
        ctx.stroke();

        ctx.restore();
    }
}
