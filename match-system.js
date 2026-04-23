class MatchSystem {
    constructor(gameMode = 'memory') {
        this.mode = gameMode;
        this.modeConfig = CONFIG.modes[gameMode] || CONFIG.modes.memory;
    }
    
    setMode(mode) {
        this.mode = mode;
        this.modeConfig = CONFIG.modes[mode] || CONFIG.modes.memory;
    }
    
    getMatchCount() {
        return this.modeConfig.matchCount || 3;
    }
    
    checkMatch(items) {
        if (!items || items.length < this.getMatchCount()) {
            return {
                matched: false,
                reason: '需要选择' + this.getMatchCount() + '个物品'
            };
        }
        
        switch (this.modeConfig.matchType) {
            case 'visual':
                return this.checkVisualMatch(items);
            case 'logical':
                return this.checkLogicalMatch(items);
            case 'logic':
                return this.checkLogicGroupMatch(items);
            default:
                return this.checkLogicalMatch(items);
        }
    }
    
    checkVisualMatch(items) {
        const classicIds = items.map(item => item.data.classicId);
        const allSame = classicIds.every(id => id === classicIds[0]);
        
        if (allSame && classicIds[0]) {
            return {
                matched: true,
                type: 'visual',
                matchedItems: items,
                name: CONFIG.classicItems.find(i => i.id === classicIds[0])?.name || '匹配'
            };
        }
        
        return {
            matched: false,
            reason: '视觉不相同'
        };
    }
    
    checkLogicalMatch(items) {
        const memorySets = this.getMemorySetsFromItems(items);
        
        for (const setId in memorySets) {
            const set = CONFIG.memorySets[setId];
            if (!set) continue;
            
            const fragmentsInSet = memorySets[setId];
            const fragmentIds = set.fragments.map(f => f.id);
            const selectedFragmentIds = fragmentsInSet.map(f => f.data.fragmentId);
            
            const allInSet = selectedFragmentIds.every(id => fragmentIds.includes(id));
            const uniqueIds = [...new Set(selectedFragmentIds)];
            
            if (allInSet && uniqueIds.length >= this.getMatchCount()) {
                const actualMatched = items.filter(item => 
                    item.data.memorySetId === setId && 
                    uniqueIds.includes(item.data.fragmentId)
                );
                
                return {
                    matched: true,
                    type: 'logical',
                    matchedItems: actualMatched,
                    memorySet: set,
                    name: set.name
                };
            }
        }
        
        return {
            matched: false,
            reason: '不是同一个记忆的碎片'
        };
    }
    
    checkLogicGroupMatch(items) {
        const logicGroups = this.getLogicGroupsFromItems(items);
        
        for (const groupId in logicGroups) {
            const group = CONFIG.logicGroups.find(g => g.id === groupId);
            if (!group) continue;
            
            const itemsInGroup = logicGroups[groupId];
            const groupItemIds = group.items.map(i => i.id);
            const selectedItemIds = itemsInGroup.map(i => i.data.logicItemId);
            
            const allInGroup = selectedItemIds.every(id => groupItemIds.includes(id));
            const uniqueIds = [...new Set(selectedItemIds)];
            
            if (allInGroup && uniqueIds.length >= this.getMatchCount()) {
                const actualMatched = items.filter(item => 
                    item.data.logicGroupId === groupId && 
                    uniqueIds.includes(item.data.logicItemId)
                );
                
                return {
                    matched: true,
                    type: 'logic',
                    matchedItems: actualMatched,
                    logicGroup: group,
                    name: group.name
                };
            }
        }
        
        return {
            matched: false,
            reason: '不是同一个逻辑组的物品'
        };
    }
    
    getMemorySetsFromItems(items) {
        const sets = {};
        items.forEach(item => {
            if (item.data.memorySetId) {
                if (!sets[item.data.memorySetId]) {
                    sets[item.data.memorySetId] = [];
                }
                sets[item.data.memorySetId].push(item);
            }
        });
        return sets;
    }
    
    getLogicGroupsFromItems(items) {
        const groups = {};
        items.forEach(item => {
            if (item.data.logicGroupId) {
                if (!groups[item.data.logicGroupId]) {
                    groups[item.data.logicGroupId] = [];
                }
                groups[item.data.logicGroupId].push(item);
            }
        });
        return groups;
    }
    
    findHint(bodies, levelConfig) {
        if (this.mode === 'memory') {
            return this.findMemoryHint(bodies, levelConfig);
        } else if (this.mode === 'logic') {
            return this.findLogicHint(bodies);
        } else {
            return this.findClassicHint(bodies);
        }
    }
    
    findLogicHint(bodies) {
        const groupMap = {};
        
        bodies.forEach(body => {
            const data = body.data;
            if (data.logicGroupId) {
                if (!groupMap[data.logicGroupId]) {
                    groupMap[data.logicGroupId] = [];
                }
                groupMap[data.logicGroupId].push(body);
            }
        });
        
        for (const groupId in groupMap) {
            const bodiesInGroup = groupMap[groupId];
            const group = CONFIG.logicGroups.find(g => g.id === groupId);
            if (!group) continue;
            
            const itemIdsInScene = bodiesInGroup.map(b => b.data.logicItemId);
            const uniqueItems = [...new Set(itemIdsInScene)];
            
            if (uniqueItems.length >= this.getMatchCount()) {
                const hintBodies = [];
                const usedItems = [];
                
                for (const body of bodiesInGroup) {
                    if (!usedItems.includes(body.data.logicItemId)) {
                        hintBodies.push(body);
                        usedItems.push(body.data.logicItemId);
                        if (hintBodies.length >= this.getMatchCount()) break;
                    }
                }
                
                return {
                    type: 'logic',
                    logicGroup: group,
                    name: group.name,
                    items: hintBodies
                };
            }
        }
        
        return null;
    }
    
    findMemoryHint(bodies, levelConfig) {
        if (!levelConfig || !levelConfig.memorySets) return null;
        
        const bodyMap = {};
        bodies.forEach(body => {
            const data = body.data;
            if (data.memorySetId) {
                if (!bodyMap[data.memorySetId]) {
                    bodyMap[data.memorySetId] = [];
                }
                bodyMap[data.memorySetId].push(body);
            }
        });
        
        for (const setId of levelConfig.memorySets) {
            const bodiesInSet = bodyMap[setId] || [];
            const set = CONFIG.memorySets[setId];
            if (!set) continue;
            
            const fragmentIdsInScene = bodiesInSet.map(b => b.data.fragmentId);
            const uniqueFragments = [...new Set(fragmentIdsInScene)];
            
            if (uniqueFragments.length >= this.getMatchCount()) {
                const hintBodies = [];
                const usedFragments = [];
                
                for (const body of bodiesInSet) {
                    if (!usedFragments.includes(body.data.fragmentId)) {
                        hintBodies.push(body);
                        usedFragments.push(body.data.fragmentId);
                        if (hintBodies.length >= this.getMatchCount()) break;
                    }
                }
                
                return {
                    type: 'memory',
                    memorySet: set,
                    name: set.name,
                    items: hintBodies
                };
            }
        }
        
        return null;
    }
    
    findClassicHint(bodies) {
        const typeMap = {};
        
        bodies.forEach(body => {
            const data = body.data;
            if (data.classicId) {
                if (!typeMap[data.classicId]) {
                    typeMap[data.classicId] = [];
                }
                typeMap[data.classicId].push(body);
            }
        });
        
        for (const typeId in typeMap) {
            const bodiesOfType = typeMap[typeId];
            if (bodiesOfType.length >= this.getMatchCount()) {
                const classicItem = CONFIG.classicItems.find(i => i.id === typeId);
                return {
                    type: 'classic',
                    name: classicItem?.name || '相同物品',
                    items: bodiesOfType.slice(0, this.getMatchCount())
                };
            }
        }
        
        return null;
    }
    
    checkCollisionMatch(bodyA, bodyB) {
        const dataA = bodyA.data;
        const dataB = bodyB.data;
        
        if (this.modeConfig.matchType === 'visual') {
            return dataA.classicId && dataB.classicId && dataA.classicId === dataB.classicId;
        }
        
        if (this.modeConfig.matchType === 'logical') {
            return dataA.memorySetId && dataB.memorySetId && 
                   dataA.memorySetId === dataB.memorySetId &&
                   dataA.fragmentId !== dataB.fragmentId;
        }
        
        if (this.modeConfig.matchType === 'logic') {
            return dataA.logicGroupId && dataB.logicGroupId && 
                   dataA.logicGroupId === dataB.logicGroupId &&
                   dataA.logicItemId !== dataB.logicItemId;
        }
        
        return false;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatchSystem;
}
