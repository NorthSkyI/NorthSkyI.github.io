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