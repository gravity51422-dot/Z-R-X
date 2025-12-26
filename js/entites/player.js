/**
 * Z⧋R⟠X // SYSTEM_CONFLICT
 * Player Entity Module
 */

class Player {
    constructor(x, y, config, isLocal = true) {
        this.x = x;
        this.y = y;
        this.config = config; // characters.json에서 넘어온 데이터
        this.isLocal = isLocal;

        // 가변 상태 변수
        this.hp = config.stats.integrity;
        this.maxHp = config.stats.integrity;
        this.speed = config.stats.speed;
        this.radius = 20;
        this.angle = 0;
        
        // 입력 상태
        this.movement = { x: 0, y: 0 };
        this.lastShotTime = 0;
        
        // 시각 효과용
        this.glitchTimer = 0;
    }

    update(input, delta) {
        // 1. 이동 로직
        if (this.isLocal) {
            this.x += input.x * this.speed;
            this.y += input.y * this.speed;
            this.angle = input.angle;
        }

        // 2. 화면 경계 제한
        this.x = Math.max(this.radius, Math.min(window.innerWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(window.innerHeight - this.radius, this.y));

        // 3. 글리치 애니메이션 타이머
        this.glitchTimer += delta;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // 몸체 (삼각형/다각형 형태의 코어)
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(-15, -15);
        ctx.lineTo(-15, 15);
        ctx.closePath();

        // 메인 컬러 (무결성 상태에 따라 색상 변화 가능)
        ctx.fillStyle = this.isLocal ? '#00f0ff' : '#ff003c';
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();

        // 글리치 잔상 효과
        if (Math.random() > 0.8) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(-20 + Math.random()*10, -20, 40, 40);
        }

        ctx.restore();

        // 체력 바 (엔티티 머리 위)
        this.drawHealthBar(ctx);
    }

    drawHealthBar(ctx) {
        const barWidth = 50;
        const barHeight = 4;
        const px = this.x - barWidth / 2;
        const py = this.y - 35;

        ctx.fillStyle = '#111';
        ctx.fillRect(px, py, barWidth, barHeight);

        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = hpPercent > 0.3 ? '#00f0ff' : '#ff003c';
        ctx.fillRect(px, py, barWidth * hpPercent, barHeight);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (typeof AudioManager !== 'undefined') AudioManager.play('CORE_HIT');
        if (this.hp <= 0) this.onDeath();
    }

    onDeath() {
        console.log("SYSTEM_FAILURE: Player Core Destroyed.");
        if (typeof AudioManager !== 'undefined') AudioManager.play('SYSTEM_CRASH');
    }
}
