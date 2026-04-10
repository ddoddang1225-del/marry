// 섹션 이동 기능
function showSection(type) {
    const sections = ['main-visual', 'info', 'story', 'congrat'];
    sections.forEach(s => {
        const el = document.getElementById(s);
        if(s === 'main-visual') {
            type === 'main' ? el.classList.remove('hidden') : el.classList.add('hidden');
        } else {
            type.startsWith(s) ? el.classList.add('active-section') : el.classList.remove('active-section');
        }
    });
    window.scrollTo(0, 0);
}

// 드롭다운 메뉴 제어
function toggleDropdown(event, dropId) {
    event.stopPropagation();
    const dropdown = document.getElementById(dropId);
    document.querySelectorAll('.dropdown-menu').forEach(d => { 
        if(d.id !== dropId) d.classList.remove('show'); 
    });
    dropdown.classList.toggle('show');
}

window.onclick = () => document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));

// 계좌번호 복사
function copyText(text) {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    alert("계좌번호가 복사되었습니다.");
}

// 방명록 데이터 및 기능
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

// 카드 뒤집기 애니메이션 제어
const card = document.getElementById('flip-card');
const cardBack = document.getElementById('card-back-side');

if (card) {
    let isFlipped = false;
    let autoTimer;

    function flipAction() {
        isFlipped = !isFlipped;
        card.style.animation = 'none'; 
        card.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
        if(isFlipped) cardBack.scrollTop = 0;
        resetAutoTimer(); 
    }

    function resetAutoTimer() {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(() => {
            if(!card.classList.contains('paused')) {
                isFlipped = !isFlipped;
                card.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
                if(isFlipped) cardBack.scrollTop = 0;
            }
            resetAutoTimer(); 
        }, 20000); 
    }

    card.addEventListener('click', (e) => {
        if(e.target.closest('.copy-btn') || e.target.closest('.msg-toggle-btn')) return;
        if(isFlipped && cardBack.scrollTop > 10) return;
        card.classList.add('paused');
        flipAction();
    });

    let touchstartX = 0;
    card.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        card.classList.add('paused'); 
    }, {passive: true});

    card.addEventListener('touchend', e => {
        if(e.target.closest('.copy-btn') || e.target.closest('.msg-toggle-btn')) return;
        let endX = e.changedTouches[0].screenX;
        if (Math.abs(endX - touchstartX) > 50) flipAction();
    }, {passive: true});

    resetAutoTimer();
}

// 갤러리 드래그 기능
const sliders = document.querySelectorAll('.draggable');
sliders.forEach(slider => {
    let isDown = false; let startX; let scrollLeft;
    slider.addEventListener('mousedown', e => {
        isDown = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => isDown = false);
    slider.addEventListener('mouseup', () => isDown = false);
    slider.addEventListener('mousemove', e => {
        if (!isDown) return;
        const x = e.pageX - slider.offsetLeft;
        slider.scrollLeft = scrollLeft - (x - startX) * 2;
    });
});

window.onload = renderMessages;