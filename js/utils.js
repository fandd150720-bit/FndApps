// Utilities
window.formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

window.parseIDR = (str) => {
    return Number(str.replace(/[^0-9,-]+/g, ""));
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

window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

window.switchView = function(viewId) {
    ['dashboard', 'financial', 'house', 'wedding', 'goals'].forEach(id => {
        document.getElementById(`view-${id}`).classList.add('hidden');
        document.getElementById(`tab-${id}`).classList.remove('bg-blue-50', 'text-blue-700');
        document.getElementById(`tab-${id}`).classList.add('text-slate-600', 'hover:bg-slate-50');
        
        document.getElementById(`mob-tab-${id}`).classList.remove('bg-blue-50', 'text-blue-700');
        document.getElementById(`mob-tab-${id}`).classList.add('text-slate-600');
    });

    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    
    document.getElementById(`tab-${viewId}`).classList.add('bg-blue-50', 'text-blue-700');
    document.getElementById(`tab-${viewId}`).classList.remove('text-slate-600', 'hover:bg-slate-50');
    
    document.getElementById(`mob-tab-${viewId}`).classList.add('bg-blue-50', 'text-blue-700');
    document.getElementById(`mob-tab-${viewId}`).classList.remove('text-slate-600');

    document.getElementById('mobile-menu').classList.add('hidden');
    
    // Trigger specific view updates
    if (viewId === 'dashboard') updateDashboard();
    if (viewId === 'financial') updateFinancialTable();
    if (viewId === 'house') updateHouseView();
    if (viewId === 'wedding') updateWeddingDashboard();
    if (viewId === 'goals') updateGoalsView();
}
