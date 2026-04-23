class UIManager {
    constructor() {
        this.elements = {
            menuScreen: document.getElementById('menu-screen'),
            gameScreen: document.getElementById('game-screen'),
            levelCompleteScreen: document.getElementById('level-complete'),
            
            levelDisplay: document.getElementById('level'),
            scoreDisplay: document.getElementById('score'),
            targetDisplay: document.getElementById('target'),
            
            selectedList: document.getElementById('selected-list'),
            confirmMatchBtn: document.getElementById('confirm-match'),
            clearSelectionBtn: document.getElementById('clear-selection'),
            
            startBtn: document.getElementById('start-btn'),
            hintBtn: document.getElementById('hint-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            menuBtn: document.getElementById('menu-btn'),
            nextLevelBtn: document.getElementById('next-level-btn'),
            backToMenuBtn: document.getElementById('back-to-menu-btn'),
            
            storyOverlay: document.getElementById('story-overlay'),
            storyTitle: document.getElementById('story-title'),
            storyText: document.getElementById('story-text'),
            storyClose: document.getElementById('story-close'),
            
            completeMemories: document.getElementById('complete-memories'),
            completeScore: document.getElementById('complete-score'),
            completeTime: document.getElementById('complete-time'),
            
            modeButtons: document.querySelectorAll('.mode-btn')
        };
        
        this.currentMode = 'memory';
        this.callbacks = {};
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
        this.elements.menuScreen.classList.remove('active');
        this.elements.gameScreen.classList.remove('active');
        this.elements.levelCompleteScreen.classList.remove('active');
        
        switch (screenName) {
            case 'menu':
                this.elements.menuScreen.classList.add('active');
                break;
            case 'game':
                this.elements.gameScreen.classList.add('active');
                break;
            case 'complete':
                this.elements.levelCompleteScreen.classList.add('active');
                break;
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
    
    showLevelComplete(memories, score, time) {
        if (this.elements.completeMemories) {
            this.elements.completeMemories.textContent = memories;
        }
        if (this.elements.completeScore) {
            this.elements.completeScore.textContent = score;
        }
        if (this.elements.completeTime) {
            this.elements.completeTime.textContent = Utils.formatTime(time);
        }
        
        this.showScreen('complete');
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
