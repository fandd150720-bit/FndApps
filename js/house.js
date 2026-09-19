// --- HOUSE PLANNER LOGIC ---
window.switchHouseTab = function(tabId) {
    ['kpr', 'maintenance', 'utilities', 'loan'].forEach(id => {
        const view = document.getElementById(`view-house-${id}`);
        if (view) {
            view.classList.add('hidden');
            view.classList.remove('block');
        }
        
        const tab = document.getElementById(`tab-house-${id}`);
        if (tab) {
            tab.classList.remove('active');
        }
    });

    const targetView = document.getElementById(`view-house-${tabId}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('block');
    }
    
    const targetTab = document.getElementById(`tab-house-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
};

window.calcGeneralLoan = function() {
    const price = window.parseIDR(document.getElementById('loan-price')?.value || '0');
    const dp = window.parseIDR(document.getElementById('loan-dp')?.value || '0');
    const p = price - dp; // principal after DP
    const r = parseFloat(document.getElementById('loan-interest')?.value || 0) / 100 / 12;
    const n = parseInt(document.getElementById('loan-tenure')?.value || 0);

    const principalEl = document.getElementById('loan-result-principal');
    const installmentEl = document.getElementById('loan-result-installment');
    const totalEl = document.getElementById('loan-result-total-interest');

    if (principalEl) principalEl.innerText = window.formatIDR(p > 0 ? p : 0);

    if(p > 0 && r > 0 && n > 0) {
        const emi = p * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPay = emi * n;

        if (installmentEl) installmentEl.innerText = window.formatIDR(emi);
        if (totalEl) totalEl.innerText = window.formatIDR(totalPay);
    } else {
        if (installmentEl) installmentEl.innerText = 'Rp 0';
        if (totalEl) totalEl.innerText = 'Rp 0';
    }
}

window.saveHouseTargets = function() {
    window.state.house.kprTarget = window.parseIDR(document.getElementById('house-target-kpr')?.value || '0');
    window.state.house.dpTarget = window.parseIDR(document.getElementById('house-target-dp')?.value || '0');
    window.saveData(); if(window.showNotification) window.showNotification('Input berhasil disimpan');
    window.updateHouseView();
    alert('Target House Planner berhasil disimpan!');
}

document.getElementById('house-payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('hp-type').value;
    const amount = window.parseIDR(document.getElementById('hp-amount').value);
    const note = document.getElementById('hp-note').value;

    if (amount > 0) {
        window.state.transactions.push({
            id: window.generateId(),
            date: new Date().toISOString().split('T')[0],
            type: 'expense',
            category: type === 'KPR' ? `Angsuran Rumah: ${note}` : `DP Rumah: ${note}`,
            amount: amount,
            houseRef: type
        });
        window.state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        window.saveData(); if(window.showNotification) window.showNotification('Input berhasil disimpan');
        window.updateHouseView();
        window.updateDashboard();
        
        e.target.reset();
        alert('Pembayaran berhasil dicatat!');
    }
});

document.getElementById('utility-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('util-type').value;
    const amount = window.parseIDR(document.getElementById('util-amount').value);

    if (amount > 0) {
        window.state.transactions.push({
            id: window.generateId(),
            date: new Date().toISOString().split('T')[0],
            type: 'expense',
            category: `Utilitas: ${type}`,
            amount: amount,
            houseRef: 'Utilitas'
        });
        window.state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        window.saveData(); if(window.showNotification) window.showNotification('Input berhasil disimpan');
        window.updateHouseView();
        window.updateDashboard();
        
        e.target.reset();
        alert('Pembayaran utilitas berhasil dicatat!');
    }
});

document.getElementById('reno-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reno-name').value;
    const est = window.parseIDR(document.getElementById('reno-target').value);
    const cost = window.parseIDR(document.getElementById('reno-current').value);

    window.state.house.renovations = window.state.house.renovations || [];
    window.state.house.renovations.push({ id: window.generateId(), name, est, cost });
    
    // Automatically add to transactions if there's actual cost
    if (cost > 0) {
        window.state.transactions.push({
            id: window.generateId(),
            date: new Date().toISOString().split('T')[0],
            type: 'expense',
            category: `Renovasi: ${name}`,
            amount: cost,
            houseRef: 'Renovasi'
        });
        window.state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    window.saveData(); if(window.showNotification) window.showNotification('Input berhasil disimpan');
    window.updateHouseView();
    window.updateDashboard();
    
    e.target.reset();
    document.getElementById('reno-modal')?.classList.add('hidden');
});

window.deleteReno = function(id) {
    if(confirm('Hapus rencana renovasi ini?')) {
        window.state.house.renovations = window.state.house.renovations.filter(r => r.id !== id);
        window.saveData(); if(window.showNotification) window.showNotification('Input berhasil disimpan');
        window.updateHouseView();
    }
}

window.updateHouseView = function() {
    // Guard: only update if on house page
    if (!document.getElementById('hp-kpr-paid')) return;

    // Populate Inputs
    const kprTargetEl = document.getElementById('house-target-kpr');
    const dpTargetEl = document.getElementById('house-target-dp');
    if (kprTargetEl) kprTargetEl.value = new Intl.NumberFormat('id-ID').format(window.state.house.kprTarget || 0);
    if (dpTargetEl) dpTargetEl.value = new Intl.NumberFormat('id-ID').format(window.state.house.dpTarget || 0);

    // Calculate actuals from transactions
    let kprPaid = 0;
    let dpPaid = 0;
    let utilPaid = 0;

    const kprHistory = [];
    const utilHistory = [];

    window.state.transactions.forEach(t => {
        if(t.type === 'expense') {
            const cat = t.category.toLowerCase();
            if (cat.includes('kpr') || cat.includes('angsuran rumah')) {
                kprPaid += t.amount;
                kprHistory.push(t);
            }
            if (cat.includes('dp rumah') || cat.includes('uang muka rumah')) {
                dpPaid += t.amount;
                kprHistory.push(t);
            }
            if (cat.includes('listrik') || cat.includes('air') || cat.includes('internet') || cat.includes('utilitas') || cat.includes('ipl')) {
                utilPaid += t.amount;
                utilHistory.push(t);
            }
        }
    });

    // Overview Cards
    const kprPaidEl = document.getElementById('hp-kpr-paid');
    const dpPaidEl = document.getElementById('hp-dp-paid');
    
    if (kprPaidEl) kprPaidEl.innerText = window.formatIDR(kprPaid);
    if (dpPaidEl) dpPaidEl.innerText = window.formatIDR(dpPaid);

    const kprTotalEl = document.getElementById('hp-kpr-total');
    if (kprTotalEl) kprTotalEl.innerText = window.formatIDR(window.state.house.kprTarget || 0);
    const dpTotalEl = document.getElementById('hp-dp-total');
    if (dpTotalEl) dpTotalEl.innerText = window.formatIDR(window.state.house.dpTarget || 0);

    let kprPct = window.state.house.kprTarget > 0 ? (kprPaid / window.state.house.kprTarget) * 100 : 0;
    if(kprPct > 100) kprPct = 100;
    const kprBarEl = document.getElementById('hp-kpr-bar');
    const kprPctEl = document.getElementById('hp-kpr-pct');
    if (kprBarEl) kprBarEl.style.width = kprPct + '%';
    if (kprPctEl) kprPctEl.innerText = kprPct.toFixed(1) + '% Lunas';

    let dpPct = window.state.house.dpTarget > 0 ? (dpPaid / window.state.house.dpTarget) * 100 : 0;
    if(dpPct > 100) dpPct = 100;
    const dpBarEl = document.getElementById('hp-dp-bar');
    const dpPctEl = document.getElementById('hp-dp-pct');
    if (dpBarEl) dpBarEl.style.width = dpPct + '%';
    if (dpPctEl) dpPctEl.innerText = dpPct.toFixed(1) + '% Lunas';

    // KPR History Table
    const hpTable = document.getElementById('hp-payment-table');
    const hpEmpty = document.getElementById('hp-payment-empty');
    if (hpTable) {
        hpTable.innerHTML = '';
        if (kprHistory.length === 0) {
            if (hpEmpty) hpEmpty.classList.remove('hidden');
        } else {
            if (hpEmpty) hpEmpty.classList.add('hidden');
            kprHistory.forEach(t => {
                hpTable.innerHTML += `
                    <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-3 whitespace-nowrap text-slate-500">${t.date}</td>
                        <td class="px-6 py-3 whitespace-nowrap font-medium text-slate-800">${t.houseRef || (t.category.includes('DP') ? 'DP' : 'KPR')}</td>
                        <td class="px-6 py-3 font-medium text-slate-800">${t.category}</td>
                        <td class="px-6 py-3 whitespace-nowrap text-right font-bold text-slate-800">${window.formatIDR(t.amount)}</td>
                    </tr>
                `;
            });
        }
    }

    // Utilities Table
    const utilTable = document.getElementById('util-table-body');
    const utilEmpty = document.getElementById('util-empty-state');
    if (utilTable) {
        utilTable.innerHTML = '';
        if (utilHistory.length === 0) {
            if (utilEmpty) utilEmpty.classList.remove('hidden');
        } else {
            if (utilEmpty) utilEmpty.classList.add('hidden');
            utilHistory.forEach(t => {
                utilTable.innerHTML += `
                    <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-3 whitespace-nowrap text-slate-500">${t.date}</td>
                        <td class="px-6 py-3 font-medium text-slate-800">${t.category}</td>
                        <td class="px-6 py-3 whitespace-nowrap text-right font-bold text-slate-800">${window.formatIDR(t.amount)}</td>
                    </tr>
                `;
            });
        }
    }

    // Renovations
    const renoContainer = document.getElementById('renovation-container');
    const renoEmpty = document.getElementById('renovation-empty');
    if (renoContainer) {
        renoContainer.innerHTML = '';
        
        if (!window.state.house.renovations || window.state.house.renovations.length === 0) {
            if (renoEmpty) renoEmpty.classList.remove('hidden');
            renoContainer.classList.add('hidden');
        } else {
            if (renoEmpty) renoEmpty.classList.add('hidden');
            renoContainer.classList.remove('hidden');
            
            window.state.house.renovations.forEach(r => {
                const status = r.cost >= r.est && r.est > 0 ? 'Selesai' : (r.cost > 0 ? 'Proses' : 'Rencana');
                const statusColor = status === 'Selesai' ? 'text-emerald-700 bg-emerald-100' : (status === 'Proses' ? 'text-amber-700 bg-amber-100' : 'text-slate-700 bg-slate-100');
                const pct = r.est > 0 ? Math.min((r.cost/r.est)*100, 100) : 0;
                
                renoContainer.innerHTML += `
                    <div class="card p-6 border border-slate-100 relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start mb-4">
                                <h4 class="font-bold text-slate-900">${r.name}</h4>
                                <button onclick="deleteReno('${r.id}')" class="text-slate-400 hover:text-rose-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </div>
                            <div class="space-y-3 mb-6">
                                <div class="flex justify-between items-end">
                                    <p class="text-xs text-slate-500 font-medium">Estimasi Biaya</p>
                                    <p class="font-bold text-slate-700">${window.formatIDR(r.est)}</p>
                                </div>
                                <div class="flex justify-between items-end">
                                    <p class="text-xs text-slate-500 font-medium">Terkumpul</p>
                                    <p class="font-bold text-blue-600">${window.formatIDR(r.cost)}</p>
                                </div>
                                <div class="w-full bg-slate-100 rounded-full h-2 mt-2">
                                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${pct}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-auto">
                            <span class="inline-block px-2.5 py-1 text-xs font-bold rounded-full ${statusColor}">${status}</span>
                        </div>
                    </div>
                `;
            });
        }
    }

    if (window.lucide) window.lucide.createIcons();
}

