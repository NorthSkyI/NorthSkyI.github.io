// 全局变量存储日期设置
let loveStartDate = new Date('2026-02-21');
let meetDate = new Date('2026-02-16');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    updateLoveTimer();
    updateAnniversaries();
    
    // 每秒更新一次时间
    setInterval(updateLoveTimer, 1000);
    
    // 每分钟更新一次纪念日倒计时
    setInterval(updateAnniversaries, 60000);
    
    // 初始化音乐播放器
    initializeMusicPlayer();
});

// 加载保存的设置
function loadSettings() {
    const savedLoveDate = localStorage.getItem('loveStartDate');
    const savedMeetDate = localStorage.getItem('meetDate');
    
    if (savedLoveDate) {
        loveStartDate = new Date(savedLoveDate);
        document.getElementById('start-date').value = formatDateForInput(loveStartDate);
    }
    
    if (savedMeetDate) {
        meetDate = new Date(savedMeetDate);
        document.getElementById('meet-date').value = formatDateForInput(meetDate);
    }
    
    // 更新页面显示的日期
    document.getElementById('meet-day').textContent = formatDate(meetDate);
    document.getElementById('love-day').textContent = formatDate(loveStartDate);
    
    // 计算下一个情人节
    const nextValentine = getNextValentine();
    document.getElementById('valentine-day').textContent = formatDate(nextValentine);
}

// 音乐播放器功能
let musicList = [];
let currentSongIndex = 0;
let isMusicPlaying = false;

// 初始化音乐播放器
function initializeMusicPlayer() {
    loadMusicList();
    if (musicList.length > 0) {
        // 尝试自动播放，处理浏览器限制
        const audio = document.getElementById('background-music');
        
        // 设置自动播放属性
        audio.autoplay = true;
        
        playRandomSong().catch(error => {
            console.log('自动播放被阻止:', error);
            // 显示提示信息，让用户手动点击播放
            showPlayPrompt();
        });
    }
}

// 加载音乐列表
function loadMusicList() {
    // 这里可以扩展为从服务器获取音乐列表
    musicList = ['A Thousand Years-Christina Perri.mp3'];
    
    // 添加更多示例音乐（实际使用时可以替换为真实音乐文件）
    // musicList.push('Another Love Song.mp3');
    // musicList.push('Perfect - Ed Sheeran.mp3');
    // musicList.push('Can\'t Help Falling In Love.mp3');
}

// 播放随机歌曲
function playRandomSong() {
    return new Promise((resolve, reject) => {
        if (musicList.length === 0) return resolve();
        
        currentSongIndex = Math.floor(Math.random() * musicList.length);
        const audio = document.getElementById('background-music');
        audio.src = 'music/' + musicList[currentSongIndex];
        
        // 更新当前播放显示
        document.getElementById('current-song').textContent = 
            musicList[currentSongIndex].replace('.mp3', '');
        
        // 自动播放
        audio.play().then(() => {
            isMusicPlaying = true;
            updatePlayButton();
            resolve();
        }).catch(error => {
            isMusicPlaying = false;
            updatePlayButton();
            reject(error);
        });
    });
}

// 播放/暂停音乐
function playPauseMusic() {
    const audio = document.getElementById('background-music');
    
    if (isMusicPlaying) {
        audio.pause();
    } else {
        audio.play().catch(error => {
            console.log('播放失败:', error);
        });
    }
    
    isMusicPlaying = !isMusicPlaying;
    updatePlayButton();
}

// 更新播放按钮状态
function updatePlayButton() {
    const button = document.getElementById('play-pause-btn');
    button.textContent = isMusicPlaying ? '⏸️' : '▶';
}

// 播放下一首（循环播放）
function playNextSong() {
    if (musicList.length === 0) return;
    
    currentSongIndex = (currentSongIndex + 1) % musicList.length;
    const audio = document.getElementById('background-music');
    audio.src = 'music/' + musicList[currentSongIndex];
    
    // 更新当前播放显示
    document.getElementById('current-song').textContent = 
        musicList[currentSongIndex].replace('.mp3', '');
    
    audio.play().catch(error => {
        console.log('播放失败:', error);
    });
    
    isMusicPlaying = true;
    updatePlayButton();
}

// 切换音乐面板显示
function toggleMusicPanel() {
    const panel = document.querySelector('.music-panel');
    panel.classList.toggle('show');
}

// 保存设置
function saveSettings() {
    const startDateInput = document.getElementById('start-date');
    const meetDateInput = document.getElementById('meet-date');
    
    loveStartDate = new Date(startDateInput.value);
    meetDate = new Date(meetDateInput.value);
    
    localStorage.setItem('loveStartDate', loveStartDate.toISOString());
    localStorage.setItem('meetDate', meetDate.toISOString());
    
    // 更新页面显示的日期
    document.getElementById('meet-day').textContent = formatDate(meetDate);
    document.getElementById('love-day').textContent = formatDate(loveStartDate);
    
    // 重新计算下一个情人节
    const nextValentine = getNextValentine();
    document.getElementById('valentine-day').textContent = formatDate(nextValentine);
    
    // 立即更新计时器和倒计时
    updateLoveTimer();
    updateAnniversaries();
    
    alert('设置已保存！');
}

// 更新恋爱计时器
function updateLoveTimer() {
    const now = new Date();
    const diffTime = now - loveStartDate;
    
    // 计算天数、小时、分钟、秒数
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    // 更新页面显示
    document.getElementById('love-days').textContent = days;
    document.getElementById('love-hours').textContent = hours;
    document.getElementById('love-minutes').textContent = minutes;
    
    // 更新详细时间显示
    document.getElementById('detailed-days').textContent = days;
    document.getElementById('detailed-hours').textContent = hours;
    document.getElementById('detailed-minutes').textContent = minutes;
    document.getElementById('detailed-seconds').textContent = seconds;
}

// 更新纪念日倒计时
function updateAnniversaries() {
    const now = new Date();
    
    // 相遇纪念日倒计时
    const nextMeetAnniversary = getNextAnniversary(meetDate, now);
    const meetDiff = nextMeetAnniversary - now;
    document.getElementById('meet-countdown').textContent = formatCountdown(meetDiff);
    
    // 恋爱纪念日倒计时
    const nextLoveAnniversary = getNextAnniversary(loveStartDate, now);
    const loveDiff = nextLoveAnniversary - now;
    document.getElementById('love-countdown').textContent = formatCountdown(loveDiff);
    
    // 下一个情人节倒计时
    const nextValentine = getNextValentine();
    const valentineDiff = nextValentine - now;
    document.getElementById('valentine-countdown').textContent = formatCountdown(valentineDiff);
}

// 获取下一个周年纪念日
function getNextAnniversary(originalDate, currentDate) {
    const currentYear = currentDate.getFullYear();
    const anniversaryThisYear = new Date(originalDate);
    anniversaryThisYear.setFullYear(currentYear);
    
    if (anniversaryThisYear > currentDate) {
        return anniversaryThisYear;
    } else {
        const anniversaryNextYear = new Date(originalDate);
        anniversaryNextYear.setFullYear(currentYear + 1);
        return anniversaryNextYear;
    }
}

// 获取下一个情人节（2月14日）
function getNextValentine() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const valentineThisYear = new Date(currentYear, 1, 15); // 2月是1（0-indexed）
    
    if (valentineThisYear > now) {
        return valentineThisYear;
    } else {
        return new Date(currentYear + 1, 1, 15);
    }
}

// 格式化倒计时显示
function formatCountdown(diffTime) {
    if (diffTime <= 0) {
        return "就是今天！";
    }
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        return `还有 ${days} 天 ${hours} 小时`;
    } else if (hours > 0) {
        return `还有 ${hours} 小时`;
    } else {
        return "不到1小时";
    }
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// 格式化日期为 input[type=date] 需要的格式
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// 添加浮动爱心的动画效果
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💞', '💝', '💘'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 4 + 3) + 's';
        heart.style.fontSize = (Math.random() * 1 + 1.5) + 'em';
        heart.style.opacity = Math.random() * 0.3 + 0.1;
        
        heartsContainer.appendChild(heart);
        
        // 移除动画完成的心形
        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 2000);
}

// 恋爱清单数据
const loveList = [
    {
        "id": 1,
        "status": 0,
        "content": "来一次说走就走的旅行"
    },
    {
        "id": 2,
        "status": 0,
        "content": "一起放风筝"
    },
    {
        "id": 3,
        "status": 0,
        "content": "一起骑自行车"
    },
    {
        "id": 4,
        "status": 0,
        "content": "一起去跑步"
    },
    {
        "id": 5,
        "status": 0,
        "content": "互相给对方写一封信"
    },
    {
        "id": 6,
        "status": 0,
        "content": "背着我走一段路"
    },
    {
        "id": 7,
        "status": 0,
        "content": "一起跳手势舞"
    },
    {
        "id": 8,
        "status": 0,
        "content": "一起去博物馆"
    },
    {
        "id": 9,
        "status": 0,
        "content": "一起爬山"
    },
    {
        "id": 10,
        "status": 0,
        "content": "下雪天堆雪人打雪仗"
    },
    {
        "id": 11,
        "status": 0,
        "content": "给对方一个温暖的拥抱"
    },
    {
        "id": 12,
        "status": 0,
        "content": "一起玩游戏"
    },
    {
        "id": 13,
        "status": 0,
        "content": "一起欣赏城市夜景"
    },
    {
        "id": 14,
        "status": 0,
        "content": "以喝交杯酒的方式喝东西"
    },
    {
        "id": 15,
        "status": 0,
        "content": "一起庆祝恋爱纪念日"
    },
    {
        "id": 16,
        "status": 0,
        "content": "一起野餐"
    },
    {
        "id": 17,
        "status": 0,
        "content": "一起吐槽一次对方缺点"
    },
    {
        "id": 18,
        "status": 0,
        "content": "一起去拍一次情侣写真"
    },
    {
        "id": 19,
        "status": 0,
        "content": "一起玩拼图"
    },
    {
        "id": 20,
        "status": 0,
        "content": "一起做陶艺"
    },
    {
        "id": 21,
        "status": 0,
        "content": "一起吃火锅"
    },
    {
        "id": 22,
        "status": 0,
        "content": "一起看海"
    },
    {
        "id": 23,
        "status": 0,
        "content": "一起去动物园"
    },
    {
        "id": 24,
        "status": 1,
        "content": "一起做手工"
    },
    {
        "id": 25,
        "status": 0,
        "content": "一起跨年"
    },
    {
        "id": 26,
        "status": 0,
        "content": "一起放烟花"
    },
    {
        "id": 27,
        "status": 0,
        "content": "一起听歌"
    },
    {
        "id": 28,
        "status": 0,
        "content": "自驾游"
    },
    {
        "id": 29,
        "status": 0,
        "content": "一起逛母校"
    },
    {
        "id": 30,
        "status": 0,
        "content": "一起看雪"
    },
    {
        "id": 31,
        "status": 0,
        "content": "给对方拍照"
    },
    {
        "id": 32,
        "status": 0,
        "content": "为对方吹头发"
    },
    {
        "id": 33,
        "status": 0,
        "content": "一起去鬼屋"
    },
    {
        "id": 34,
        "status": 0,
        "content": "玩真心话大冒险"
    },
    {
        "id": 35,
        "status": 0,
        "content": "一起去水上乐园"
    },
    {
        "id": 36,
        "status": 0,
        "content": "一起去小吃街"
    },
    {
        "id": 37,
        "status": 0,
        "content": "一起玩五子棋"
    },
    {
        "id": 38,
        "status": 0,
        "content": "一起喝酒"
    },
    {
        "id": 39,
        "status": 0,
        "content": "一起吃烤肉"
    },
    {
        "id": 40,
        "status": 0,
        "content": "互相喂食"
    },
    {
        "id": 41,
        "status": 0,
        "content": "互相按摩"
    },
    {
        "id": 42,
        "status": 0,
        "content": "一起坐摩天轮"
    },
    {
        "id": 43,
        "status": 0,
        "content": "一起聊关于未来"
    },
    {
        "id": 44,
        "status": 0,
        "content": "一起看电影"
    },
    {
        "id": 45,
        "status": 0,
        "content": "一起去海洋馆"
    },
    {
        "id": 46,
        "status": 0,
        "content": "一起逛花鸟市场"
    },
    {
        "id": 47,
        "status": 0,
        "content": "一起逛超市"
    },
    {
        "id": 48,
        "status": 0,
        "content": "一起看日出🌅"
    },
    {
        "id": 49,
        "status": 0,
        "content": "一起看日落🌄"
    },
    {
        "id": 50,
        "status": 0,
        "content": "一起看绚烂的烟花🌟"
    },
    {
        "id": 51,
        "status": 0,
        "content": "一起吃夜市🍖"
    },
    {
        "id": 52,
        "status": 0,
        "content": "一起穿情侣装逛街👫"
    },
    {
        "id": 53,
        "status": 0,
        "content": "陪对方过生日🎂"
    },
    {
        "id": 54,
        "status": 0,
        "content": "一起去逛古镇老街"
    },
    {
        "id": 55,
        "status": 0,
        "content": "在雨中漫步☔"
    },
    {
        "id": 56,
        "status": 0,
        "content": "在沙滩上写下彼此的名字✍"
    },
    {
        "id": 57,
        "status": 0,
        "content": "穿彼此的衣服👯"
    },
    {
        "id": 58,
        "status": 0,
        "content": "一起赏月🌙"
    },
    {
        "id": 59,
        "status": 0,
        "content": "为对方剥水果"
    },
    {
        "id": 60,
        "status": 0,
        "content": "为对方系鞋带"
    },
    {
        "id": 61,
        "status": 0,
        "content": "一起去见对方父母"
    },
    {
        "id": 62,
        "status": 0,
        "content": "一起喝茶"
    },
    {
        "id": 63,
        "status": 0,
        "content": "一起吃早餐"
    },
    {
        "id": 64,
        "status": 0,
        "content": "一起剪辑旅行视频"
    },
    {
        "id": 65,
        "status": 0,
        "content": "为对方化妆"
    },
    {
        "id": 66,
        "status": 0,
        "content": "一次浪漫的告白"
    },
    {
        "id": 67,
        "status": 0,
        "content": "为对方夹菜"
    },
    {
        "id": 68,
        "status": 0,
        "content": "一起打电话12个小时"
    },
    {
        "id": 69,
        "status": 0,
        "content": "一起喝奶茶"
    },
    {
        "id": 70,
        "status": 0,
        "content": "一起吃甜品"
    },
    {
        "id": 71,
        "status": 0,
        "content": "一起做缆车"
    },
    {
        "id": 72,
        "status": 0,
        "content": "一起打一把伞"
    },
    {
        "id": 73,
        "status": 0,
        "content": "一起吃宵夜"
    },
    {
        "id": 74,
        "status": 0,
        "content": "一起看恐怖片"
    },
    {
        "id": 75,
        "status": 0,
        "content": "一起熬夜"
    },
    {
        "id": 76,
        "status": 0,
        "content": "为对方挑选一束花"
    },
    {
        "id": 77,
        "status": 0,
        "content": "互说“我爱你”"
    },
    {
        "id": 78,
        "status": 0,
        "content": "一起拍一个旅行vlog"
    },
    {
        "id": 79,
        "status": 0,
        "content": "一起赏花"
    },
    {
        "id": 80,
        "status": 0,
        "content": "一起坐船"
    },
    {
        "id": 81,
        "status": 0,
        "content": "一起吃自助餐"
    },
    {
        "id": 82,
        "status": 0,
        "content": "一起制作一本关于你们的剪贴簿"
    },
    {
        "id": 83,
        "status": 0,
        "content": "一起敷面膜"
    },
    {
        "id": 84,
        "status": 0,
        "content": "嘴对嘴吃东西🍜"
    },
    {
        "id": 85,
        "status": 0,
        "content": "一起抓娃娃"
    },
    {
        "id": 86,
        "status": 0,
        "content": "一起手拉手压马路👫"
    },
    {
        "id": 87,
        "status": 0,
        "content": "在公共场合下一起喝娃哈哈🍼"
    },
    {
        "id": 88,
        "status": 0,
        "content": "一起吃西瓜🍉"
    },
    {
        "id": 89,
        "status": 0,
        "content": "推对方玩秋千💁"
    },
    {
        "id": 90,
        "status": 0,
        "content": "一起去看一次音乐会🎵"
    },
    {
        "id": 91,
        "status": 0,
        "content": "一起完成密室逃脱💀"
    },
    {
        "id": 92,
        "status": 0,
        "content": "一起在冬天吃冰激凌"
    },
    {
        "id": 93,
        "status": 0,
        "content": "一起追剧"
    },
    {
        "id": 94,
        "status": 0,
        "content": "互相叫“老婆”和“老公”👨‍❤️‍💋‍👨"
    },
    {
        "id": 95,
        "status": 0,
        "content": "带你在午夜开车兜风🚙"
    },
    {
        "id": 96,
        "status": 0,
        "content": "拥有我们独特的情侣戒指💍"
    },
    {
        "id": 97,
        "status": 0,
        "content": "来一场难忘的求婚🎁💍"
    },
    {
        "id": 98,
        "status": 0,
        "content": "拍属于我们自己的婚纱照🎎"
    },
    {
        "id": 99,
        "status": 0,
        "content": "互相在朋友圈晒结婚证📇"
    },
    {
        "id": 100,
        "status": 0,
        "content": "举行一场梦中的婚礼💤🌹🎉"
    }
];

// 初始化恋爱清单
function initializeLoveList() {
    renderLoveList();
    
    // 默认关闭所有恋爱清单项目
    setTimeout(() => {
        document.querySelectorAll('.love-list-item').forEach(item => {
            const content = item.querySelector('.love-list-content');
            content.style.height = '0';
        });
    }, 100);
}

// 渲染恋爱清单
function renderLoveList() {
    const container = document.getElementById('love-list-items');
    container.innerHTML = '';
    
    loveList.forEach(item => {
        const listItem = createLoveListItem(item);
        container.appendChild(listItem);
    });
}

// 创建恋爱清单项目
function createLoveListItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'love-list-item';
    itemElement.dataset.id = item.id;
    
    // 项目头部（可点击部分）
    const header = document.createElement('div');
    header.className = 'love-list-header';
    header.innerHTML = `
        <span class="item-number">${item.id}.</span>
        <span class="item-content">${item.content}</span>
        <span class="item-status ${item.status === 1 ? 'completed' : 'pending'}">
            ${item.status === 1 ? '✅' : '⏳'}
        </span>
    `;
    
    // 项目内容（展开部分）
    const content = document.createElement('div');
    content.className = 'love-list-content';
    
    if (item.status === 1) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'item-image-container';
        
        const img = document.createElement('img');
        img.src = `lovelist/${item.id}.png`;
        img.alt = item.content;
        img.className = item.status === 1 ? 'item-image' : 'item-image grayscale';
        img.onerror = function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = '暂无图片';
            imgContainer.appendChild(placeholder);
        };
        
        imgContainer.appendChild(img);
        content.appendChild(imgContainer);
    } else {
        const noImage = document.createElement('div');
        noImage.className = 'no-image';
        noImage.textContent = '暂无图片';
        content.appendChild(noImage);
    }
    
    // 点击展开/收起
    header.addEventListener('click', function() {
        const isExpanded = itemElement.classList.contains('expanded');
        
        // 收起所有其他展开的项目
        document.querySelectorAll('.love-list-item.expanded').forEach(expandedItem => {
            if (expandedItem !== itemElement) {
                expandedItem.classList.remove('expanded');
                const content = expandedItem.querySelector('.love-list-content');
                content.style.height = '0';
            }
        });
        
        // 切换当前项目
        if (!isExpanded) {
            itemElement.classList.add('expanded');
            const content = itemElement.querySelector('.love-list-content');
            content.style.height = 'auto';
            const contentHeight = content.scrollHeight;
            content.style.height = '0';
            // 触发重排
            content.offsetHeight;
            content.style.height = contentHeight + 'px';
        } else {
            const content = itemElement.querySelector('.love-list-content');
            content.style.height = '0';
            content.addEventListener('transitionend', function handler() {
                itemElement.classList.remove('expanded');
                content.removeEventListener('transitionend', handler);
            }, { once: true });
        }
    });
    
    itemElement.appendChild(header);
    itemElement.appendChild(content);
    
    return itemElement;
}

// 启动浮动爱心动画
createFloatingHearts();

// 添加点击生成爱心功能
addClickHeartEffect();

// 初始化恋爱清单
initializeLoveList();

// 点击生成爱心功能
function addClickHeartEffect() {
    document.addEventListener('click', function(e) {
        const hearts = ['❤️', '💕', '💖', '💗', '💓', '💞', '💝', '💘'];
        const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
        
        // 创建爱心元素
        const heart = document.createElement('div');
        heart.className = 'click-heart';
        heart.textContent = randomHeart;
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = (Math.random() * 1.5 + 1.5) + 'em';
        heart.style.zIndex = '9999';
        heart.style.pointerEvents = 'none';
        heart.style.userSelect = 'none';
        
        document.body.appendChild(heart);
        
        // 波浪形动画
        const animationDuration = Math.random() * 2 + 3; // 3-5秒
        const waveAmplitude = Math.random() * 30 + 20; // 20-50px波浪幅度
        const startX = e.clientX;
        
        // 动画关键帧
        const keyframes = [
            { 
                transform: 'translateY(0) translateX(0)',
                opacity: 1
            },
            { 
                transform: `translateY(-100px) translateX(${waveAmplitude}px)`,
                opacity: 0.8
            },
            { 
                transform: `translateY(-200px) translateX(${-waveAmplitude}px)`,
                opacity: 0.6
            },
            { 
                transform: `translateY(-300px) translateX(${waveAmplitude}px)`,
                opacity: 0.4
            },
            { 
                transform: `translateY(-400px) translateX(${-waveAmplitude}px)`,
                opacity: 0.2
            },
            { 
                transform: `translateY(-500px) translateX(0)`,
                opacity: 0
            }
        ];
        
        // 执行动画
        heart.animate(keyframes, {
            duration: animationDuration * 1000,
            easing: 'ease-out'
        });
        
        // 动画完成后移除元素
        setTimeout(() => {
            heart.remove();
        }, animationDuration * 1000);
    });
}