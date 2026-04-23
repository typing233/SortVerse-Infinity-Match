class StorySystem {
    constructor() {
        this.currentStory = null;
        this.storiesCompleted = new Set();
        this.onStoryShow = null;
        this.onStoryHide = null;
    }
    
    getStoryForMemorySet(memorySetId) {
        const set = CONFIG.memorySets[memorySetId];
        if (set && set.story) {
            return set.story;
        }
        return null;
    }
    
    showStory(memorySetId) {
        const story = this.getStoryForMemorySet(memorySetId);
        if (!story) return false;
        
        this.currentStory = {
            memorySetId: memorySetId,
            story: story,
            timestamp: Date.now()
        };
        
        this.storiesCompleted.add(memorySetId);
        
        if (this.onStoryShow) {
            this.onStoryShow(story, memorySetId);
        }
        
        return true;
    }
    
    hideStory() {
        if (this.onStoryHide) {
            this.onStoryHide();
        }
        this.currentStory = null;
    }
    
    getCompletedStories() {
        return Array.from(this.storiesCompleted);
    }
    
    getCompletedCount() {
        return this.storiesCompleted.size;
    }
    
    isStoryCompleted(memorySetId) {
        return this.storiesCompleted.has(memorySetId);
    }
    
    reset() {
        this.currentStory = null;
        this.storiesCompleted.clear();
    }
    
    setStoryShowCallback(callback) {
        this.onStoryShow = callback;
    }
    
    setStoryHideCallback(callback) {
        this.onStoryHide = callback;
    }
    
    getAllAvailableStories() {
        const stories = [];
        for (const setId in CONFIG.memorySets) {
            const set = CONFIG.memorySets[setId];
            if (set.story) {
                stories.push({
                    memorySetId: setId,
                    name: set.name,
                    story: set.story,
                    completed: this.storiesCompleted.has(setId)
                });
            }
        }
        return stories;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorySystem;
}
