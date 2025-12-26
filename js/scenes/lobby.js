/**
 * Z⧋R⟠X // SYSTEM_CONFLICT
 * Lobby & Character Selection Controller
 */

class LobbyController {
    constructor() {
        this.characterListContainer = document.getElementById('character-list');
        this.selectedCore = null;
        this.initialized = false;
    }

    /**
     * 캐릭터 데이터를 기반으로 로비 UI 생성
     * @param {Array} characters - characters.json에서 로드된 데이터
     */
    init(characters) {
        if (!this.characterListContainer) return;
        
        this.characterListContainer.innerHTML = '';
        characters.forEach((char, index) => {
            this.createCharacterCard(char, index === 0);
        });

        this.initialized = true;
        console.log("LOBBY_SYSTEM: Character sync complete.");
    }

    /**
     * 개별 캐릭터 카드 생성 및 이벤트 바인딩
     */
    createCharacterCard(char, isDefault) {
        const card = document.createElement('div');
        card.className = `data-card ${isDefault ? 'selected' : ''}`;
        if (isDefault) this.selectedCore = char;

        card.innerHTML = `
            <div class="text-[8px] opacity-40 mb-1">NODE_ID: ${char.id}</div>
            <div class="text-lg font-bold mb-3 tracking-widest">${char.name}</div>
            
            <div class="integrity-container mb-4">
                <div class="integrity-label">
                    <span>INTEGRITY</span>
                    <span>${char.stats.integrity}</span>
                </div>
                <div class="integrity-bar-bg">
                    <div class="integrity-bar-fill" style="width: ${(char.stats.integrity / 200) * 100}%"></div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[10px] opacity-80">
                <div class="border-l border-cyan-500 pl-1">
                    SPD: ${char.stats.speed}
                </div>
                <div class="border-l border-red-500 pl-1">
                    DMG: ${char.stats.damage}
                </div>
            </div>

            <div class="skill-indicator mt-4 py-1 border-t border-white/10 text-[9px] text-red-400">
                SKILL: ${char.skill.name}
            </div>
        `;

        card.onclick = () => this.handleSelection(char, card);
        this.characterListContainer.appendChild(card);
    }

    /**
     * 캐릭터 선택 핸들러
     */
    handleSelection(char, cardElement) {
        // 기존 선택 해제
        document.querySelectorAll('.data-card').forEach(c => c.classList.remove('selected'));
        
        // 새 선택 적용
        cardElement.classList.add('selected');
        this.selectedCore = char;

        // UI 피드백 (MenuController와 연동)
        if (window.Menu) {
            window.Menu.triggerUIFeedback('click');
            window.Menu.updateStatDisplay(char);
        }

        // 엔진에 선택된 데이터 전달
        if (window.Zarox) {
            window.Zarox.data.selectedCharacter = char;
        }

        this.playSelectionGlitch();
    }

    /**
     * 선택 시 발생하는 시각적 글리치 효과
     */
    playSelectionGlitch() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 pointer-events-none z-50 bg-cyan-500/10';
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.removeChild(overlay);
        }, 50);
    }
}

// 로비 컨트롤러 인스턴스 생성
window.Lobby = new LobbyController();
