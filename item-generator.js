class ItemGenerator {
    constructor(gameMode = 'memory') {
        this.mode = gameMode;
        this.levelConfig = null;
        this.usedFragments = new Map();
    }
    
    setMode(mode) {
        this.mode = mode;
    }
    
    setLevel(levelConfig) {
        this.levelConfig = levelConfig;
        this.usedFragments.clear();
    }
    
    generateItem() {
        switch (this.mode) {
            case 'classic':
                return this.generateClassicItem();
            case 'logic':
                return this.generateLogicItem();
            case 'memory':
            default:
                return this.generateMemoryItem();
        }
    }
    
    generateMemoryItem() {
        if (!this.levelConfig || !this.levelConfig.memorySets) {
            return this.generateRandomMemoryItem();
        }
        
        const availableSets = this.levelConfig.memorySets.slice();
        
        let bestSet = null;
        let minUsed = Infinity;
        
        for (const setId of availableSets) {
            const usedCount = this.usedFragments.get(setId) || 0;
            if (usedCount < minUsed) {
                minUsed = usedCount;
                bestSet = setId;
            }
        }
        
        if (!bestSet) {
            bestSet = Utils.randomChoice(availableSets);
        }
        
        const set = CONFIG.memorySets[bestSet];
        if (!set) return this.generateRandomMemoryItem();
        
        const availableFragments = set.fragments.filter(f => {
            const key = `${bestSet}_${f.id}`;
            return !this.usedFragments.has(key) || this.usedFragments.get(key) < 2;
        });
        
        if (availableFragments.length === 0) {
            return this.generateRandomMemoryItem();
        }
        
        const fragment = Utils.randomChoice(availableFragments);
        
        this.usedFragments.set(bestSet, (this.usedFragments.get(bestSet) || 0) + 1);
        
        return {
            type: 'memory',
            memorySetId: set.id,
            memorySetName: set.name,
            fragmentId: fragment.id,
            name: fragment.name,
            icon: fragment.icon,
            color: fragment.color,
            description: fragment.description
        };
    }
    
    generateRandomMemoryItem() {
        const setIds = Object.keys(CONFIG.memorySets);
        const setId = Utils.randomChoice(setIds);
        const set = CONFIG.memorySets[setId];
        
        if (!set) return null;
        
        const fragment = Utils.randomChoice(set.fragments);
        
        return {
            type: 'memory',
            memorySetId: set.id,
            memorySetName: set.name,
            fragmentId: fragment.id,
            name: fragment.name,
            icon: fragment.icon,
            color: fragment.color,
            description: fragment.description
        };
    }
    
    generateClassicItem() {
        const item = Utils.randomChoice(CONFIG.classicItems);
        if (!item) return null;
        
        return {
            type: 'classic',
            classicId: item.id,
            name: item.name,
            icon: item.icon,
            color: item.color
        };
    }
    
    generateLogicItem() {
        const group = Utils.randomChoice(CONFIG.logicGroups);
        if (!group) return null;
        
        const item = Utils.randomChoice(group.items);
        
        return {
            type: 'logic',
            logicGroupId: group.id,
            logicGroupName: group.name,
            logicItemId: item.id,
            name: item.name,
            icon: item.icon,
            color: item.color
        };
    }
    
    generateBatch(count) {
        const items = [];
        for (let i = 0; i < count; i++) {
            const item = this.generateItem();
            if (item) {
                items.push(item);
            }
        }
        return items;
    }
    
    generateForMemorySet(memorySetId) {
        const set = CONFIG.memorySets[memorySetId];
        if (!set) return [];
        
        return set.fragments.map(fragment => ({
            type: 'memory',
            memorySetId: set.id,
            memorySetName: set.name,
            fragmentId: fragment.id,
            name: fragment.name,
            icon: fragment.icon,
            color: fragment.color,
            description: fragment.description
        }));
    }
    
    reset() {
        this.usedFragments.clear();
    }
    
    getMemorySetInfo(setId) {
        return CONFIG.memorySets[setId] || null;
    }
    
    getLogicGroupInfo(groupId) {
        return CONFIG.logicGroups.find(g => g.id === groupId) || null;
    }
    
    getClassicItemInfo(itemId) {
        return CONFIG.classicItems.find(i => i.id === itemId) || null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemGenerator;
}
