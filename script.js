/**
 * [1] 섹션 이동 기능
 */
function showSection(type) {
    const subSections = document.querySelectorAll('.sub-section');
    subSections.forEach(sec => {
        sec.classList.remove('active-section');
    });

    const mainVisual = document.getElementById('main-visual');
    
    if (type === 'main') {
        mainVisual.classList.remove('hidden');
    } else {
        mainVisual.classList.add('hidden');
        const targetSection = document.getElementById(type);
        if (targetSection) {
            targetSection.classList.add('active-section');
        }
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * [2] 드롭다운 메뉴 및 기타 UI 제어
 */
function toggleDropdown(event, dropId) {
    event.stopPropagation();
    const dropdown = document.getElementById(dropId);
    document.querySelectorAll('.dropdown-menu').forEach(d => { 
        if(d.id !== dropId) d.classList.remove('show'); 
    });
    dropdown.classList.toggle('show');
}

window.onclick = () => document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));

function copyText(text) {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    alert("계좌번호가 복사되었습니다.");
}

/**
 * [3] 방명록 데이터 및 페이징 기능
 */
let messages = [
    { name: "친구 지현", text: "결혼 진심으로 축하해! 행복하게 잘 살아!" },
    { name: "직장동료 민우", text: "세상에서 가장 예쁜 신부님, 꽃길만 걸으세요~" },
    { name: "가족 성현", text: "두 사람의 앞날에 축복만 가득하길!" },
    { name: "후배 수빈", text: "형, 누나 결혼 너무 축하드려요!" }
];
let currentPage = 1;
const itemsPerPage = 4;

function toggleMsgInput() {
    document.getElementById('msg-input-area').classList.toggle('show');
}

function renderMessages() {
    const wall = document.getElementById('message-wall');
    if(!wall) return;
    wall.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const pagedItems = messages.slice(start, start + itemsPerPage);
    pagedItems.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'post-it';
        div.innerHTML = `<div>${msg.text}</div><div class="msg-writer">From. ${msg.name}</div>`;
        wall.appendChild(div);
    });
    const total = Math.ceil(messages.length / itemsPerPage) || 1;
    const pageNumEl = document.getElementById('page-num');
    if(pageNumEl) pageNumEl.innerText = `${currentPage} / ${total}`;
}

function addMessage() {
    const name = document.getElementById('msg-name').value;
    const text = document.getElementById('msg-text').value;
    if (!name || !text) return alert("내용을 입력해주세요!");
    messages.unshift({ name, text });
    currentPage = 1;
    renderMessages();
    document.getElementById('msg-name').value = '';
    document.getElementById('msg-text').value = '';
    toggleMsgInput();
}

function changePage(dir) { 
    const total = Math.ceil(messages.length / itemsPerPage) || 1;
    let next = currentPage + dir;
    if(next < 1 || next > total) return;
    currentPage = next; 
    renderMessages(); 
}

/**
 * [4] 카드 뒤집기 애니메이션
 */
const card = document.getElementById('flip-card');
const cardBack = document.getElementById('card-back-side');

if (card) {
    let isFlipped = false;
    let autoTimer;

    function flipAction() {
        isFlipped = !isFlipped;
        card.classList.add('paused'); 
        card.style.animation = 'none'; 
        card.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
        if(isFlipped && cardBack) cardBack.scrollTop = 0;
        clearTimeout(autoTimer);
    }

    function resetAutoTimer() {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(() => {
            if(!card.classList.contains('paused')) {
                isFlipped = !isFlipped;
                card.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
                if(isFlipped && cardBack) cardBack.scrollTop = 0;
            }
            resetAutoTimer(); 
        }, 20000); 
    }

    card.addEventListener('click', (e) => {
        if(e.target.closest('.copy-btn') || e.target.closest('.msg-toggle-btn') || e.target.closest('.reg-btn')) return;
        if(isFlipped && e.target.closest('.card-back') && e.target !== e.currentTarget) {
            if(cardBack && cardBack.scrollTop > 10) return;
        }
        flipAction();
    });

    let touchstartX = 0;
    let touchstartY = 0;

    card.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
        card.classList.add('paused'); 
    }, {passive: true});

    card.addEventListener('touchend', e => {
        if(e.target.closest('.copy-btn') || e.target.closest('.msg-toggle-btn')) return;
        let touchendX = e.changedTouches[0].screenX;
        let touchendY = e.changedTouches[0].screenY;
        const diffX = Math.abs(touchendX - touchstartX);
        const diffY = Math.abs(touchendY - touchstartY);
        if (diffX > 50 && diffX > diffY) {
            flipAction();
        }
    }, {passive: true});

    resetAutoTimer();
}

/**
 * [5] 또댕 발자취 2단 슬라이더 초기화 (스크롤바 연동 최적화)
 */
function initDualSlider(containerId, thumbId) {
    const container = document.getElementById(containerId);
    const thumb = document.getElementById(thumbId);

    if (!container || !thumb) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        container.style.cursor = 'grabbing';
    });

    container.addEventListener('mouseleave', () => { isDown = false; container.style.cursor = 'grab'; });
    container.addEventListener('mouseup', () => { isDown = false; container.style.cursor = 'grab'; });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    // 스크롤 시 조그마한 바 내부의 핸들(thumb) 위치 계산
    container.addEventListener('scroll', () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const scrollPercent = container.scrollLeft / (maxScroll || 1);
        
        // 조그마한 트랙 너비(80px)에서 핸들 너비(30px)를 뺀 나머지 거리(50px)만큼만 이동
        const moveRange = 50; 
        thumb.style.transform = `translateX(${scrollPercent * moveRange}px)`;
    });
}

/**
 * [6] 초기화 실행
 */
window.addEventListener('load', () => {
    renderMessages();
    initDualSlider('container-row1', 'thumb-row1');
    initDualSlider('container-row2', 'thumb-row2');
});