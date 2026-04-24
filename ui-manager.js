class UIManager {
    constructor() {
        this.elements = {
            menuScreen: document.getElementById('menu-screen'),
            gameScreen: document.getElementById('game-screen'),
            levelCompleteScreen: document.getElementById('level-complete'),
            letterSystemScreen: document.getElementById('letter-system'),
            memoryGraphScreen: document.getElementById('memory-graph'),
            
            levelDisplay: document.getElementById('level'),
            scoreDisplay: document.getElementById('score'),
            targetDisplay: document.getElementById('target'),
            energyBar: document.getElementById('energy-bar'),
            energyDisplay: document.getElementById('energy-display'),
            fragmentsDisplay: document.getElementById('fragments-display'),
            
            selectedList: document.getElementById('selected-list'),
            confirmMatchBtn: document.getElementById('confirm-match'),
            clearSelectionBtn: document.getElementById('clear-selection'),
            
            startBtn: document.getElementById('start-btn'),
            hintBtn: document.getElementById('hint-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            menuBtn: document.getElementById('menu-btn'),
            nextLevelBtn: document.getElementById('next-level-btn'),
            backToMenuBtn: document.getElementById('back-to-menu-btn'),
            rewindBtn: document.getElementById('rewind-btn'),
            rewindSteps: document.getElementById('rewind-steps'),
            letterBtn: document.getElementById('letter-btn'),
            graphBtn: document.getElementById('graph-btn'),
            
            storyOverlay: document.getElementById('story-overlay'),
            storyTitle: document.getElementById('story-title'),
            storyText: document.getElementById('story-text'),
            storyClose: document.getElementById('story-close'),
            
            completeMemories: document.getElementById('complete-memories'),
            completeScore: document.getElementById('complete-score'),
            completeTime: document.getElementById('complete-time'),
            completeFragments: document.getElementById('complete-fragments'),
            
            modeButtons: document.querySelectorAll('.mode-btn')
        };
        
        this.currentMode = 'memory';
        this.callbacks = {};
        this.letters = this.loadLetters();
        this.highlights = this.loadHighlights();
    }
    
    init() {
        this.bindEvents();
        this.showScreen('menu');
    }
    
    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => {
            if (this.callbacks.onStartGame) {
                this.callbacks.onStartGame(this.currentMode);
            }
        });
        
        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setMode(btn.dataset.mode);
            });
        });
        
        this.elements.confirmMatchBtn.addEventListener('click', () => {
            if (this.callbacks.onConfirmMatch) {
                this.callbacks.onConfirmMatch();
            }
        });
        
        this.elements.clearSelectionBtn.addEventListener('click', () => {
            if (this.callbacks.onClearSelection) {
                this.callbacks.onClearSelection();
            }
        });
        
        this.elements.hintBtn.addEventListener('click', () => {
            if (this.callbacks.onHint) {
                this.callbacks.onHint();
            }
        });
        
        this.elements.pauseBtn.addEventListener('click', () => {
            if (this.callbacks.onPause) {
                this.callbacks.onPause();
            }
        });
        
        this.elements.menuBtn.addEventListener('click', () => {
            if (this.callbacks.onBackToMenu) {
                this.callbacks.onBackToMenu();
            }
        });
        
        this.elements.nextLevelBtn.addEventListener('click', () => {
            if (this.callbacks.onNextLevel) {
                this.callbacks.onNextLevel();
            }
        });
        
        this.elements.backToMenuBtn.addEventListener('click', () => {
            if (this.callbacks.onBackToMenu) {
                this.callbacks.onBackToMenu();
            }
        });
        
        this.elements.storyClose.addEventListener('click', () => {
            this.hideStory();
            if (this.callbacks.onStoryClose) {
                this.callbacks.onStoryClose();
            }
        });
        
        if (this.elements.rewindBtn) {
            this.elements.rewindBtn.addEventListener('click', () => {
                const steps = this.elements.rewindSteps ? parseInt(this.elements.rewindSteps.value) || 1 : 1;
                if (this.callbacks.onTimeRewind) {
                    this.callbacks.onTimeRewind(steps);
                }
            });
        }
        
        if (this.elements.letterBtn) {
            this.elements.letterBtn.addEventListener('click', () => {
                if (this.callbacks.onOpenLetterSystem) {
                    this.callbacks.onOpenLetterSystem();
                }
            });
        }
        
        if (this.elements.graphBtn) {
            this.elements.graphBtn.addEventListener('click', () => {
                if (this.callbacks.onOpenMemoryGraph) {
                    this.callbacks.onOpenMemoryGraph();
                }
            });
        }
    }
    
    setMode(mode) {
        this.currentMode = mode;
        
        this.elements.modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
    }
    
    showScreen(screenName) {
        this.elements.menuScreen.classList.remove('active', 'hidden');
        this.elements.gameScreen.classList.remove('active', 'hidden');
        this.elements.levelCompleteScreen.classList.remove('active', 'hidden');
        if (this.elements.letterSystemScreen) {
            this.elements.letterSystemScreen.classList.remove('active', 'hidden');
        }
        if (this.elements.memoryGraphScreen) {
            this.elements.memoryGraphScreen.classList.remove('active', 'hidden');
        }
        
        const gameHeader = document.getElementById('game-header');
        
        switch (screenName) {
            case 'menu':
                this.elements.menuScreen.classList.add('active');
                if (gameHeader) gameHeader.style.display = '';
                break;
            case 'game':
                this.elements.gameScreen.classList.add('active');
                if (gameHeader) gameHeader.style.display = '';
                break;
            case 'complete':
                this.elements.levelCompleteScreen.classList.add('active');
                if (gameHeader) gameHeader.style.display = '';
                break;
            case 'letter':
                if (this.elements.letterSystemScreen) {
                    this.elements.letterSystemScreen.classList.add('active');
                }
                if (gameHeader) gameHeader.style.display = 'none';
                break;
            case 'graph':
                if (this.elements.memoryGraphScreen) {
                    this.elements.memoryGraphScreen.classList.add('active');
                }
                if (gameHeader) gameHeader.style.display = 'none';
                break;
        }
    }
    
    updateEnergy(current, max) {
        if (this.elements.energyBar) {
            const percentage = (current / max) * 100;
            this.elements.energyBar.style.width = `${percentage}%`;
        }
        if (this.elements.energyDisplay) {
            this.elements.energyDisplay.textContent = `${current}/${max}`;
        }
    }
    
    toggleTimeRewindUI(show) {
        if (this.elements.energyContainer) {
            if (show) {
                this.elements.energyContainer.classList.remove('hidden');
            } else {
                this.elements.energyContainer.classList.add('hidden');
            }
        }
        
        const rewindControls = document.getElementById('rewind-controls');
        if (rewindControls) {
            if (show) {
                rewindControls.classList.remove('hidden');
            } else {
                rewindControls.classList.add('hidden');
            }
        }
    }
    
    updateStats(level, score, completed, target) {
        if (this.elements.levelDisplay) {
            this.elements.levelDisplay.textContent = level;
        }
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.textContent = score;
        }
        if (this.elements.targetDisplay) {
            this.elements.targetDisplay.textContent = `${completed}/${target}`;
        }
    }
    
    updateSelectedItems(items) {
        if (!this.elements.selectedList) return;
        
        this.elements.selectedList.innerHTML = '';
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'selected-item';
            div.textContent = item.data.icon || '?';
            div.title = item.data.name || '';
            this.elements.selectedList.appendChild(div);
        });
        
        if (this.elements.confirmMatchBtn) {
            this.elements.confirmMatchBtn.disabled = items.length < 3;
        }
    }
    
    showStory(story, memorySetId) {
        if (this.elements.storyOverlay && this.elements.storyTitle && this.elements.storyText) {
            this.elements.storyTitle.textContent = story.title;
            this.elements.storyText.textContent = story.text;
            this.elements.storyOverlay.classList.remove('hidden');
        }
    }
    
    hideStory() {
        if (this.elements.storyOverlay) {
            this.elements.storyOverlay.classList.add('hidden');
        }
    }
    
    showLevelComplete(memories, score, time, fragments = 0) {
        if (this.elements.completeMemories) {
            this.elements.completeMemories.textContent = memories;
        }
        if (this.elements.completeScore) {
            this.elements.completeScore.textContent = score;
        }
        if (this.elements.completeTime) {
            this.elements.completeTime.textContent = Utils.formatTime(time);
        }
        if (this.elements.completeFragments) {
            this.elements.completeFragments.textContent = fragments;
        }
        
        this.showScreen('complete');
    }
    
    loadLetters() {
        try {
            const saved = localStorage.getItem('sortverse_letters');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }
    
    saveLetters() {
        try {
            localStorage.setItem('sortverse_letters', JSON.stringify(this.letters));
        } catch (e) {
            console.error('Failed to save letters:', e);
        }
    }
    
    loadHighlights() {
        try {
            const saved = localStorage.getItem('sortverse_highlights');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }
    
    saveHighlights() {
        try {
            localStorage.setItem('sortverse_highlights', JSON.stringify(this.highlights));
        } catch (e) {
            console.error('Failed to save highlights:', e);
        }
    }
    
    addLetter(memorySetId, content) {
        if (!this.letters[memorySetId]) {
            this.letters[memorySetId] = [];
        }
        
        const letter = {
            id: Utils.randomId(),
            content: content,
            timestamp: Date.now(),
            resonance: 0,
            isHighlighted: false
        };
        
        this.letters[memorySetId].push(letter);
        this.saveLetters();
        
        return letter;
    }
    
    addResonance(letterId) {
        for (const memorySetId in this.letters) {
            const letter = this.letters[memorySetId].find(l => l.id === letterId);
            if (letter) {
                letter.resonance++;
                if (letter.resonance >= CONFIG.letterSystem.resonanceRequiredForHighlight) {
                    letter.isHighlighted = true;
                }
                this.saveLetters();
                return letter;
            }
        }
        return null;
    }
    
    highlightExcerpt(letterId, excerpt) {
        if (!this.highlights[letterId]) {
            this.highlights[letterId] = [];
        }
        this.highlights[letterId].push({
            excerpt: excerpt,
            timestamp: Date.now()
        });
        this.saveHighlights();
    }
    
    getLettersForStory(memorySetId) {
        return this.letters[memorySetId] || [];
    }
    
    showLetterSystem(memorySetId = null) {
        const gameHeader = document.getElementById('game-header');
        if (gameHeader) {
            gameHeader.style.display = 'none';
        }
        
        this.showScreen('letter');
        
        if (this.elements.letterSystemScreen) {
            this.renderLetterSystem(memorySetId);
        }
    }
    
    renderLetterSystem(memorySetId) {
        const container = this.elements.letterSystemScreen;
        if (!container) return;
        
        const lettersList = container.querySelector('.letters-list');
        const writeForm = container.querySelector('.write-letter-form');
        const storySelect = container.querySelector('.story-select');
        const closeBtn = container.querySelector('.close-letter-btn');
        
        if (closeBtn) {
            closeBtn.onclick = () => {
                const gameHeader = document.getElementById('game-header');
                if (gameHeader) {
                    gameHeader.style.display = '';
                }
                this.showScreen('menu');
            };
        }
        
        if (storySelect) {
            storySelect.innerHTML = '';
            for (const setId in CONFIG.memorySets) {
                const set = CONFIG.memorySets[setId];
                const option = document.createElement('option');
                option.value = setId;
                option.textContent = set.name;
                if (setId === memorySetId) {
                    option.selected = true;
                }
                storySelect.appendChild(option);
            }
            
            storySelect.onchange = () => {
                this.renderLetterList(storySelect.value, lettersList);
            };
        }
        
        if (lettersList) {
            this.renderLetterList(memorySetId || storySelect?.value || 'grandfather_watch', lettersList);
        }
        
        if (writeForm) {
            const textarea = writeForm.querySelector('textarea');
            const submitBtn = writeForm.querySelector('.submit-letter-btn');
            
            if (submitBtn && textarea) {
                submitBtn.onclick = () => {
                    const content = textarea.value.trim();
                    const selectedStory = storySelect?.value || 'grandfather_watch';
                    
                    if (content.length < 10) {
                        this.showMessage('信件内容至少需要10个字符', 'error');
                        return;
                    }
                    
                    this.addLetter(selectedStory, content);
                    textarea.value = '';
                    this.renderLetterList(selectedStory, lettersList);
                    this.showMessage('信件已寄出！', 'success');
                };
            }
        }
    }
    
    renderLetterList(memorySetId, container) {
        if (!container) return;
        
        const letters = this.getLettersForStory(memorySetId);
        
        if (letters.length === 0) {
            container.innerHTML = '<p class="no-letters">暂无信件，成为第一个写信的人吧！</p>';
            return;
        }
        
        container.innerHTML = letters.map(letter => `
            <div class="letter-card ${letter.isHighlighted ? 'highlighted' : ''}" data-letter-id="${letter.id}">
                <div class="letter-content">${this.escapeHtml(letter.content)}</div>
                <div class="letter-meta">
                    <span class="letter-time">${new Date(letter.timestamp).toLocaleDateString('zh-CN')}</span>
                    <span class="letter-resonance" data-letter-id="${letter.id}">
                        ❤️ ${letter.resonance} 共鸣
                    </span>
                </div>
                <div class="letter-actions">
                    <button class="resonance-btn" data-letter-id="${letter.id}">点亮共鸣</button>
                    <button class="excerpt-btn" data-letter-id="${letter.id}">摘录片段</button>
                </div>
            </div>
        `).join('');
        
        container.querySelectorAll('.resonance-btn').forEach(btn => {
            btn.onclick = () => {
                const letterId = btn.dataset.letterId;
                const letter = this.addResonance(letterId);
                if (letter) {
                    const resonanceSpan = container.querySelector(`.letter-resonance[data-letter-id="${letterId}"]`);
                    if (resonanceSpan) {
                        resonanceSpan.textContent = `❤️ ${letter.resonance} 共鸣`;
                    }
                    if (letter.isHighlighted) {
                        const card = container.querySelector(`.letter-card[data-letter-id="${letterId}"]`);
                        if (card) card.classList.add('highlighted');
                    }
                    this.showMessage('共鸣已点亮！', 'success');
                }
            };
        });
        
        container.querySelectorAll('.excerpt-btn').forEach(btn => {
            btn.onclick = () => {
                const letterId = btn.dataset.letterId;
                const card = container.querySelector(`.letter-card[data-letter-id="${letterId}"]`);
                if (card) {
                    const content = card.querySelector('.letter-content').textContent;
                    const excerpt = prompt('请选择要摘录的片段（或直接复制）：', content.substring(0, 50));
                    if (excerpt && excerpt.trim()) {
                        this.highlightExcerpt(letterId, excerpt.trim());
                        this.showMessage('片段已摘录到拼图本！', 'success');
                    }
                }
            };
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showMemoryGraph(completedStories = []) {
        const gameHeader = document.getElementById('game-header');
        if (gameHeader) {
            gameHeader.style.display = 'none';
        }
        
        this.showScreen('graph');
        setTimeout(() => {
            this.renderMemoryGraph(completedStories);
        }, 100);
    }
    
    renderMemoryGraph(completedStories) {
        const container = this.elements.memoryGraphScreen;
        if (!container) return;
        
        const closeBtn = container.querySelector('.close-graph-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                const gameHeader = document.getElementById('game-header');
                if (gameHeader) {
                    gameHeader.style.display = '';
                }
                this.showScreen('menu');
            };
        }
        
        const graphCanvas = container.querySelector('#graph-canvas');
        if (!graphCanvas) return;
        
        const ctx = graphCanvas.getContext('2d');
        graphCanvas.width = graphCanvas.offsetWidth || 800;
        graphCanvas.height = 600;
        
        ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        
        const nodes = [];
        const eras = {};
        
        for (const setId in CONFIG.memorySets) {
            const set = CONFIG.memorySets[setId];
            const era = set.era || 'unknown';
            
            if (!eras[era]) {
                eras[era] = [];
            }
            
            eras[era].push({
                id: setId,
                name: set.name,
                era: era,
                category: set.category,
                completed: completedStories.includes(setId),
                story: set.story
            });
        }
        
        const eraOrder = ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];
        const filteredEras = eraOrder.filter(era => eras[era]);
        
        const nodeSize = CONFIG.memoryGraph.nodeSize;
        const padding = 80;
        const eraSpacing = (graphCanvas.width - padding * 2) / (filteredEras.length || 1);
        
        filteredEras.forEach((era, eraIndex) => {
            const eraStories = eras[era];
            const x = padding + eraIndex * eraSpacing + eraSpacing / 2;
            
            ctx.fillStyle = CONFIG.memoryGraph.eraColors[era] || '#888';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(era, x, 40);
            
            ctx.strokeStyle = 'rgba(184, 134, 11, 0.3)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x, 55);
            ctx.lineTo(x, graphCanvas.height - 20);
            ctx.stroke();
            ctx.setLineDash([]);
            
            const storySpacing = (graphCanvas.height - 100) / (Math.max(eraStories.length, 1));
            
            eraStories.forEach((story, storyIndex) => {
                const y = 80 + storyIndex * storySpacing;
                
                nodes.push({
                    ...story,
                    x: x,
                    y: y
                });
                
                ctx.beginPath();
                ctx.arc(x, y, nodeSize / 2, 0, Math.PI * 2);
                
                if (story.completed) {
                    ctx.fillStyle = CONFIG.memoryGraph.eraColors[era] || '#b8860b';
                    ctx.fill();
                    ctx.strokeStyle = '#ffd700';
                    ctx.lineWidth = 3;
                } else {
                    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
                    ctx.fill();
                    ctx.strokeStyle = '#666';
                    ctx.lineWidth = 2;
                }
                ctx.stroke();
                
                ctx.fillStyle = story.completed ? '#fff' : '#888';
                ctx.font = `${nodeSize / 3}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(story.completed ? '✓' : '?', x, y);
                
                ctx.fillStyle = '#5c4033';
                ctx.font = '12px Arial';
                ctx.fillText(story.name.substring(0, 6), x, y + nodeSize / 2 + 15);
            });
        });
        
        this.drawConnections(ctx, nodes);
        
        this.addGraphInteraction(graphCanvas, nodes);
    }
    
    drawConnections(ctx, nodes) {
        const categoryGroups = {};
        nodes.forEach(node => {
            if (!categoryGroups[node.category]) {
                categoryGroups[node.category] = [];
            }
            categoryGroups[node.category].push(node);
        });
        
        ctx.strokeStyle = 'rgba(184, 134, 11, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        
        for (const category in categoryGroups) {
            const groupNodes = categoryGroups[category].sort((a, b) => a.era.localeCompare(b.era));
            
            for (let i = 0; i < groupNodes.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(groupNodes[i].x, groupNodes[i].y);
                ctx.lineTo(groupNodes[i + 1].x, groupNodes[i + 1].y);
                ctx.stroke();
            }
        }
        
        ctx.setLineDash([]);
    }
    
    addGraphInteraction(canvas, nodes) {
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            for (const node of nodes) {
                const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
                if (dist <= CONFIG.memoryGraph.nodeSize / 2) {
                    this.showNodeDetails(node);
                    break;
                }
            }
        };
    }
    
    showNodeDetails(node) {
        let popup = document.getElementById('graph-node-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'graph-node-popup';
            popup.className = 'graph-popup';
            document.body.appendChild(popup);
        }
        
        popup.innerHTML = `
            <div class="popup-content">
                <h3>${node.name}</h3>
                <p class="popup-era">时代：${node.era}</p>
                <p class="popup-category">分类：${this.getCategoryName(node.category)}</p>
                <p class="popup-status">状态：${node.completed ? '✓ 已解锁' : '🔒 未解锁'}</p>
                ${node.completed && node.story ? `<p class="popup-story-preview">${node.story.text.substring(0, 100)}...</p>` : ''}
                <button class="close-popup-btn">关闭</button>
            </div>
        `;
        
        popup.style.display = 'block';
        popup.querySelector('.close-popup-btn').onclick = () => {
            popup.style.display = 'none';
        };
    }
    
    getCategoryName(category) {
        const names = {
            'war': '战争记忆',
            'romance': '浪漫爱情',
            'childhood': '童年回忆',
            'memory': '珍贵记忆',
            'travel': '旅行印记'
        };
        return names[category] || category;
    }
    
    on(event, callback) {
        this.callbacks[event] = callback;
    }
    
    trigger(event, ...args) {
        if (this.callbacks[event]) {
            this.callbacks[event](...args);
        }
    }
    
    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: ${type === 'success' ? 'var(--success-green)' : type === 'error' ? 'var(--stamp-red)' : 'var(--accent-gold)'};
            color: white;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    showMatchEffect(x, y, color) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, ${color} 0%, transparent 70%);
            pointer-events: none;
            z-index: 100;
            animation: matchBurst 0.5s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => effect.remove(), 500);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}

const style = document.createElement('style');
style.textContent = `
@keyframes slideDown {
    from {
        transform: translateX(-50%) translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}

@keyframes matchBurst {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);
