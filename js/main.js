// Global Update & Initialization
window.updateAllViews = function() {
    const fns = [
        'updateDashboard', 'updateFinancialTable', 'updateAssetsView',
        'updateInvestmentsView', 'updateDebtsView', 'updateHouseView',
        'updateWeddingDashboard', 'initWeddingPlannerUI', 'updateGoalsView'
    ];
    fns.forEach(fn => {
        try { if (window[fn]) window[fn](); } catch(e) { console.warn(fn + ' error:', e.message); }
    });
    if (window.lucide) window.lucide.createIcons();
}

// Setup Init Defaults
const transDateElem = document.getElementById('trans-date');
if (transDateElem) transDateElem.valueAsDate = new Date();

const goalDateElem = document.getElementById('goal-date');
if (goalDateElem) goalDateElem.valueAsDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

// Auth - Firebase Compat is sync so auth is always ready here
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        window.auth.signInWithPopup(window.provider)
            .catch(error => alert("Login gagal: " + error.message));
    });
}

window.auth.onAuthStateChanged((user) => {
    if (user) {
        window.currentUser = user;
        document.getElementById('login-screen').classList.add('hidden');
        const nameEl = document.getElementById('user-profile-name');
        if (nameEl) nameEl.innerText = user.displayName;

        const profileImg = document.getElementById('user-profile-img');
        if (profileImg) {
            profileImg.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=0D8ABC&color=fff`;
        }

        if (window.loadData) window.loadData();
    } else {
        window.currentUser = null;
        document.getElementById('login-screen').classList.remove('hidden');

        // Reset state on logout
        window.state = {
            transactions: [], assets: [], investments: [], debts: [], goals: [],
            house: { kprTarget: 0, dpTarget: 0, renovations: [] },
            wedding: {
                budget: {
                    venue: { name: '1. Venue & Makanan', estimasi: 20000000, realisasi: 0 },
                    attire: { name: '2. Pakaian & Rias', estimasi: 10000000, realisasi: 0 },
                    doc: { name: '3. Dokumentasi', estimasi: 5000000, realisasi: 0 },
                    decor: { name: '4. Dekorasi', estimasi: 8000000, realisasi: 0 },
                    other: { name: '5. Lain-lain', estimasi: 7000000, realisasi: 0 }
                },
                checklist: [], guests: [], vendors: [], kandidatVendors: [], seserahan: []
            }
        };
        if (window.updateAllViews) window.updateAllViews();
    }
});
// Theme Toggle
window.toggleTheme = function() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if(themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if(themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    }
    if(window.lucide) window.lucide.createIcons();
};

// Initialize Theme
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    const themeIcon = document.getElementById('theme-icon');
    if(themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
} else {
    document.documentElement.classList.remove('dark');
}

// Notifications
window.showNotification = function(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'bg-white dark:bg-[#111C44] border-l-4 border-[#05CD99] shadow-lg rounded-lg p-4 mb-2 flex items-center justify-between text-[#2B3674] dark:text-white transition-all duration-300 transform translate-x-full';
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#05CD99]/10 flex items-center justify-center text-[#05CD99]">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
            </div>
            <p class="font-medium text-sm">${message}</p>
        </div>
    `;
    
    container.appendChild(toast);
    if(window.lucide) window.lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // Show bell badge
    const badge = document.getElementById('bell-badge');
    if (badge) badge.classList.remove('hidden');
    
    // Animate out after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

window.clearNotificationBadge = function() {
    const badge = document.getElementById('bell-badge');
    if (badge) badge.classList.add('hidden');
};

window.showSystemUpdate = function() {
    // Show a notification for system update
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'bg-white dark:bg-[#111C44] border-l-4 border-[#4318FF] shadow-lg rounded-lg p-4 mb-2 flex items-center justify-between text-[#2B3674] dark:text-white transition-all duration-300 transform translate-x-full';
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#4318FF]/10 flex items-center justify-center text-[#4318FF]">
                <i data-lucide="info" class="w-5 h-5"></i>
            </div>
            <div>
                <p class="font-bold text-sm">Update Sistem Tersedia</p>
                <p class="text-xs text-[#A3AED0]">Versi terbaru telah diterapkan dengan perbaikan bug dan dark mode.</p>
            </div>
        </div>
        <button onclick="this.parentElement.remove()" class="text-[#A3AED0] hover:text-[#EE5D50]"><i data-lucide="x" class="w-4 h-4"></i></button>
    `;
    
    container.appendChild(toast);
    if(window.lucide) window.lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // Does not auto-close so the user can read it.
};
