// Financial Sub-Nav Logic
window.switchFinTab = function(tabId) {
    ['transaksi', 'aset', 'investasi', 'hutang'].forEach(id => {
        document.getElementById(`fin-${id}`).classList.add('hidden');
        document.getElementById(`tab-fin-${id}`).classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        document.getElementById(`tab-fin-${id}`).classList.add('text-slate-600', 'hover:bg-slate-200');
    });

    document.getElementById(`fin-${tabId}`).classList.remove('hidden');
    document.getElementById(`tab-fin-${tabId}`).classList.add('bg-blue-600', 'text-white', 'shadow-md');
    document.getElementById(`tab-fin-${tabId}`).classList.remove('text-slate-600', 'hover:bg-slate-200');

    if(tabId === 'transaksi') updateFinancialTable();
    if(tabId === 'aset') updateAssetsView();
    if(tabId === 'investasi') updateInvestmentsView();
    if(tabId === 'hutang') updateDebtsView();
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
    const tbody = document.getElementById('financial-tbody');
    tbody.innerHTML = '';
    
    if (window.state.transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500">Belum ada data transaksi.</td></tr>';
        return;
    }

    window.state.transactions.forEach(t => {
        const isIncome = t.type === 'income';
        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-600">${new Date(t.date).toLocaleDateString('id-ID')}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2.5 py-1 text-xs font-bold rounded-full ${isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
                        ${isIncome ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm font-medium text-slate-800">${t.category}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}">
                    ${isIncome ? '+' : '-'}${window.formatIDR(t.amount)}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right">
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
    const list = document.getElementById('assets-list');
    list.innerHTML = '';
    let total = 0;

    if (window.state.assets.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-sm">Belum ada data aset.</p>';
    } else {
        window.state.assets.forEach(a => {
            total += a.value;
            list.innerHTML += `
                <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                        <p class="font-bold text-slate-800">${a.name}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="font-bold text-blue-600">${window.formatIDR(a.value)}</span>
                        <button onclick="deleteAsset('${a.id}')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('asset-total').innerText = window.formatIDR(total);
    if (window.lucide) window.lucide.createIcons();
}

// --- FINANCIAL LOGIC: INVESTMENTS ---
document.getElementById('invest-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('invest-name').value;
    const amount = window.parseIDR(document.getElementById('invest-amount').value);
    const returnRate = parseFloat(document.getElementById('invest-return').value);

    window.state.investments.push({ id: window.generateId(), name, amount, returnRate });
    window.saveData();
    window.updateInvestmentsView();
    
    e.target.reset();
    document.getElementById('invest-modal')?.classList.add('hidden');
});

window.deleteInvest = function(id) {
    if(confirm('Hapus investasi ini?')) {
        window.state.investments = window.state.investments.filter(i => i.id !== id);
        window.saveData();
        window.updateInvestmentsView();
    }
}

window.updateInvestmentsView = function() {
    const list = document.getElementById('invest-list');
    list.innerHTML = '';
    let total = 0;

    if (window.state.investments.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-sm">Belum ada data investasi.</p>';
    } else {
        window.state.investments.forEach(i => {
            total += i.amount;
            list.innerHTML += `
                <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                        <p class="font-bold text-slate-800">${i.name}</p>
                        <p class="text-xs text-emerald-600 font-medium">Return Est: ${i.returnRate}%</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="font-bold text-blue-600">${window.formatIDR(i.amount)}</span>
                        <button onclick="deleteInvest('${i.id}')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('invest-total').innerText = window.formatIDR(total);
    if (window.lucide) window.lucide.createIcons();
}

// --- FINANCIAL LOGIC: DEBTS ---
document.getElementById('debt-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('debt-type').value; // hutang atau piutang
    const name = document.getElementById('debt-name').value;
    const amount = window.parseIDR(document.getElementById('debt-amount').value);
    const desc = document.getElementById('debt-desc').value;

    window.state.debts.push({ id: window.generateId(), type, name, amount, desc });
    window.saveData();
    window.updateDebtsView();
    
    e.target.reset();
    document.getElementById('debt-modal')?.classList.add('hidden');
});

window.deleteDebt = function(id) {
    if(confirm('Hapus data ini?')) {
        window.state.debts = window.state.debts.filter(d => d.id !== id);
        window.saveData();
        window.updateDebtsView();
    }
}

window.updateDebtsView = function() {
    const list = document.getElementById('debt-list');
    list.innerHTML = '';
    let totalHutang = 0;
    let totalPiutang = 0;

    if (window.state.debts.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-sm">Belum ada data hutang/piutang.</p>';
    } else {
        window.state.debts.forEach(d => {
            const isHutang = d.type === 'hutang';
            if(isHutang) totalHutang += d.amount;
            else totalPiutang += d.amount;

            list.innerHTML += `
                <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 border-l-4 ${isHutang ? 'border-l-rose-500' : 'border-l-emerald-500'}">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${isHutang ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'} uppercase">${d.type}</span>
                            <p class="font-bold text-slate-800">${d.name}</p>
                        </div>
                        <p class="text-xs text-slate-500 mt-1">${d.desc}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="font-bold ${isHutang ? 'text-rose-600' : 'text-emerald-600'}">${window.formatIDR(d.amount)}</span>
                        <button onclick="deleteDebt('${d.id}')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('debt-hutang-total').innerText = window.formatIDR(totalHutang);
    document.getElementById('debt-piutang-total').innerText = window.formatIDR(totalPiutang);
    if (window.lucide) window.lucide.createIcons();
}


