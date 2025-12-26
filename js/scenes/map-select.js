/**
 * Z⧋R⟠X // SYSTEM_CONFLICT
 * Map Selection Controller
 */

class MapSelectController {
    constructor() {
        this.mapListContainer = document.getElementById('map-list'); // index.html에 해당 ID의 컨테이너가 필요합니다.
        this.selectedMap = null;
        this.initialized = false;
    }

    /**
     * 맵 데이터를 기반으로 선택 UI 생성
     * @param {Array} maps - maps.json에서 로드된 데이터
     */
    init(maps) {
        if (!this.mapListContainer) {
            // 만약 컨테이너가 없다면 기본적으로 screen-map 내부의 요소를 찾아봅니다.
            const mapScreen = document.getElementById('screen-map');
            this.mapListContainer = mapScreen ? mapScreen.querySelector('.flex.gap-6') : null;
        }

        if (!this.mapListContainer) return;
        
        this.mapListContainer.innerHTML = '';
        maps.forEach((map, index) => {
            this.createMapCard(map, index === 0);
        });

        this.initialized = true;
        console.log("MAP_SYSTEM: Sector synchronization complete.");
    }

    /**
     * 개별 맵 카드 생성 및 이벤트 바인딩
     */
    createMapCard(map, isDefault) {
        const card = document.createElement('div');
        card.className = `data-card h-48 flex flex-col justify-between p-4 transition-all ${isDefault ? 'selected' : ''}`;
        if (isDefault) this.selectedMap = map;

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="text-[8px] opacity-40">SECTOR_ID: ${map.id}</div>
                <div class="text-[8px] text-red-500">DIFF: ${'★'.repeat(map.difficulty)}</div>
            </div>
            
            <div class="my-2">
                <div class="text-lg font-bold tracking-tighter text-white">${map.name}</div>
                <div class="text-[9px] text-cyan-500 opacity-70">${map.theme}</div>
            </div>

            <div class="map-preview-mini h-12 w-full bg-white/5 border border-white/10 relative overflow-hidden">
                <!-- 미니맵 미리보기 느낌의 장식 요소 -->
                <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, var(--glitch-cyan) 1px, transparent 1px); background-size: 10px 10px;"></div>
                ${map.elements.obstacles.map(obs => `
                    <div class="absolute bg-cyan-500/30" style="left: ${(obs.x/1200)*100}%; top: ${(obs.y/800)*100}%; width: 5px; height: 5px;"></div>
                `).join('')}
            </div>

            <div class="text-[8px] mt-2 flex justify-between opacity-50">
                <span>GLITCH_INTENSITY:</span>
                <span>${(map.config.glitch_intensity * 100).toFixed(0)}%</span>
            </div>
        `;

        card.onclick = () => this.handleSelection(map, card);
        this.mapListContainer.appendChild(card);
    }

    /**
     * 맵 선택 핸들러
     */
    handleSelection(map, cardElement) {
        // 기존 선택 해제 (Lobby와 공유하는 클래스 사용)
        document.querySelectorAll('#screen-map .data-card').forEach(c => c.classList.remove('selected'));
        
        // 새 선택 적용
        cardElement.classList.add('selected');
        this.selectedMap = map;

        // UI 피드백 (MenuController 연동)
        if (window.Menu) {
            window.Menu.triggerUIFeedback('click');
        }

        // 엔진에 선택된 데이터 전달
        if (window.Zarox) {
            window.Zarox.data.selectedMap = map;
        }

        console.log(`SECTOR_LINKED: ${map.name}`);
    }
}

// 맵 선택 컨트롤러 인스턴스 생성
window.MapSelect = new MapSelectController();
