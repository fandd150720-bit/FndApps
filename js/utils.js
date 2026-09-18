// Utilities
window.formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

window.parseIDR = (str) => {
    if (!str) return 0;
    return Number(String(str).replace(/[^0-9,-]+/g, "").replace(',', '.'));
};

window.formatCurrencyInput = (input) => {
    let val = input.value.replace(/[^0-9]/g, '');
    if (val) {
        input.value = new Intl.NumberFormat('id-ID').format(val);
    } else {
        input.value = '';
    }
};

window.generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Navigation: uses data-target on <a> tags and section-view + active class
window.switchView = function(viewId) {
    // Hide all sections
    document.querySelectorAll('.section-view').forEach(sec => {
        sec.classList.remove('active');
    });

    // Deactivate all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show target section
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');

    // Activate nav item with matching data-target
    const navItem = document.querySelector(`.nav-item[data-target="${viewId}"]`);
    if (navItem) navItem.classList.add('active');

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');

    // Trigger specific view updates (wrapped in try-catch for safety)
    try {
        if (viewId === 'dashboard' && window.updateDashboard) window.updateDashboard();
        if (viewId === 'financial' && window.updateFinancialTable) window.updateFinancialTable();
        if (viewId === 'house' && window.updateHouseView) window.updateHouseView();
        if (viewId === 'married' && window.updateWeddingDashboard) window.updateWeddingDashboard();
        if (viewId === 'goals' && window.updateGoalsView) window.updateGoalsView();
    } catch(e) { console.warn('View update error:', e.message); }
}

window.logout = function() {
    if (window.auth) window.auth.signOut();
}

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }
    if (overlay) {
        overlay.classList.toggle('hidden');
    }
}

// Setup nav click listeners once DOM is ready
document.querySelectorAll('.nav-item[data-target]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-target');
        if (target) window.switchView(target);
    });
});
