// State Management
window.currentUser = null;
window.state = {
    transactions: [],
    assets: [],
    investments: [],
    debts: [],
    goals: [],
    house: {
        kprTarget: 0,
        dpTarget: 0,
        renovations: []
    },
    wedding: {
        budget: {
            venue: { name: '1. Venue & Makanan', estimasi: 20000000, realisasi: 0 },
            attire: { name: '2. Pakaian & Rias', estimasi: 10000000, realisasi: 0 },
            doc: { name: '3. Dokumentasi', estimasi: 5000000, realisasi: 0 },
            decor: { name: '4. Dekorasi', estimasi: 8000000, realisasi: 0 },
            other: { name: '5. Lain-lain', estimasi: 7000000, realisasi: 0 }
        },
        checklist: [],
        guests: [],
        vendors: [],
        kandidatVendors: [],
        seserahan: []
    }
};

window.saveData = async function() {
    if (window.currentUser) {
        try {
            await window.setDoc(window.doc(window.db, "users", window.currentUser.uid), window.state);
        } catch (e) { console.error("Error saving to Firestore", e); }
    }
    localStorage.setItem('fnd_state', JSON.stringify(window.state));
}

window.loadData = async function() {
    if (window.currentUser) {
        try {
            const docSnap = await window.getDoc(window.doc(window.db, "users", window.currentUser.uid));
            if (docSnap.exists()) {
                window.state = { ...window.state, ...docSnap.data() };
                
                // Compatibility for old marriedBudget state vs new wedding state
                if(!window.state.wedding && window.state.marriedBudget) {
                    window.state.wedding = {
                        budget: {
                            venue: { name: '1. Venue & Makanan', estimasi: window.state.marriedBudget.categories?.venue || 20000000, realisasi: 0 },
                            attire: { name: '2. Pakaian & Rias', estimasi: window.state.marriedBudget.categories?.attire || 10000000, realisasi: 0 },
                            doc: { name: '3. Dokumentasi', estimasi: window.state.marriedBudget.categories?.dokumentasi || 5000000, realisasi: 0 },
                            decor: { name: '4. Dekorasi', estimasi: 8000000, realisasi: 0 },
                            other: { name: '5. Lain-lain', estimasi: window.state.marriedBudget.categories?.lainnya || 7000000, realisasi: 0 }
                        },
                        checklist: [], guests: [], vendors: [], kandidatVendors: [], seserahan: []
                    };
                }

                // Default fallbacks if empty
                if(!window.state.wedding) window.state.wedding = {};
                if(!window.state.wedding.checklist) window.state.wedding.checklist = [];
                if(!window.state.wedding.guests) window.state.wedding.guests = [];
                if(!window.state.wedding.vendors) window.state.wedding.vendors = [];
                if(!window.state.wedding.kandidatVendors) window.state.wedding.kandidatVendors = [];
                if(!window.state.wedding.seserahan) window.state.wedding.seserahan = [];

                if (window.updateAllViews) window.updateAllViews();
                return;
            }
        } catch (e) { console.error("Error loading from Firestore", e); }
    }
    const local = localStorage.getItem('fnd_state');
    if (local) {
        window.state = { ...window.state, ...JSON.parse(local) };
        if(!window.state.wedding) window.state.wedding = {};
        if(!window.state.wedding.checklist) window.state.wedding.checklist = [];
        if(!window.state.wedding.guests) window.state.wedding.guests = [];
        if(!window.state.wedding.vendors) window.state.wedding.vendors = [];
        if(!window.state.wedding.kandidatVendors) window.state.wedding.kandidatVendors = [];
        if(!window.state.wedding.seserahan) window.state.wedding.seserahan = [];
    }
    if (window.updateAllViews) window.updateAllViews();
}
