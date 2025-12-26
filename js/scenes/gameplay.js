/**
 * Z⧋R⟠X // SYSTEM_CONFLICT
 * Gameplay Core Logic Controller
 */

class GameplayController {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.obstacles = [];
        
        this.isRunning = false;
        this.input = { x: 0, y: 0, angle: 0, shooting: false };
        
        this.setupInput();
    }

    /**
     * 게임 세션 초기화
     * @param {Object} charData - 선택된 캐릭터 스탯
     * @param {Object} mapData - 선택된 맵 데이터
     */
    start(charData, mapData) {
        console.log("GAMEPLAY_INIT: Initializing conflict session...");
        
        this.obstacles = mapData.elements.obstacles;
        
        // 플레이어 생성 (스폰 포인트 적용)
        const spawn = mapData.elements.spawn_points.p1;
        this.player = new Player(spawn.x, spawn.y, charData, true);
        
        // 적 유닛 생성 (예시로 P2 스폰 지점에 봇 생성)
        const enemySpawn = mapData.elements.spawn_points.p2;
        // 실제 구현 시 상대 플레이어 혹은 AI 데이터를 넣습니다.
        
        this.isRunning = true;
    }

    setupInput() {
        // 키보드 조작 (WASD)
        const keys = {};
        window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

        // 마우스 위치 (조준 방향)
        window.addEventListener('mousemove', e => {
            if (!this.player) return;
            const dx = e.clientX - this.player.x;
            const dy = e.clientY - this.player.y;
            this.input.angle = Math.atan2(dy, dx);
        });

        // 발사 이벤트
        window.addEventListener('mousedown', () => this.input.shooting = true);
        window.addEventListener('mouseup', () => this.input.shooting = false);

        this.updateInput = () => {
            this.input.x = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
            this.input.y = (keys['s'] || keys['arrowdown'] ? 1 : 0) - (keys['w'] || keys['arrowup'] ? 1 : 0);
        };
    }

    update(delta) {
        if (!this.isRunning) return;

        this.updateInput();

        // 1. 플레이어 업데이트
        this.player.update(this.input, delta);

        // 2. 발사 로직
        if (this.input.shooting) {
            this.shoot();
        }

        // 3. 발사체 업데이트 및 충돌 검사
        this.projectiles = this.projectiles.filter(p => {
            p.update();
            
            // 맵 장애물 충돌 검사
            let hitObstacle = false;
            this.obstacles.forEach(obs => {
                if (p.x > obs.x && p.x < obs.x + obs.width && 
                    p.y > obs.y && p.y < obs.y + obs.height) {
                    hitObstacle = true;
                }
            });

            return p.active && !hitObstacle;
        });

        // 4. 캐릭터-장애물 충돌 (간단한 처리)
        this.checkObstacleCollision();
    }

    shoot() {
        const now = Date.now();
        if (now - this.player.lastShotTime > this.player.config.stats.cooldown) {
            const bullet = new Projectile(
                this.player.x, 
                this.player.y, 
                this.input.angle, 
                this.player.config.stats.damage, 
                'player'
            );
            this.projectiles.push(bullet);
            this.player.lastShotTime = now;
            
            if (typeof AudioManager !== 'undefined') {
                AudioManager.play('LASER_SHOOT');
            }
        }
    }

    checkObstacleCollision() {
        this.obstacles.forEach(obs => {
            // 원형 플레이어와 직사각형 장애물의 간단한 충돌 판정
            if (this.player.x + this.player.radius > obs.x && 
                this.player.x - this.player.radius < obs.x + obs.width &&
                this.player.y + this.player.radius > obs.y && 
                this.player.y - this.player.radius < obs.y + obs.height) {
                
                // 위치 보정 로직 (간소화됨)
                this.player.x -= this.input.x * this.player.speed;
                this.player.y -= this.input.y * this.player.speed;
            }
        });
    }

    render() {
        if (!this.isRunning) return;

        // 발사체 렌더링
        this.projectiles.forEach(p => p.draw(this.ctx));
        
        // 플레이어 렌더링
        this.player.draw(this.ctx);
        
        // 적군 렌더링 (있는 경우)
        this.enemies.forEach(e => e.draw(this.ctx));
    }

    stop() {
        this.isRunning = false;
    }
}

// 인스턴스화 대기 (Main Engine에서 생성함)
window.Gameplay = null;
