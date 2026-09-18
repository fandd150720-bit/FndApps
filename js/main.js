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
