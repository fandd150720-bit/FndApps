// Dashboard Logic
let dashChartInstance = null;

window.updateDashboard = function() {
    if (!window.state || !window.state.transactions) return;

    let totalIncome = 0;
    let totalExpense = 0;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    window.state.transactions.forEach(t => {
        const tDate = new Date(t.date);
        if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
            if (t.type === 'income') totalIncome += t.amount;
            else if (t.type === 'expense') totalExpense += t.amount;
        }
    });

    let totalCashflow = 0;
    window.state.transactions.forEach(t => {
        if (t.type === 'income') totalCashflow += t.amount;
        else if (t.type === 'expense') totalCashflow -= t.amount;
    });

    let totalAssets = 0;
    if (window.state.assets) {
        window.state.assets.forEach(a => totalAssets += a.value);
    }

    let totalInvestments = 0;
    if (window.state.investments) {
        window.state.investments.forEach(i => totalInvestments += i.amount);
    }
    
    let totalHutang = 0;
    let totalPiutang = 0;
    if (window.state.debts) {
        window.state.debts.forEach(d => {
            if (d.type === 'hutang') totalHutang += d.amount;
            else totalPiutang += d.amount;
        });
    }

    const assetsInv = totalAssets + totalInvestments;
    const netWorth = totalCashflow + assetsInv + totalPiutang - totalHutang;

    const netWorthEl = document.getElementById('dash-net-worth');
    if (netWorthEl) netWorthEl.innerText = window.formatIDR(netWorth);
    
    const incomeEl = document.getElementById('dash-income');
    if (incomeEl) incomeEl.innerText = window.formatIDR(totalIncome);
    
    const expenseEl = document.getElementById('dash-expense');
    if (expenseEl) expenseEl.innerText = window.formatIDR(totalExpense);
    
    const assetsInvEl = document.getElementById('dash-assets-inv');
    if (assetsInvEl) assetsInvEl.innerText = window.formatIDR(assetsInv);

    // Recent Transactions
    const recentList = document.getElementById('dash-recent');
    if (recentList) {
        recentList.innerHTML = '';
        const recent = window.state.transactions.slice(0, 5);
        
        if (recent.length === 0) {
            recentList.innerHTML = '<p class="text-slate-500 text-sm">Belum ada transaksi bulan ini.</p>';
        } else {
            recent.forEach(t => {
                const isIncome = t.type === 'income';
                recentList.innerHTML += `
                    <div class="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} flex items-center justify-center">
                                <i data-lucide="${isIncome ? 'arrow-down-left' : 'arrow-up-right'}" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="font-bold text-slate-800 text-sm">${t.category}</p>
                                <p class="text-xs text-slate-500">${new Date(t.date).toLocaleDateString('id-ID')}</p>
                            </div>
                        </div>
                        <span class="font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}">${isIncome ? '+' : '-'}${window.formatIDR(t.amount)}</span>
                    </div>
                `;
            });
        }
    }

    // Chart
    const canvasEl = document.getElementById('cashflowChart');
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (dashChartInstance) dashChartInstance.destroy();

    const last6Months = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last6Months.push(d.toLocaleString('default', { month: 'short' }));
        
        let inc = 0, exp = 0;
        window.state.transactions.forEach(t => {
            const tDate = new Date(t.date);
            if (tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear()) {
                if (t.type === 'income') inc += t.amount;
                else exp += t.amount;
            }
        });
        incomeData.push(inc);
        expenseData.push(exp);
    }

    dashChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last6Months,
            datasets: [
                { label: 'Pemasukan', data: incomeData, backgroundColor: '#10b981', borderRadius: 4 },
                { label: 'Pengeluaran', data: expenseData, backgroundColor: '#f43f5e', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true, ticks: { callback: function(val) { return 'Rp ' + (val/1000000) + 'Jt'; } } } }
        }
    });

    // Need to trigger lucide for the dynamically injected icons
    if (window.lucide) window.lucide.createIcons();
}


