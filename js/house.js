// --- HOUSE PLANNER LOGIC ---
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
    window.state.house.kprTarget = window.parseIDR(document.getElementById('hp-kpr-target').value);
    window.state.house.dpTarget = window.parseIDR(document.getElementById('hp-dp-target').value);
    window.saveData();
    window.updateHouseView();
    alert('Target House Planner berhasil disimpan!');
}

document.getElementById('reno-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reno-name').value;
    const est = window.parseIDR(document.getElementById('reno-est').value);
    const cost = window.parseIDR(document.getElementById('reno-cost').value);

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
    
    window.saveData();
    window.updateHouseView();
    window.updateDashboard();
    
    e.target.reset();
    document.getElementById('reno-modal')?.classList.add('hidden');
});

window.deleteReno = function(id) {
    if(confirm('Hapus rencana renovasi ini?')) {
        window.state.house.renovations = window.state.house.renovations.filter(r => r.id !== id);
        window.saveData();
        window.updateHouseView();
    }
}

window.updateHouseView = function() {
    try {
    // Guard: only update if on house page
    if (!document.getElementById('hp-kpr-paid')) return;

    // Populate Inputs
    const kprTargetEl = document.getElementById('hp-kpr-target');
    const dpTargetEl = document.getElementById('hp-dp-target');
    if (kprTargetEl) kprTargetEl.value = new Intl.NumberFormat('id-ID').format(window.state.house.kprTarget || 0);
    if (dpTargetEl) dpTargetEl.value = new Intl.NumberFormat('id-ID').format(window.state.house.dpTarget || 0);


    // Calculate actuals from transactions
    let kprPaid = 0;
    let dpPaid = 0;
    let utilPaid = 0;

    window.state.transactions.forEach(t => {
        if(t.type === 'expense') {
            const cat = t.category.toLowerCase();
            if (cat.includes('kpr') || cat.includes('angsuran rumah')) kprPaid += t.amount;
            if (cat.includes('dp rumah') || cat.includes('uang muka rumah')) dpPaid += t.amount;
            if (cat.includes('listrik') || cat.includes('air') || cat.includes('internet') || cat.includes('utilitas')) utilPaid += t.amount;
        }
    });

    // Overview Cards
    document.getElementById('hp-kpr-paid').innerText = window.formatIDR(kprPaid);
    document.getElementById('hp-dp-paid').innerText = window.formatIDR(dpPaid);
    document.getElementById('hp-util-paid').innerText = window.formatIDR(utilPaid);

    let kprPct = window.state.house.kprTarget > 0 ? (kprPaid / window.state.house.kprTarget) * 100 : 0;
    if(kprPct > 100) kprPct = 100;
    document.getElementById('hp-kpr-bar').style.width = kprPct + '%';
    document.getElementById('hp-kpr-pct').innerText = kprPct.toFixed(1) + '%';

    let dpPct = window.state.house.dpTarget > 0 ? (dpPaid / window.state.house.dpTarget) * 100 : 0;
    if(dpPct > 100) dpPct = 100;
    document.getElementById('hp-dp-bar').style.width = dpPct + '%';
    document.getElementById('hp-dp-pct').innerText = dpPct.toFixed(1) + '%';

    // Renovations
    const renoList = document.getElementById('reno-list');
    renoList.innerHTML = '';
    let totalRenoEst = 0;
    let totalRenoCost = 0;

    if (!window.state.house.renovations || window.state.house.renovations.length === 0) {
        renoList.innerHTML = '<tr><td colspan="4" class="px-4 py-6 text-center text-slate-500">Belum ada rencana perbaikan/renovasi.</td></tr>';
    } else {
        window.state.house.renovations.forEach(r => {
            totalRenoEst += r.est;
            totalRenoCost += r.cost;
            const status = r.cost >= r.est && r.est > 0 ? 'Selesai' : (r.cost > 0 ? 'Proses' : 'Rencana');
            const statusColor = status === 'Selesai' ? 'text-emerald-700 bg-emerald-100' : (status === 'Proses' ? 'text-amber-700 bg-amber-100' : 'text-slate-700 bg-slate-100');

            renoList.innerHTML += `
                <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td class="px-4 py-3 font-medium text-slate-800">${r.name}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-right text-slate-600">${window.formatIDR(r.est)}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-right font-bold text-rose-600">${window.formatIDR(r.cost)}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-center">
                        <span class="px-2.5 py-1 text-xs font-bold rounded-full ${statusColor}">${status}</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-right">
                        <button onclick="deleteReno('${r.id}')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    
    document.getElementById('reno-tot-est').innerText = window.formatIDR(totalRenoEst);
    document.getElementById('reno-tot-cost').innerText = window.formatIDR(totalRenoCost);

    if (window.lucide) window.lucide.createIcons();
}



