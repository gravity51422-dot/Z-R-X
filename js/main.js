/**
 * Z⧋R⟠X // SYSTEM_CONFLICT
 * Main Engine & State Manager
 */

class ZaroxEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.state = 'MENU'; // MENU, LOBBY, MAP_SELECT, PLAYING, RESULT
        this.data = {
            characters: [],
            maps: [],
            selectedCharacter: null,
            selectedMap: null
        };

        this.init();
    }

    async init() {
        console.log("SYSTEM_BOOT: Initializing modules...");
        
        // 1. 데이터 로드 (fetch)
        try {
            const charRes = await fetch('data/characters.json');
            const charData = await charRes.json();
            this.data.characters = charData.characters;

            const mapRes = await fetch('data/maps.json');
            const mapData = await mapRes.json();
            this.data.maps = mapData.maps;
            
            console.log("DATA_LOAD: Integrity Cores & Sector Maps linked.");
        } catch (error) {
            console.error("BOOT_ERROR: Failed to load system data.", error);
        }

        // 2. 초기 이벤트 바인딩
        this.bindEvents();
        
        // 3. 루프 시작
        this.mainLoop();
    }

    bindEvents() {
        // 창 크기 조절 대응
        window.addEventListener('resize', () => this.resize());
        this.resize();

        // 캔버스 클릭 등 전역 이벤트 (필요 시)
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state === 'PLAYING') {
                // 인게임 사격 로직 등 연결 지점
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // 화면 전환 핸들러
    changeState(newState) {
        console.log(`STATE_TRANSFER: ${this.state} -> ${newState}`);
        this.state = newState;
        
        // UI 화면 전환 (index.html의 함수 호출 또는 직접 제어)
        if (typeof changeScreen === 'function') {
            const screenMap = {
                'MENU': 'screen-menu',
                'LOBBY': 'screen-lobby',
                'MAP_SELECT': 'screen-map'
            };
            
            if (screenMap[newState]) {
                changeScreen(screenMap[newState]);
            }
        }

        if (newState === 'PLAYING') {
            this.startConflict();
        }
    }

    // 실제 전투 시작 (Gameplay 연결)
    startConflict() {
        if (!this.data.selectedCharacter || !this.data.selectedMap) {
            console.error("EXECUTION_ERROR: Core or Sector not selected.");
            this.changeState('LOBBY');
            return;
        }

        console.log("CONFLICT_START: Synchronizing with", this.data.selectedMap.name);
        AudioManager.switchBGM('BATTLE_BGM');
        
        // 여기서 실제로 Gameplay 인스턴스를 생성하거나 로직을 구동합니다.
    }

    // 메인 업데이트 & 렌더 루프
    mainLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.mainLoop());
    }

    update() {
        if (this.state !== 'PLAYING') return;
        // 게임 물리 엔진 업데이트 (Collision, Movement 등)
    }

    render() {
        const { ctx, canvas } = this;
        
        // 기본 배경 클리어 (테마에 맞는 어두운 색상)
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.state === 'PLAYING') {
            this.drawBackground();
            this.drawEntities();
            this.drawHUD();
        }
    }

    drawBackground() {
        if (!this.data.selectedMap) return;
        
        const mapConfig = this.data.selectedMap.config;
        
        // 글리치 효과 강도에 따른 화면 떨림 연출
        if (Math.random() < mapConfig.glitch_intensity) {
            this.ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
        }

        // 장애물 그리기
        const obstacles = this.data.selectedMap.elements.obstacles;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        obstacles.forEach(obj => {
            this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            // 외곽선 글리치
            this.ctx.strokeStyle = var(--glitch-cyan);
            this.ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        });
    }

    drawEntities() {
        // 플레이어, 총알 등을 그리는 로직이 들어갈 자리입니다.
    }

    drawHUD() {
        // 인게임 상단 Integrity 정보 표시 (Canvas 버전)
    }
}

// 엔진 가동
const Zarox = new ZaroxEngine();
