class GameManager {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.physics = null;
        this.matchSystem = null;
        this.itemGenerator = null;
        this.storySystem = null;
        this.ui = null;
        
        this.currentMode = 'memory';
        this.currentLevel = 1;
        this.score = 0;
        this.completedMemories = 0;
        this.startTime = 0;
        this.isPaused = false;
        this.isRunning = false;
        
        this.spawnTimer = null;
        this.gameLoopId = null;
        
        this.hintsRemaining = CONFIG.game.hintsAvailable;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.matchSystem = new MatchSystem(this.currentMode);
        this.itemGenerator = new ItemGenerator(this.currentMode);
        this.storySystem = new StorySystem();
        
        this.setupCanvasEvents();
    }
    
    resizeCanvas() {
        const container = document.querySelector('.physics-area');
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight - 160;
        }
    }
    
    setupCanvasEvents() {
        const handleClick = (e) => {
            if (!this.isRunning || this.isPaused) return;
            
            const pos = this.getEventPos(e);
            const body = this.getBodyAtPosition(pos.x, pos.y);
            
            if (body) {
                this.toggleSelect(body.id);
            } else {
                if (this.physics) {
                    this.physics.addGravityPoint(pos.x, pos.y);
                }
            }
        };
        
        this.canvas.addEventListener('click', handleClick);
        
        this.canvas.addEventListener('dblclick', (e) => {
            if (!this.isRunning || this.isPaused) return;
            
            const pos = this.getEventPos(e);
            const body = this.getBodyAtPosition(pos.x, pos.y);
            
            if (body && this.physics) {
                this.physics.rotateBody(body.id);
            }
        });
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (!this.isRunning || this.isPaused) return;
            
            const pos = this.getEventPos(e);
            if (this.physics) {
                this.physics.addGravityPoint(pos.x, pos.y, 0.02, 200);
            }
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    getEventPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    getMousePos(e) {
        return this.getEventPos(e);
    }
    
    getBodyAtPosition(x, y) {
        if (!this.physics) return null;
        
        const bodies = this.physics.getAllBodies();
        for (const info of bodies) {
            const body = info.body;
            const size = CONFIG.game.itemSize / 2;
            
            if (x >= body.position.x - size && 
                x <= body.position.x + size &&
                y >= body.position.y - size && 
                y <= body.position.y + size) {
                return info;
            }
        }
        
        return null;
    }
    
    toggleSelect(bodyId) {
        if (!this.physics) return;
        
        const selected = this.physics.getSelectedBodies();
        const currentInfo = selected.find(s => s.id === bodyId);
        
        if (currentInfo) {
            this.physics.deselectBody(bodyId);
        } else {
            if (selected.length >= this.matchSystem.getMatchCount()) {
                this.ui.showMessage('最多只能选择' + this.matchSystem.getMatchCount() + '个物品', 'error');
                return;
            }
            this.physics.selectBody(bodyId);
        }
        
        this.updateSelectedUI();
    }
    
    updateSelectedUI() {
        if (!this.physics || !this.ui) return;
        const selected = this.physics.getSelectedBodies();
        this.ui.updateSelectedItems(selected);
    }
    
    setUI(uiManager) {
        this.ui = uiManager;
        
        this.ui.on('onStartGame', (mode) => this.startGame(mode));
        this.ui.on('onConfirmMatch', () => this.confirmMatch());
        this.ui.on('onClearSelection', () => this.clearSelection());
        this.ui.on('onHint', () => this.showHint());
        this.ui.on('onPause', () => this.togglePause());
        this.ui.on('onBackToMenu', () => this.backToMenu());
        this.ui.on('onNextLevel', () => this.nextLevel());
        this.ui.on('onStoryClose', () => this.resumeAfterStory());
    }
    
    startGame(mode) {
        this.currentMode = mode;
        this.currentLevel = 1;
        this.score = 0;
        this.completedMemories = 0;
        this.startTime = Date.now();
        this.hintsRemaining = CONFIG.game.hintsAvailable;
        
        this.matchSystem.setMode(mode);
        this.itemGenerator.setMode(mode);
        this.storySystem.reset();
        
        const levelConfig = CONFIG.levels[this.currentLevel - 1];
        if (levelConfig) {
            this.itemGenerator.setLevel(levelConfig);
        }
        
        this.ui.showScreen('game');
        
        setTimeout(() => {
            this.resizeCanvas();
            
            if (this.physics) {
                this.physics.stop();
                this.physics.clear();
            }
            
            this.physics = new PhysicsEngine(this.canvas);
            this.physics.start();
            
            this.updateStatsUI();
            
            this.isRunning = true;
            this.isPaused = false;
            
            this.spawnInitialItems();
            this.startSpawning();
            this.startGameLoop();
        }, 100);
    }
    
    spawnInitialItems() {
        const count = 8;
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.spawnItem(), i * 300);
        }
    }
    
    spawnItem() {
        if (!this.isRunning || this.isPaused) return;
        if (!this.physics || !this.itemGenerator) return;
        
        if (this.physics.getBodyCount() >= CONFIG.game.maxItems) {
            return;
        }
        
        const itemData = this.itemGenerator.generateItem();
        if (!itemData) return;
        
        const x = Utils.randomInt(
            CONFIG.game.itemSize, 
            this.canvas.width - CONFIG.game.itemSize
        );
        
        this.physics.spawnItem(itemData, x);
    }
    
    startSpawning() {
        this.spawnTimer = setInterval(() => {
            if (!this.isPaused) {
                this.spawnItem();
            }
        }, CONFIG.game.spawnInterval);
    }
    
    stopSpawning() {
        if (this.spawnTimer) {
            clearInterval(this.spawnTimer);
            this.spawnTimer = null;
        }
    }
    
    startGameLoop() {
        const loop = () => {
            if (!this.isRunning) return;
            
            this.gameLoopId = requestAnimationFrame(loop);
            
            if (this.isPaused) return;
            
            this.physics.updateGravityPoints();
            this.render();
        };
        
        loop();
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = CONFIG.colors.parchment;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.renderGravityPoints();
        
        const bodies = this.physics.getAllBodies();
        bodies.forEach(info => {
            this.renderBody(info);
        });
    }
    
    renderGravityPoints() {
        if (!this.physics) return;
        
        this.physics.gravityPoints.forEach(point => {
            const alpha = point.lifetime / 300;
            
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(184, 134, 11, ${alpha * 0.1})`;
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(184, 134, 11, ${alpha})`;
            this.ctx.fill();
        });
    }
    
    renderBody(info) {
        const body = info.body;
        const data = info.data;
        const size = CONFIG.game.itemSize;
        
        this.ctx.save();
        this.ctx.translate(body.position.x, body.position.y);
        this.ctx.rotate(body.angle);
        
        const halfSize = size / 2;
        const padding = 4;
        
        this.ctx.fillStyle = data.color || '#d4a574';
        this.ctx.fillRect(-halfSize + padding, -halfSize + padding, size - padding * 2, size - padding * 2);
        
        this.ctx.strokeStyle = info.selected ? CONFIG.colors.gold : CONFIG.colors.ink;
        this.ctx.lineWidth = info.selected ? 4 : 2;
        this.ctx.strokeRect(-halfSize + padding, -halfSize + padding, size - padding * 2, size - padding * 2);
        
        this.ctx.fillStyle = CONFIG.colors.ink;
        this.ctx.font = `${size * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(data.icon || '?', 0, 2);
        
        if (info.selected) {
            this.ctx.shadowColor = CONFIG.colors.gold;
            this.ctx.shadowBlur = 15;
            this.ctx.strokeRect(-halfSize + padding, -halfSize + padding, size - padding * 2, size - padding * 2);
            this.ctx.shadowBlur = 0;
        }
        
        this.ctx.restore();
    }
    
    confirmMatch() {
        if (!this.physics || !this.matchSystem) return;
        
        const selected = this.physics.getSelectedBodies();
        const result = this.matchSystem.checkMatch(selected);
        
        if (result.matched) {
            this.processSuccessfulMatch(result);
        } else {
            this.ui.showMessage(result.reason || '匹配失败', 'error');
            this.shakeFailedItems(selected);
        }
    }
    
    processSuccessfulMatch(result) {
        this.isPaused = true;
        
        const items = result.matchedItems;
        
        const centerX = items.reduce((sum, item) => sum + item.body.position.x, 0) / items.length;
        const centerY = items.reduce((sum, item) => sum + item.body.position.y, 0) / items.length;
        
        this.ui.showMatchEffect(centerX, centerY + 160, result.matchedItems[0]?.data?.color || CONFIG.colors.gold);
        
        this.score += 100 * items.length;
        this.completedMemories++;
        
        items.forEach(item => {
            this.physics.removeBody(item.id);
        });
        
        this.physics.deselectAll();
        this.updateSelectedUI();
        this.updateStatsUI();
        
        this.ui.showMessage(`匹配成功！${result.name}`, 'success');
        
        if (result.type === 'logical' && result.memorySet) {
            setTimeout(() => {
                this.storySystem.showStory(result.memorySet.id);
                const story = this.storySystem.getStoryForMemorySet(result.memorySet.id);
                if (story) {
                    this.ui.showStory(story, result.memorySet.id);
                }
            }, 500);
        } else {
            setTimeout(() => {
                this.checkLevelComplete();
            }, 300);
        }
    }
    
    resumeAfterStory() {
        this.checkLevelComplete();
    }
    
    checkLevelComplete() {
        const levelConfig = CONFIG.levels[this.currentLevel - 1];
        
        if (levelConfig && this.completedMemories >= levelConfig.targetMemories) {
            this.levelComplete();
        } else {
            this.isPaused = false;
        }
    }
    
    shakeFailedItems(items) {
        items.forEach(item => {
            const originalX = item.body.position.x;
            let shakeCount = 0;
            const shakeInterval = setInterval(() => {
                const offset = (shakeCount % 2 === 0 ? 5 : -5);
                Matter.Body.setPosition(item.body, {
                    x: originalX + offset,
                    y: item.body.position.y
                });
                shakeCount++;
                if (shakeCount >= 4) {
                    clearInterval(shakeInterval);
                    Matter.Body.setPosition(item.body, {
                        x: originalX,
                        y: item.body.position.y
                    });
                }
            }, 50);
        });
    }
    
    clearSelection() {
        if (!this.physics) return;
        this.physics.deselectAll();
        this.updateSelectedUI();
    }
    
    showHint() {
        if (this.hintsRemaining <= 0) {
            this.ui.showMessage('提示次数已用完', 'error');
            return;
        }
        
        if (!this.physics || !this.matchSystem) return;
        
        const bodies = this.physics.getAllBodies();
        const levelConfig = CONFIG.levels[this.currentLevel - 1];
        
        const hint = this.matchSystem.findHint(bodies, levelConfig);
        
        if (hint && hint.items) {
            this.hintsRemaining--;
            
            hint.items.forEach(item => {
                this.physics.selectBody(item.id);
            });
            
            this.updateSelectedUI();
            this.ui.showMessage(`提示：${hint.name}`, 'info');
        } else {
            this.ui.showMessage('暂时没有可用的提示', 'error');
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.ui.showMessage('游戏已暂停', 'info');
        } else {
            this.ui.showMessage('游戏继续', 'info');
        }
    }
    
    backToMenu() {
        this.isRunning = false;
        this.isPaused = false;
        
        this.stopSpawning();
        
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
        
        if (this.physics) {
            this.physics.stop();
            this.physics.clear();
        }
        
        this.ui.showScreen('menu');
    }
    
    levelComplete() {
        this.isRunning = false;
        this.stopSpawning();
        
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
        
        const elapsedSeconds = (Date.now() - this.startTime) / 1000;
        
        this.ui.showLevelComplete(
            this.completedMemories,
            this.score,
            elapsedSeconds
        );
    }
    
    nextLevel() {
        this.currentLevel++;
        
        if (this.currentLevel > CONFIG.levels.length) {
            this.ui.showMessage('恭喜！您已完成所有关卡！', 'success');
            this.backToMenu();
            return;
        }
        
        this.score = 0;
        this.completedMemories = 0;
        this.startTime = Date.now();
        this.hintsRemaining = CONFIG.game.hintsAvailable;
        
        const levelConfig = CONFIG.levels[this.currentLevel - 1];
        if (levelConfig) {
            this.itemGenerator.setLevel(levelConfig);
        }
        
        if (this.physics) {
            this.physics.clear();
        }
        
        this.ui.showScreen('game');
        this.updateStatsUI();
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.spawnInitialItems();
        this.startSpawning();
        this.startGameLoop();
    }
    
    updateStatsUI() {
        if (!this.ui) return;
        
        const levelConfig = CONFIG.levels[this.currentLevel - 1];
        const target = levelConfig ? levelConfig.targetMemories : 5;
        
        this.ui.updateStats(
            this.currentLevel,
            this.score,
            this.completedMemories,
            target
        );
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameManager;
}
