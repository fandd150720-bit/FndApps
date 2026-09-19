// Financial Sub-Nav Logic
window.switchFinTab = function(tabId) {
    // Map tab IDs to view/button IDs used in HTML
    const tabs = ['cashflow', 'assets', 'investments', 'debts'];

    tabs.forEach(id => {
        const view = document.getElementById(`view-${id}`);
        const btn  = document.getElementById(`tab-${id}`);
        if (view) { view.classList.add('hidden'); view.classList.remove('block'); }
        if (btn)  {
            btn.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
            btn.classList.add('text-slate-500');
        }
    });

    const activeView = document.getElementById(`view-${tabId}`);
    const activeBtn  = document.getElementById(`tab-${tabId}`);
    if (activeView) { activeView.classList.remove('hidden'); activeView.classList.add('block'); }
    if (activeBtn)  {
        activeBtn.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
        activeBtn.classList.remove('text-slate-500');
    }

    if (tabId === 'cashflow')    { if (window.updateFinancialTable) window.updateFinancialTable(); }
    if (tabId === 'assets')      { if (window.updateAssetsView) window.updateAssetsView(); }
    if (tabId === 'investments') { if (window.updateInvestmentsView) window.updateInvestmentsView(); }
    if (tabId === 'debts')       { if (window.updateDebtsView) window.updateDebtsView(); }
}

// --- FINANCIAL LOGIC: TRANSACTIONS ---
document.getElementById('transaction-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('trans-date').value;
    const type = document.getElementById('trans-type').value;
    const category = document.getElementById('trans-category').value;
    const amount = window.parseIDR(document.getElementById('trans-amount').value);

    window.state.transactions.push({
        id: window.generateId(), date, type, category, amount
    });
    
    window.state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    window.saveData();
    window.updateFinancialTable();
    window.updateDashboard();
    
    e.target.reset();
    document.getElementById('trans-date').valueAsDate = new Date();
    document.getElementById('trans-modal')?.classList.add('hidden');
});

window.deleteTransaction = function(id) {
    if(confirm('Hapus transaksi ini?')) {
        window.state.transactions = window.state.transactions.filter(t => t.id !== id);
        window.saveData();
        window.updateFinancialTable();
        window.updateDashboard();
    }
}

window.updateFinancialTable = function() {
    const tbody = document.getElementById('transaction-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const emptyState = document.getElementById('trans-empty-state');
    
    if (window.state.transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500">Belum ada data transaksi.</td></tr>';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    if (emptyState) emptyState.classList.add('hidden');

    window.state.transactions.forEach(t => {
        const isIncome = t.type === 'income';
        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                <td class="px-6 py-3 whitespace-nowrap text-sm text-slate-600">${new Date(t.date).toLocaleDateString('id-ID')}</td>
                <td class="px-6 py-3 text-sm font-medium text-slate-800">${t.category}</td>
                <td class="px-6 py-3 whitespace-nowrap text-right font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}">
                    <span class="px-2 py-0.5 text-xs font-bold rounded-full ${isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} mr-2">${isIncome ? 'Pemasukan' : 'Pengeluaran'}</span>
                    ${isIncome ? '+' : '-'}${window.formatIDR(t.amount)}
                </td>
                <td class="px-6 py-3 whitespace-nowrap text-center">
                    <button onclick="deleteTransaction('${t.id}')" class="text-slate-400 hover:text-rose-500 transition-colors p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </td>
            </tr>
        `;
    });
    if (window.lucide) window.lucide.createIcons();
}

// --- FINANCIAL LOGIC: ASSETS ---
document.getElementById('asset-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('asset-name').value;
    const value = window.parseIDR(document.getElementById('asset-value').value);

    window.state.assets.push({ id: window.generateId(), name, value });
    window.saveData();
    window.updateAssetsView();
    
    e.target.reset();
    document.getElementById('asset-modal')?.classList.add('hidden');
});

window.deleteAsset = function(id) {
    if(confirm('Hapus aset ini?')) {
        window.state.assets = window.state.assets.filter(a => a.id !== id);
        window.saveData();
        window.updateAssetsView();
    }
}

window.updateAssetsView = function() {
    const tbody = document.getElementById('asset-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    let total = 0;

    const emptyState = document.getElementById('asset-empty-state');

    if (window.state.assets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-8 text-center text-slate-500">Belum ada aset tercatat.</td></tr>';
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        window.state.assets.forEach(a => {
            total += a.value;
            tbody.innerHTML += `
                <tr class="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                    <td class="px-6 py-3 font-medium text-slate-800">${a.name}</td>
                    <td class="px-6 py-3 text-right font-bold text-emerald-600">${window.formatIDR(a.value)}</td>
                    <td class="px-6 py-3 text-center">
                        <button onclick="deleteAsset('${a.id}')" class="text-slate-400 hover:text-rose-500 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    const totalEl = document.getElementById('total-assets-val');
    if (totalEl) totalEl.innerText = window.formatIDR(total);
    if (window.lucide) window.lucide.createIcons();
}

// --- FINANCIAL LOGIC: INVESTMENTS ---
document.getElementById('invest-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name     = document.getElementById('inv-name').value;
    const platform = document.getElementById('inv-platform')?.value || '';
    const amount   = window.parseIDR(document.getElementById('inv-value').value);

    window.state.investments.push({ id: window.generateId(), name, platform, amount });
    window.saveData();
    window.updateInvestmentsView();
    
    e.target.reset();
});

window.deleteInvest = function(id) {
    if(confirm('Hapus investasi ini?')) {
        window.state.investments = window.state.investments.filter(i => i.id !== id);
        window.saveData();
        window.updateInvestmentsView();
    }
}

window.updateInvestmentsView = function() {
    const tbody = document.getElementById('inv-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    let total = 0;

    const emptyState = document.getElementById('inv-empty-state');

    if (window.state.investments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500">Belum ada portofolio investasi.</td></tr>';
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        window.state.investments.forEach(i => {
            total += i.amount;
            tbody.innerHTML += `
                <tr class="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                    <td class="px-6 py-3 font-medium text-slate-800">${i.name}</td>
                    <td class="px-6 py-3 text-sm text-slate-500">${i.platform || '-'}</td>
                    <td class="px-6 py-3 text-right font-bold text-blue-600">${window.formatIDR(i.amount)}</td>
                    <td class="px-6 py-3 text-center">
                        <button onclick="deleteInvest('${i.id}')" class="text-slate-400 hover:text-rose-500 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    const totalEl = document.getElementById('total-inv-val');
    if (totalEl) totalEl.innerText = window.formatIDR(total);
    if (window.lucide) window.lucide.createIcons();
}

// --- FINANCIAL LOGIC: DEBTS ---
document.getElementById('debt-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type   = document.getElementById('debt-type').value; // hutang atau piutang
    const name   = document.getElementById('debt-name').value;
    const amount = window.parseIDR(document.getElementById('debt-value').value);

    window.state.debts.push({ id: window.generateId(), type, name, amount, desc: '' });
    window.saveData();
    window.updateDebtsView();
    
    e.target.reset();
});

window.deleteDebt = function(id) {
    if(confirm('Hapus data ini?')) {
        window.state.debts = window.state.debts.filter(d => d.id !== id);
        window.saveData();
        window.updateDebtsView();
    }
}

window.updateDebtsView = function() {
    const tbody = document.getElementById('debt-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    let totalHutang = 0;
    let totalPiutang = 0;

    const emptyState = document.getElementById('debt-empty-state');

    if (window.state.debts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500">Belum ada catatan hutang/piutang.</td></tr>';
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        window.state.debts.forEach(d => {
            const isHutang = d.type === 'hutang';
            if (isHutang) totalHutang += d.amount;
            else totalPiutang += d.amount;

            tbody.innerHTML += `
                <tr class="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                    <td class="px-6 py-3">
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full ${isHutang ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'} uppercase">${d.type}</span>
                    </td>
                    <td class="px-6 py-3 font-medium text-slate-800">${d.name}</td>
                    <td class="px-6 py-3 text-right font-bold ${isHutang ? 'text-rose-600' : 'text-emerald-600'}">${window.formatIDR(d.amount)}</td>
                    <td class="px-6 py-3 text-center">
                        <button onclick="deleteDebt('${d.id}')" class="text-slate-400 hover:text-rose-500 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    const hutangEl  = document.getElementById('total-hutang-val');
    const piutangEl = document.getElementById('total-piutang-val');
    if (hutangEl)  hutangEl.innerText  = window.formatIDR(totalHutang);
    if (piutangEl) piutangEl.innerText = window.formatIDR(totalPiutang);
    if (window.lucide) window.lucide.createIcons();
}






