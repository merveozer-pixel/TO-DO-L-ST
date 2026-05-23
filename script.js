/**
 * Merve Lifestyle Planner - JavaScript Logic
 * Modern ve optimize edilmiş versiyon
 */

// --- VERİ MODELİ ---
const defaultData = {
    'Yapılacaklar': [{ id: 1, text: 'Yeni planlar oluştur', done: false }],
    'Yazılım': [{ id: 2, text: 'Flutter UI Tasarımı', done: true }, { id: 3, text: 'Dart Listeleri Çalış', done: false }],
    'Ders': [{ id: 4, text: 'Vize konularını bitir', done: false }],
    'Okuma': [{ id: 5, text: 'Atomik Alışkanlıklar', done: false }],
    'Sanat': [{ id: 6, text: 'Karakalem çalışması', done: false }],
    'Spor': [{ id: 7, text: '30 dk Kardiyo', done: false }]
};

const icons = { 
    'Yapılacaklar': '🎯', 
    'Yazılım': '💻', 
    'Ders': '✍️', 
    'Okuma': '📚', 
    'Sanat': '🎨', 
    'Spor': '💪' 
};

// Veriyi yerel depolamadan çek veya varsayılanı yükle
let appData = JSON.parse(localStorage.getItem('merveProData')) || defaultData;
let activeCat = '';

// --- TEMEL FONKSİYONLAR ---

/**
 * Ana ekranı ve yan menüyü günceller
 */
function init() {
    const grid = document.getElementById('categoriesGrid');
    const menu = document.getElementById('menuItems');
    
    if (!grid || !menu) return;

    grid.innerHTML = '';
    menu.innerHTML = '';

    Object.keys(appData).forEach(cat => {
        const total = appData[cat].length;
        const done = appData[cat].filter(t => t.done).length;
        
        // Ana Ekran Kartları
        grid.innerHTML += `
            <div class="cat-card" onclick="openCategory('${cat}')">
                <span style="font-size:32px; display:block; margin-bottom:12px;">${icons[cat]}</span>
                <h3>${cat}</h3>
                <p style="font-size:12px; color:#999; margin-top:5px; font-weight:600;">${done}/${total} Tamamlandı</p>
            </div>`;
        
        // Yan Menü Öğeleri (CSS'deki alt çizgi animasyonu için .menu-text eklendi)
        menu.innerHTML += `
            <div class="menu-item" onclick="toggleMenu(); openCategory('${cat}')">
                <span>${icons[cat]}</span>
                <span class="menu-text" style="margin-left:10px;">${cat}</span>
            </div>`;
    });

    // Veriyi kalıcı hale getir
    localStorage.setItem('merveProData', JSON.stringify(appData));
    updateGlobalStats();
}

/**
 * Üst kısımdaki genel istatistiği günceller
 */
function updateGlobalStats() {
    const totalTasks = Object.values(appData).flat().length;
    const completedTasks = Object.values(appData).flat().filter(t => t.done).length;
    const statsEl = document.getElementById('totalStats');
    if (statsEl) {
        statsEl.innerText = `Bugün ${totalTasks} görevden ${completedTasks} tanesini bitirdin!`;
    }
}

/**
 * Kategori detay ekranını açar
 */
function openCategory(cat) {
    activeCat = cat;
    document.getElementById('categoryName').innerText = cat;
    document.getElementById('detailCatTitle').innerText = cat;
    renderTasks();
    document.querySelector('.wrapper').classList.add('show-detail');
}

/**
 * Seçili kategorideki görevleri listeler
 */
function renderTasks() {
    const list = document.getElementById('taskList');
    if (!list) return;

    list.innerHTML = '';
    const currentTasks = appData[activeCat] || [];
    
    if (currentTasks.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; color:#ccc; margin-top:50px;">
                <p>☕</p>
                <p>Burada henüz bir şey yok.</p>
            </div>`;
    }

    currentTasks.forEach(task => {
        list.innerHTML += `
            <div class="task-item ${task.done ? 'done' : ''}">
                <div style="display:flex; align-items:center; gap:12px; flex:1; cursor:pointer;" onclick="toggleTask(${task.id})">
                    <div class="circle-check">${task.done ? '✓' : ''}</div>
                    <span>${task.text}</span>
                </div>
                <div onclick="deleteTask(${task.id})" style="color:#ff4757; cursor:pointer; font-size:24px; padding:0 10px; font-weight:bold;">×</div>
            </div>`;
    });

    document.getElementById('taskCount').innerText = `${currentTasks.length} Görev`;
}

// --- AKSİYONLAR VE MODAL ---

function openAddTaskModal() {
    // Eğer kategori seçili değilse varsayılan olarak 'Yapılacaklar'ı seç
    if (!activeCat) activeCat = 'Yapılacaklar';

    const modal = document.getElementById('addTaskModal');
    const overlay = document.getElementById('modalOverlay');
    const fab = document.getElementById('mainFab');
    const input = document.getElementById('taskInput');

    const isActive = modal.classList.toggle('active');
    overlay.classList.toggle('active');
    fab.classList.toggle('active');

    if (isActive) {
        input.focus();
    } else {
        input.value = '';
    }
}

function saveNewTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (!text) return;

    appData[activeCat].push({ 
        id: Date.now(), 
        text: text, 
        done: false 
    });

    input.value = '';
    openAddTaskModal(); // Modalı kapatır
    renderTasks();
    init(); // Ana ekrandaki sayıları güncellemek için
}

function toggleTask(id) {
    const task = appData[activeCat].find(t => t.id === id);
    if (task) task.done = !task.done;
    renderTasks();
    init();
}

function deleteTask(id) {
    appData[activeCat] = appData[activeCat].filter(t => t.id !== id);
    renderTasks();
    init();
}

// --- YARDIMCI NAVİGASYON ---

function toggleMenu() { 
    document.getElementById('sideMenu').classList.toggle('active'); 
}

function closeCategory() { 
    document.querySelector('.wrapper').classList.remove('show-detail'); 
    activeCat = ''; 
    init(); // Geri dönerken sayıları tazele
}

// Enter tuşu dinleyicisi
document.getElementById('taskInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveNewTask();
});

// Uygulamayı Başlat
init();