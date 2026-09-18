// Global Update & Initialization
window.updateAllViews = function() {
    window.updateDashboard();
    window.updateFinancialTable();
    window.updateAssetsView();
    window.updateInvestmentsView();
    window.updateDebtsView();
    window.updateHouseView();
    window.updateWeddingDashboard();
    window.updateGoalsView();
    if (window.lucide) window.lucide.createIcons();
}

// Ensure DOM is fully loaded before hooking up listeners
document.addEventListener('DOMContentLoaded', () => {
    // Setup Init Defaults
    const transDateElem = document.getElementById('trans-date');
    if (transDateElem) transDateElem.valueAsDate = new Date();
    
    const goalDateElem = document.getElementById('goal-date');
    if (goalDateElem) goalDateElem.valueAsDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    
    if (window.calcGeneralLoan) window.calcGeneralLoan();

    // Auth Listeners
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (window.signInWithPopup && window.auth && window.provider) {
                window.signInWithPopup(window.auth, window.provider).catch(error => alert("Login gagal: " + error.message));
            } else {
                console.error("Firebase auth not initialized yet.");
            }
        });
    }

    if (window.onAuthStateChanged && window.auth) {
        window.onAuthStateChanged(window.auth, (user) => {
            if (user) {
                window.currentUser = user;
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('user-profile-name').innerText = user.displayName;
                
                const profileImg = document.getElementById('user-profile-img');
                if (profileImg) {
                    profileImg.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=0D8ABC&color=fff`;
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
                window.updateAllViews();
            }
        });
    }
});
