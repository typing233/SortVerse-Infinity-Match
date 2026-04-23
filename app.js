document.addEventListener('DOMContentLoaded', () => {
    console.log('SortVerse Infinity Match - 时空邮局 已加载');
    
    try {
        const ui = new UIManager();
        const game = new GameManager();
        
        game.setUI(ui);
        ui.init();
        
        console.log('游戏系统初始化完成');
    } catch (error) {
        console.error('游戏初始化失败:', error);
        
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 30px;
            background: #fff;
            border: 3px solid #a62929;
            border-radius: 12px;
            text-align: center;
            z-index: 1000;
            max-width: 400px;
        `;
        errorDiv.innerHTML = `
            <h3 style="color: #a62929; margin-bottom: 15px;">游戏加载失败</h3>
            <p style="color: #5c4033; margin-bottom: 10px;">${error.message}</p>
            <p style="color: #888; font-size: 12px;">请确保网络连接正常，刷新页面重试</p>
        `;
        document.body.appendChild(errorDiv);
    }
});

window.addEventListener('load', () => {
    console.log('所有资源加载完成');
});
