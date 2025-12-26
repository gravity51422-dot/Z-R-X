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
            
            // 데이터 로드 후 UI 업데이트 (예: 캐릭터 리스트 생성)
            this.setupLobbyUI();
        } catch (error) {
            console.error("BOOT_ERROR: Failed to load system data.", error);
        }

        // 2. 초기 이벤트 바인딩
        this.bindEvents();
        
        // 3. 루프 시작
        this.mainLoop();
    }

    // Lobby 화면에 캐릭터 카드를 동적으로 생성
    setupLobbyUI() {
        const listContainer = document.getElementById('character-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        this.data.characters.forEach((char, index) => {
            const card = document.createElement('div');
            card.className = `data-card ${index === 0 ? 'selected' : ''}`;
            if (index === 0) this.data.selectedCharacter = char;

            card.innerHTML = `
                <div class="text-xs opacity-50">ID: ${char.id}</div>
                <div class="text-xl font-bold mb-2">${char.name}</div>
                <div class="integrity-bar">
                    <div class="integrity-fill" style="width: ${(char.stats.integrity / 200) * 100}%"></div>
                </div>
                <div class="text-[10px] mt-1 text-cyan-500">STABILITY: ${char.stats.stability}%</div>
            `;

            card.onclick = () => {
                this.selectCharacter(char, card);
            };
            listContainer.appendChild(card);
        });
    }

    selectCharacter(char, element) {
        if (typeof AudioManager !== 'undefined') AudioManager.play('UI_GLITCH');
        
        document.querySelectorAll('.data-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
        this.data.selectedCharacter = char;
        console.log("CORE_SYNC: ", char.name);
    }

    bindEvents() {
        // 창 크기 조절 대응
        window.addEventListener('resize', () => this.resize());
        this.resize();

        // 캔버스 클릭 등 전역 이벤트 (사격 로직 연동용)
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state === 'PLAYING') {
                this.handleInput('FIRE', { x: e.clientX, y: e.clientY });
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
        
        // UI 화면 전환 (index.html의 함수 호출)
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
        if (typeof AudioManager !== 'undefined') {
            AudioManager.switchBGM('BATTLE_BGM');
        }
        
        // TODO: Gameplay 인스턴스 초기화 (Player, Enemy 생성)
    }

    handleInput(action, data) {
        // 인게임 조작 데이터 처리
        console.log(`INPUT_DETECTED: ${action}`, data);
    }

    // 메인 업데이트 & 렌더 루프
    mainLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.mainLoop());
    }

    update() {
        if (this.state !== 'PLAYING') return;
        // 물리 엔진 및 개체 상태 업데이트 로직 (Collision, Entities)
    }

    render() {
        const { ctx, canvas } = this;
        
        // 화면 초기화
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
        
        const { ctx } = this;
        const mapConfig = this.data.selectedMap.config;
        
        // 글리치 효과 강도에 따른 화면 흔들림
        ctx.save();
        if (Math.random() < mapConfig.glitch_intensity) {
            ctx.translate(Math.random() * 6 - 3, Math.random() * 6 - 3);
        }

        // 장애물(데이터 블록) 그리기
        const obstacles = this.data.selectedMap.elements.obstacles;
        obstacles.forEach(obj => {
            // 블록 바디
            ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            
            // 글리치 외곽선
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1;
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);

            // 장식용 텍스트 (데이터 느낌)
            ctx.fillStyle = '#00f0ff';
            ctx.font = '8px Fira Code';
            ctx.fillText("0x" + obj.type, obj.x + 5, obj.y + 15);
        });

        ctx.restore();
    }

    drawEntities() {
        // 플레이어 및 발사체 렌더링 대기
    }

    drawHUD() {
        const { ctx, canvas } = this;
        // 상단 Integrity 게이지 (HUD)
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(50, 20, 300, 40);
        
        ctx.strokeStyle = '#00f0ff';
        ctx.strokeRect(50, 20, 300, 40);
        
        ctx.fillStyle = '#00f0ff';
        ctx.font = '12px ZaroxMain';
        ctx.fillText(`INTEGRITY: ${this.data.selectedCharacter.name}`, 60, 35);
    }
}

// 엔진 인스턴스 생성 및 전역 바인딩
const Zarox = new ZaroxEngine();
window.Zarox = Zarox; // 외부(index.html 등)에서 접근 가능하게 설정
