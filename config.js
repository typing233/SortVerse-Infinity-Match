const CONFIG = {
    physics: {
        gravity: 0.5,
        friction: 0.1,
        restitution: 0.3,
        itemDensity: 0.001
    },
    
    game: {
        spawnInterval: 3000,
        maxItems: 30,
        itemSize: 50,
        matchCount: 3,
        hintsAvailable: 3
    },
    
    modes: {
        classic: {
            name: '经典三消',
            matchType: 'visual',
            matchCount: 3,
            description: '三个相同物品即可消除'
        },
        memory: {
            name: '记忆碎片',
            matchType: 'logical',
            matchCount: 3,
            description: '将关联的碎片拼成完整记忆'
        },
        logic: {
            name: '逻辑关联',
            matchType: 'logic',
            matchCount: 3,
            description: '找出逻辑上相关的物品组'
        }
    },
    
    levels: [
        {
            id: 1,
            name: '初识记忆',
            targetMemories: 3,
            requiredFragments: 2,
            timeLimit: 0,
            memorySets: ['grandfather_watch', 'love_letter', 'childhood_doll']
        },
        {
            id: 2,
            name: '时光印记',
            targetMemories: 5,
            requiredFragments: 3,
            timeLimit: 0,
            memorySets: ['grandfather_watch', 'love_letter', 'childhood_doll', 'war_medal', 'old_camera']
        },
        {
            id: 3,
            name: '岁月珍藏',
            targetMemories: 7,
            requiredFragments: 4,
            timeLimit: 180,
            memorySets: ['grandfather_watch', 'love_letter', 'childhood_doll', 'war_medal', 'old_camera', 'wedding_ring', 'diary']
        },
        {
            id: 4,
            name: '记忆长河',
            targetMemories: 10,
            requiredFragments: 5,
            timeLimit: 240,
            memorySets: ['grandfather_watch', 'love_letter', 'childhood_doll', 'war_medal', 'old_camera', 'wedding_ring', 'diary', 'music_box', 'ticket_stub', 'lighthouse']
        }
    ],
    
    memorySets: {
        grandfather_watch: {
            id: 'grandfather_watch',
            name: '祖父的怀表',
            category: 'war',
            era: '1940s',
            fragments: [
                { id: 'watch_face', name: '表盘', icon: '⌚', color: '#d4a574', description: '磨损的表盘，时针停在3点15分' },
                { id: 'watch_chain', name: '表链', icon: '⛓️', color: '#b8860b', description: '银质表链，刻有小小的"父"字' },
                { id: 'watch_key', name: '发条', icon: '🔑', color: '#cd853f', description: '小小的铜质发条，末端有些弯曲' }
            ],
            story: {
                title: '祖父的怀表',
                text: '1945年，祖父在战场上修好了这块怀表。那时他躲在战壕里，炮弹声此起彼伏。他把表放在耳边，听着滴答声，就像听到祖母在远方的心跳。那天下午3点15分，战争结束了。祖父说，这块怀表是他收到的最好的礼物，因为它让他相信，无论等待多久，时间终会带来希望。'
            }
        },
        
        love_letter: {
            id: 'love_letter',
            name: '情书碎片',
            category: 'romance',
            era: '1920s',
            fragments: [
                { id: 'letter_begin', name: '信首', icon: '💌', color: '#f5deb3', description: '"亲爱的..."开头的字迹' },
                { id: 'letter_middle', name: '信中', icon: '📝', color: '#faebd7', description: '诉说思念的段落' },
                { id: 'letter_end', name: '信尾', icon: '💋', color: '#ffe4c4', description: '"永远爱你的人..."的署名' }
            ],
            story: {
                title: '未曾寄出的信',
                text: '这封信写于1928年的春天。一个叫林小雨的女孩，每天晚上在煤油灯下给远在他乡求学的恋人写信。她写了一封又一封，却从来没有寄出过。因为她知道，恋人早已在一场意外中离世。这些信，是她对爱情最虔诚的祭奠。后来人们在她的旧箱子里发现了上百封这样的信，每一封都用漂亮的丝带捆绑着。'
            }
        },
        
        childhood_doll: {
            id: 'childhood_doll',
            name: '童年布偶',
            category: 'childhood',
            era: '1980s',
            fragments: [
                { id: 'doll_head', name: '布偶头', icon: '🎭', color: '#ffd1dc', description: '圆圆的眼睛，脸上带着微笑' },
                { id: 'doll_body', name: '布偶身体', icon: '🧸', color: '#ffb6c1', description: '穿着粉色小裙子的身体' },
                { id: 'doll_arm', name: '布偶手臂', icon: '👋', color: '#ff69b4', description: '小小的手臂，像是在招手' }
            ],
            story: {
                title: '小美的布偶',
                text: '1985年，小美八岁生日那天，妈妈亲手给她做了这个布偶。布偶的眼睛是用纽扣做的，裙子是用妈妈旧衣服改的。小美走到哪里都带着它。后来小美长大了，布偶被收进了阁楼。再后来妈妈去世了，小美在整理旧物时发现了这个布偶。布偶已经很旧了，但小美觉得，抱着它，就像还能感受到妈妈的温度。'
            }
        },
        
        war_medal: {
            id: 'war_medal',
            name: '战争勋章',
            category: 'war',
            era: '1950s',
            fragments: [
                { id: 'medal_front', name: '勋章正面', icon: '🏅', color: '#daa520', description: '刻有五角星的正面' },
                { id: 'medal_back', name: '勋章背面', icon: '🔙', color: '#b8860b', description: '刻有名字缩写的背面' },
                { id: 'medal_ribbon', name: '勋章绶带', icon: '🎀', color: '#dc143c', description: '红色的绶带，有些褪色' }
            ],
            story: {
                title: '无名英雄',
                text: '这枚勋章属于一位不知名的战士。他参加了抗美援朝战争，在一次战斗中牺牲了。战友们在他的口袋里发现了这枚勋章和一张全家福照片。照片上，他和妻子、年幼的女儿笑得很开心。没有人知道他的名字，没有人知道他的家人是否收到了他牺牲的消息。这枚勋章，是他留给这个世界的唯一痕迹。'
            }
        },
        
        old_camera: {
            id: 'old_camera',
            name: '老式相机',
            category: 'memory',
            era: '1960s',
            fragments: [
                { id: 'camera_lens', name: '镜头', icon: '📷', color: '#2f4f4f', description: '蒙着灰尘的玻璃镜头' },
                { id: 'camera_body', name: '机身', icon: '📹', color: '#696969', description: '黑色的金属机身' },
                { id: 'camera_film', name: '胶卷', icon: '🎞️', color: '#333333', description: '未冲洗的胶卷' }
            ],
            story: {
                title: '摄影师的最后一卷',
                text: '1968年的一个下午，一位摄影师走进了北京的一条老胡同。他用这台相机记录了胡同里的日常生活：孩子们在跳皮筋，老人们在下棋，卖冰棍的小贩在吆喝。这是他拍的最后一卷胶卷。第二天，他因为心脏病突发去世了。三十年后，他的孙子在暗房里发现了这卷未冲洗的胶卷。照片里的老胡同早已不在，但那些笑容永远定格在了时光里。'
            }
        },
        
        wedding_ring: {
            id: 'wedding_ring',
            name: '婚戒',
            category: 'romance',
            era: '1970s',
            fragments: [
                { id: 'ring_band', name: '戒环', icon: '💍', color: '#ffd700', description: '简单的金色戒环' },
                { id: 'ring_stone', name: '钻石', icon: '💎', color: '#e0ffff', description: '小小的碎钻' },
                { id: 'ring_box', name: '戒指盒', icon: '🎁', color: '#8b0000', description: '红色丝绒戒指盒' }
            ],
            story: {
                title: '迟到五十年的婚礼',
                text: '1970年，王建国和李秀英相爱了。他们约定等王建国从部队回来就结婚。然而王建国在一次执行任务时受伤，失去了部分记忆，忘记了李秀英。李秀英一直等待着，终身未嫁。2020年，一次偶然的机会，他们在养老院重逢。王建国看着李秀英，虽然记不起过去，但心里有一种说不出的亲切感。后来，他们在养老院举办了一场简单的婚礼。这枚婚戒，迟到了整整五十年，但终于戴在了对方的手上。'
            }
        },
        
        diary: {
            id: 'diary',
            name: '日记本',
            category: 'memory',
            era: '1990s',
            fragments: [
                { id: 'diary_cover', name: '封面', icon: '📔', color: '#8b4513', description: '棕色皮质封面' },
                { id: 'diary_page1', name: '第一页', icon: '📄', color: '#f5f5dc', description: '写着秘密的第一页' },
                { id: 'diary_lock', name: '小锁', icon: '🔒', color: '#a0522d', description: '小小的铜锁' }
            ],
            story: {
                title: '十七岁的心事',
                text: '这是一本1995年的日记本，属于一个叫陈雨萱的十七岁女孩。日记本里写满了她的心事：暗恋的男生、和好朋友的争吵、对未来的迷茫。最后一页写着："希望十年后的我，能成为一名记者，能环游世界。" 2025年，陈雨萱在整理旧物时发现了这本日记。她现在是一名记者，也去过很多地方。看着十七岁的自己写下的文字，她眼眶湿润了。原来，梦想真的可以实现。'
            }
        },
        
        music_box: {
            id: 'music_box',
            name: '音乐盒',
            category: 'childhood',
            era: '1950s',
            fragments: [
                { id: 'box_lid', name: '盒盖', icon: '📦', color: '#deb887', description: '雕刻着花纹的木质盒盖' },
                { id: 'box_mechanism', name: '机芯', icon: '⚙️', color: '#c0c0c0', description: '金属的音乐机芯' },
                { id: 'box_key', name: '钥匙', icon: '🗝️', color: '#d4af37', description: '小小的金色钥匙' }
            ],
            story: {
                title: '妈妈的摇篮曲',
                text: '这个音乐盒是1952年一位父亲送给女儿的生日礼物。每天晚上，父亲都会用这个音乐盒给女儿播放摇篮曲。后来女儿长大了，去了远方工作。父亲去世后，女儿回到老家，在抽屉里发现了这个音乐盒。她轻轻转动钥匙，熟悉的旋律响起。那一刻，她仿佛又回到了小时候，躺在父亲温暖的怀里，听着那首永远也听不腻的摇篮曲。'
            }
        },
        
        ticket_stub: {
            id: 'ticket_stub',
            name: '车票存根',
            category: 'travel',
            era: '2000s',
            fragments: [
                { id: 'ticket_part1', name: '出发地', icon: '🚉', color: '#f0e68c', description: '印有"北京"字样的部分' },
                { id: 'ticket_part2', name: '目的地', icon: '🌆', color: '#eee8aa', description: '印有"上海"字样的部分' },
                { id: 'ticket_part3', name: '日期', icon: '📅', color: '#ffffe0', description: '印有日期"2008.08.08"的部分' }
            ],
            story: {
                title: '开往春天的列车',
                text: '2008年8月8日，李明坐上了从北京开往上海的列车。那天是北京奥运会开幕的日子，也是他决定去追求自己梦想的日子。他辞去了稳定的工作，决定去上海创业。车票存根被他小心翼翼地夹在钱包里。十年后，李明的公司已经小有成就。他看着这张车票存根，想起那天火车窗外的风景，想起自己当时激动又不安的心情。他想，如果那天没有坐上那趟列车，自己的人生会是怎样？但他知道，人生没有如果，只有往前走。'
            }
        },
        
        lighthouse: {
            id: 'lighthouse',
            name: '灯塔模型',
            category: 'memory',
            era: '1930s',
            fragments: [
                { id: 'lighthouse_top', name: '灯塔顶部', icon: '🗼', color: '#f5f5f5', description: '白色的灯塔顶部' },
                { id: 'lighthouse_middle', name: '灯塔中部', icon: '🏛️', color: '#ff0000', description: '红白相间的塔身' },
                { id: 'lighthouse_base', name: '灯塔底座', icon: '⚓', color: '#8b4513', description: '木质的底座' }
            ],
            story: {
                title: '守望者',
                text: '1932年，一位叫陈大海的年轻人来到了一座孤岛上，成为了一名灯塔守望者。这座灯塔模型是他亲手做的。每天晚上，他点亮灯塔，为过往的船只指引方向。他在这座孤岛上守了整整四十年，直到1972年退休。退休那天，他把这座灯塔模型留给了新的守望者。后来，灯塔自动化了，再也不需要人守望了。这座灯塔模型被送进了博物馆。人们说，陈大海守望的不只是灯塔，更是那些在黑暗中寻找方向的灵魂。'
            }
        }
    },
    
    classicItems: [
        { id: 'gem_red', name: '红宝石', icon: '🔴', color: '#ff4444' },
        { id: 'gem_blue', name: '蓝宝石', icon: '🔵', color: '#4444ff' },
        { id: 'gem_green', name: '绿宝石', icon: '🟢', color: '#44ff44' },
        { id: 'gem_yellow', name: '黄宝石', icon: '🟡', color: '#ffff44' },
        { id: 'gem_purple', name: '紫宝石', icon: '🟣', color: '#aa44ff' },
        { id: 'gem_cyan', name: '青宝石', icon: '🔷', color: '#44ffff' }
    ],
    
    logicGroups: [
        {
            id: 'fruits',
            name: '水果',
            items: [
                { id: 'apple', name: '苹果', icon: '🍎', color: '#ff6b6b' },
                { id: 'banana', name: '香蕉', icon: '🍌', color: '#ffd93d' },
                { id: 'orange', name: '橙子', icon: '🍊', color: '#ff9f43' }
            ]
        },
        {
            id: 'animals',
            name: '动物',
            items: [
                { id: 'cat', name: '猫', icon: '🐱', color: '#dda15e' },
                { id: 'dog', name: '狗', icon: '🐕', color: '#bc6c25' },
                { id: 'rabbit', name: '兔子', icon: '🐰', color: '#fefae0' }
            ]
        },
        {
            id: 'weather',
            name: '天气',
            items: [
                { id: 'sun', name: '太阳', icon: '☀️', color: '#ffd700' },
                { id: 'rain', name: '雨', icon: '🌧️', color: '#4169e1' },
                { id: 'cloud', name: '云', icon: '☁️', color: '#f0f0f0' }
            ]
        },
        {
            id: 'music',
            name: '音乐',
            items: [
                { id: 'note', name: '音符', icon: '🎵', color: '#9b59b6' },
                { id: 'guitar', name: '吉他', icon: '🎸', color: '#e67e22' },
                { id: 'piano', name: '钢琴', icon: '🎹', color: '#34495e' }
            ]
        }
    ],
    
    colors: {
        parchment: '#f4e4c1',
        ink: '#5c4033',
        inkDark: '#3d2817',
        gold: '#b8860b',
        red: '#8b0000',
        stampRed: '#a62929',
        success: '#4a7c59'
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
