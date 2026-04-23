class PhysicsEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = Matter.Engine.create();
        this.render = null;
        this.runner = null;
        this.mouseConstraint = null;
        this.world = this.engine.world;
        
        this.bodies = new Map();
        this.gravityPoints = [];
        
        this.setupWorld();
    }
    
    setupWorld() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.world.gravity.y = CONFIG.physics.gravity;
        
        const ground = Matter.Bodies.rectangle(
            width / 2, 
            height + 25, 
            width, 
            50, 
            { 
                isStatic: true,
                render: { fillStyle: CONFIG.colors.inkDark }
            }
        );
        
        const leftWall = Matter.Bodies.rectangle(
            -25, 
            height / 2, 
            50, 
            height, 
            { 
                isStatic: true,
                render: { fillStyle: CONFIG.colors.inkDark }
            }
        );
        
        const rightWall = Matter.Bodies.rectangle(
            width + 25, 
            height / 2, 
            50, 
            height, 
            { 
                isStatic: true,
                render: { fillStyle: CONFIG.colors.inkDark }
            }
        );
        
        Matter.World.add(this.world, [ground, leftWall, rightWall]);
    }
    
    start() {
        if (this.runner) return;
        
        this.runner = Matter.Runner.create();
        Matter.Runner.run(this.runner, this.engine);
        
        this.setupMouse();
    }
    
    stop() {
        if (this.runner) {
            Matter.Runner.stop(this.runner);
            this.runner = null;
        }
    }
    
    setupMouse() {
        const mouse = Matter.Mouse.create(this.canvas);
        this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        
        Matter.World.add(this.world, this.mouseConstraint);
    }
    
    addBody(body, itemData) {
        const id = Utils.randomId();
        body.id = id;
        body.itemData = itemData;
        
        this.bodies.set(id, {
            body: body,
            data: itemData,
            selected: false
        });
        
        Matter.World.add(this.world, body);
        return id;
    }
    
    removeBody(bodyId) {
        const bodyInfo = this.bodies.get(bodyId);
        if (bodyInfo) {
            Matter.World.remove(this.world, bodyInfo.body);
            this.bodies.delete(bodyId);
            return true;
        }
        return false;
    }
    
    getBodyById(id) {
        const info = this.bodies.get(id);
        return info ? info.body : null;
    }
    
    getBodyData(id) {
        const info = this.bodies.get(id);
        return info ? info.data : null;
    }
    
    spawnItem(itemData, x, y) {
        const size = CONFIG.game.itemSize;
        const body = Matter.Bodies.rectangle(
            x || Utils.randomInt(size, this.canvas.width - size),
            y || -size,
            size,
            size,
            {
                restitution: CONFIG.physics.restitution,
                friction: CONFIG.physics.friction,
                density: CONFIG.physics.itemDensity,
                angle: Utils.randomFloat(-0.3, 0.3),
                render: {
                    fillStyle: itemData.color || '#d4a574'
                }
            }
        );
        
        return this.addBody(body, itemData);
    }
    
    rotateBody(bodyId) {
        const body = this.getBodyById(bodyId);
        if (body) {
            Matter.Body.rotate(body, Math.PI / 2);
        }
    }
    
    selectBody(bodyId) {
        const info = this.bodies.get(bodyId);
        if (info) {
            info.selected = true;
            if (info.body.render) {
                info.body.render.strokeStyle = CONFIG.colors.gold;
                info.body.render.lineWidth = 4;
            }
        }
    }
    
    deselectBody(bodyId) {
        const info = this.bodies.get(bodyId);
        if (info) {
            info.selected = false;
            if (info.body.render) {
                info.body.render.strokeStyle = null;
                info.body.render.lineWidth = 0;
            }
        }
    }
    
    deselectAll() {
        this.bodies.forEach((info) => {
            info.selected = false;
            if (info.body.render) {
                info.body.render.strokeStyle = null;
                info.body.render.lineWidth = 0;
            }
        });
    }
    
    getSelectedBodies() {
        const selected = [];
        this.bodies.forEach((info, id) => {
            if (info.selected) {
                selected.push({
                    id: id,
                    body: info.body,
                    data: info.data
                });
            }
        });
        return selected;
    }
    
    addGravityPoint(x, y, strength = 0.01, radius = 150) {
        const gravityPoint = {
            x: x,
            y: y,
            strength: strength,
            radius: radius,
            lifetime: 300
        };
        this.gravityPoints.push(gravityPoint);
        return gravityPoint;
    }
    
    updateGravityPoints() {
        this.gravityPoints = this.gravityPoints.filter(point => {
            point.lifetime--;
            
            this.bodies.forEach(info => {
                const body = info.body;
                const dx = point.x - body.position.x;
                const dy = point.y - body.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < point.radius) {
                    const force = point.strength * (1 - dist / point.radius);
                    Matter.Body.applyForce(body, body.position, {
                        x: dx * force,
                        y: dy * force
                    });
                }
            });
            
            return point.lifetime > 0;
        });
    }
    
    getAllBodies() {
        const bodies = [];
        this.bodies.forEach((info, id) => {
            bodies.push({
                id: id,
                body: info.body,
                data: info.data,
                selected: info.selected
            });
        });
        return bodies;
    }
    
    getBodyCount() {
        return this.bodies.size;
    }
    
    clear() {
        this.bodies.forEach((info) => {
            Matter.World.remove(this.world, info.body);
        });
        this.bodies.clear();
        this.gravityPoints = [];
    }
    
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.setupWorld();
    }
    
    createBodyAt(x, y, size, itemData) {
        const body = Matter.Bodies.rectangle(
            x,
            y,
            size,
            size,
            {
                restitution: CONFIG.physics.restitution,
                friction: CONFIG.physics.friction,
                density: CONFIG.physics.itemDensity,
                render: {
                    fillStyle: itemData.color || '#d4a574'
                }
            }
        );
        
        return this.addBody(body, itemData);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsEngine;
}
