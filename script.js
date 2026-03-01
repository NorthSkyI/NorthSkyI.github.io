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

// 启动浮动爱心动画
createFloatingHearts();

// 添加点击生成爱心功能
addClickHeartEffect();

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