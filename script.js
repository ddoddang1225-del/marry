/**
 * [1] 섹션 이동 기능
 */
function showSection(type) {
    const subSections = document.querySelectorAll('.sub-section');
    subSections.forEach(sec => sec.classList.remove('active-section'));

    const mainVisual = document.getElementById('main-visual');
    if (type === 'main') {
        mainVisual.classList.remove('hidden');
    } else {
        mainVisual.classList.add('hidden');
        const targetSection = document.getElementById(type);
        if (targetSection) targetSection.classList.add('active-section');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * [2] 드롭다운 & 유틸
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
 * [3] 방명록
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
    const area = document.getElementById('msg-input-area');
    area.style.display = (area.style.display === 'block') ? 'none' : 'block';
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
    document.getElementById('page-num').innerText = `${currentPage} / ${total}`;
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
 * [4] 카드 뒤집기
 */
const card = document.getElementById('flip-card');
const cardBack = document.getElementById('card-back-side');
if (card) {
    let isFlipped = false;
    function flipAction() {
        isFlipped = !isFlipped;
        card.classList.add('paused'); 
        card.style.animation = 'none'; 
        card.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
        if(isFlipped && cardBack) cardBack.scrollTop = 0;
    }
    card.addEventListener('click', (e) => {
        if(e.target.closest('.copy-btn') || e.target.closest('.reg-btn')) return;
        flipAction();
    });
}

/**
 * [5] 또댕 발자취 슬라이더 로직
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

    container.addEventListener('scroll', () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const scrollPercent = container.scrollLeft / (maxScroll || 1);
        thumb.style.left = (scrollPercent * 50) + "%";
    });
}

/**
 * [6] 지도 탭 전환 기능
 */
function switchMap(type) {
    // 탭 버튼 활성화 상태 변경
    const tabs = document.querySelectorAll('.map-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // 클릭한 탭 활성화 (이벤트 타겟 찾기)
    if (type === 'daegu') tabs[0].classList.add('active');
    else tabs[1].classList.add('active');

    // 내용 변경
    const daeguInfo = document.getElementById('info-daegu');
    const seoulInfo = document.getElementById('info-seoul');

    if (type === 'daegu') {
        daeguInfo.classList.remove('hidden');
        seoulInfo.classList.add('hidden');
    } else {
        daeguInfo.classList.add('hidden');
        seoulInfo.classList.remove('hidden');
    }
}

window.addEventListener('load', () => {
    renderMessages();
    initDualSlider('container-row1', 'thumb-row1');
    initDualSlider('container-row2', 'thumb-row2');
});