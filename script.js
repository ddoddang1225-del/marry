// [1] 섹션 이동 기능
function showSection(type) {
    const sections = ['main-visual', 'info', 'story', 'congrat'];
    sections.forEach(s => {
        const el = document.getElementById(s);
        if (!el) return;
        if(s === 'main-visual') {
            type === 'main' ? el.style.display = 'flex' : el.style.display = 'none';
        } else {
            type === s ? el.classList.add('active-section') : el.classList.remove('active-section');
        }
    });
    window.scrollTo(0, 0);
}

// [2] 드롭다운 메뉴 제어
function toggleDropdown(event, dropId) {
    event.stopPropagation();
    const dropdown = document.getElementById(dropId);
    document.querySelectorAll('.dropdown-menu').forEach(d => { 
        if(d.id !== dropId) d.classList.remove('show'); 
    });
    dropdown.classList.toggle('show');
}

window.onclick = () => document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));

// [3] 계좌번호 복사 기능
function copyText(text) {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    alert("계좌번호가 복사되었습니다.");
}

// [4] 카드 뒤집기 및 모바일 스크롤 최적화
const card = document.getElementById('flip-card');
const cardBack = document.querySelector('.card-back');

if (card) {
    let isFlipped = false;

    function flipAction() {
        isFlipped = !isFlipped;
        card.style.transform = isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)';
        if(isFlipped) cardBack.scrollTop = 0;
    }

    card.addEventListener('click', (e) => {
        // 버튼 클릭 시에는 안 뒤집히게 방어
        if(e.target.closest('.copy-btn') || e.target.closest('.gift-link-btn') || e.target.closest('.msg-toggle-btn')) return;
        
        // 뒷면에서 스크롤 중일 때는 안 뒤집히게 방어
        if(isFlipped && cardBack.scrollTop > 15) return;
        
        flipAction();
    });

    // 모바일 터치 스크롤 간섭 해결
    let touchstartY = 0;
    card.addEventListener('touchstart', e => {
        touchstartY = e.touches[0].pageY;
    }, {passive: true});

    card.addEventListener('touchend', e => {
        let touchendY = e.changedTouches[0].pageY;
        // 30px 이상 위아래로 움직였다면 스크롤로 간주하여 뒤집기 취소
        if (Math.abs(touchstartY - touchendY) > 30) return;
    }, {passive: true});
}

// [5] 방명록 기능
let messages = [
    { name: "친구 지현", text: "결혼 진심으로 축하해! 행복하게 잘 살아!" },
    { name: "가족 성현", text: "두 사람의 앞날에 축복만 가득하길!" }
];

function renderMessages() {
    const wall = document.getElementById('message-wall');
    if(!wall) return;
    wall.innerHTML = "";
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'post-it';
        div.innerHTML = `<div>${msg.text}</div><div style="font-size:12px; color:#888; text-align:right;">From. ${msg.name}</div>`;
        wall.appendChild(div);
    });
}

function toggleMsgInput() {
    const area = document.getElementById('msg-input-area');
    area.style.display = area.style.display === 'block' ? 'none' : 'block';
}

function addMessage() {
    const name = document.getElementById('msg-name').value;
    const text = document.getElementById('msg-text').value;
    if (!name || !text) return alert("내용을 입력해주세요!");
    messages.unshift({ name, text });
    renderMessages();
    document.getElementById('msg-name').value = '';
    document.getElementById('msg-text').value = '';
    toggleMsgInput();
}

// [6] 갤러리 드래그 기능
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