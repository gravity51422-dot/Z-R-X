/**
 * Z⧋R⟠X // SYSTEM_CONFLICT
 * Menu & UI Interaction Controller
 */

class MenuController {
    constructor() {
        this.menuScreen = document.getElementById('screen-menu');
        this.lobbyScreen = document.getElementById('screen-lobby');
        this.mapScreen = document.getElementById('screen-map');
        
        this.isGlitching = false;
        this.setupEventListeners();
    }

    /**
     * 초기 이벤트 바인딩
     */
    setupEventListeners() {
        // 모든 버튼에 호버 시 사운드 및 글리치 효과 추가
        const buttons = document.querySelectorAll('.btn-action, .data-card');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.triggerUIFeedback('hover');
            });

            btn.addEventListener('click', () => {
                this.triggerUIFeedback('click');
            });
        });

        // 특정 로그 텍스트에 랜덤 글리치 부여
        setInterval(() => this.randomTextGlitch(), 3000);
    }

    /**
     * UI 상호작용 시 사운드 및 시각적 피드백 실행
     */
    triggerUIFeedback(type) {
        if (typeof AudioManager === 'undefined') return;

        if (type === 'hover') {
            // 미세한 노이즈 사운드 (구현된 경우)
        } else if (type === 'click') {
            AudioManager.play('UI_CLICK');
            this.screenShake();
        }
    }

    /**
     * 화면 흔들림 효과 (시스템 충돌 테마)
     */
    screenShake() {
        document.body.classList.add('shaking');
        setTimeout(() => {
            document.body.classList.remove('shaking');
        }, 200);
    }

    /**
     * 터미널 로그에 랜덤한 에러 메시지 삽입
     */
    randomTextGlitch() {
        const logs = document.getElementById('system-logs');
        if (!logs) return;

        const errorMsgs = [
            "> WARNING: MEMORY_LEAK_DETECTED",
            "> ERROR: UNKNOWN_NODE_ACCESS",
            "> ALERT: INTEGRITY_DEGRADATION",
            "> SYSTEM: RE-CALIBRATING..."
        ];

        const randomMsg = errorMsgs[Math.floor(Math.random() * errorMsgs.length)];
        const newLog = document.createElement('div');
        newLog.className = 'text-red-500 opacity-70';
        newLog.innerHTML = randomMsg;

        logs.appendChild(newLog);
        
        // 로그가 너무 많아지면 오래된 것 삭제
        if (logs.children.length > 8) {
            logs.removeChild(logs.firstChild);
        }

        // 효과음 재생
        if (typeof AudioManager !== 'undefined' && Math.random() > 0.7) {
            AudioManager.play('UI_GLITCH');
        }
    }

    /**
     * 캐릭터 선택 시 세부 스탯 표시 업데이트
     */
    updateStatDisplay(charData) {
        // 인게임 UI에 캐릭터 정보 동적 반영
        console.log(`MENU_SYNC: Core [${charData.id}] stability sync complete.`);
    }
}

// 메뉴 컨트롤러 인스턴스 생성
window.Menu = new MenuController();
