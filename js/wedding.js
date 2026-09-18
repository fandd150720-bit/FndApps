// --- WEDDING PLANNER LOGIC ---
let wedChartInstance = null;

window.switchWedTab = function(tabId) {
    ['dashboard', 'checklist', 'tamu', 'vendor', 'seserahan', 'anggaran'].forEach(id => {
        document.getElementById(`view-wed-${id}`).classList.add('hidden');
        document.getElementById(`view-wed-${id}`).classList.remove('block');
        
        const el = document.getElementById(`tab-wed-${id}`);
        el.classList.remove('bg-blue-50', 'text-blue-700', 'border-b-2', 'border-blue-600');
        el.classList.add('text-slate-500');
    });
    
    document.getElementById(`view-wed-${tabId}`).classList.remove('hidden');
    document.getElementById(`view-wed-${tabId}`).classList.add('block');
    
    const btn = document.getElementById(`tab-wed-${tabId}`);
    btn.classList.remove('text-slate-500');
    btn.classList.add('bg-blue-50', 'text-blue-700', 'border-b-2', 'border-blue-600');
    
    if(tabId === 'dashboard') {
        window.updateWeddingDashboard();
    }
}

window.initWeddingPlannerUI = function() {
    window.renderWedChecklist();
    window.renderWedTamu();
    window.renderWedVendors();
    window.renderWedSeserahan();
    window.renderWedAnggaranForm();
    window.updateWeddingDashboard();
}

window.updateWeddingDashboard = function() {
    let totalEst = 0;
    let totalReal = 0;
    const labels = [];
    const dataEst = [];
    const dataReal = [];
    
    const tbody = document.getElementById('wed-dash-budget-tbody');
    tbody.innerHTML = '';
    
    for (const key in window.state.wedding.budget) {
        const cat = window.state.wedding.budget[key];
        totalEst += cat.estimasi;
        totalReal += cat.realisasi;
        
        labels.push(cat.name.split('.')[1].trim().split(' ')[0]);
        dataEst.push(cat.estimasi);
        dataReal.push(cat.realisasi);
        
        const selisih = cat.estimasi - cat.realisasi;
        tbody.innerHTML += `
            <tr>
                <td class="px-2 py-2 border border-slate-200">${cat.name}</td>
                <td class="px-2 py-2 border border-slate-200 text-right">${window.formatIDR(cat.estimasi)}</td>
                <td class="px-2 py-2 border border-slate-200 text-right">${window.formatIDR(cat.realisasi)}</td>
                <td class="px-2 py-2 border border-slate-200 text-right ${selisih >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-medium">${window.formatIDR(selisih)}</td>
            </tr>
        `;
    }
    
    const totalSelisih = totalEst - totalReal;
    document.getElementById('wed-dash-tot-est').innerText = window.formatIDR(totalEst);
    document.getElementById('wed-dash-tot-real').innerText = window.formatIDR(totalReal);
    document.getElementById('wed-dash-tot-selisih').innerText = window.formatIDR(totalSelisih);
    document.getElementById('wed-dash-tot-selisih').className = `px-4 py-2 border border-slate-200 font-bold ${totalSelisih >= 0 ? 'text-emerald-600' : 'text-rose-600'}`;
    document.getElementById('wed-dash-tot-bayar').innerText = window.formatIDR(totalReal);
    document.getElementById('wed-dash-tot-sisa').innerText = window.formatIDR(totalEst - totalReal > 0 ? totalEst - totalReal : 0);
    
    document.getElementById('wed-dash-budget-tot-est').innerText = window.formatIDR(totalEst);
    document.getElementById('wed-dash-budget-tot-real').innerText = window.formatIDR(totalReal);
    document.getElementById('wed-dash-budget-tot-selisih').innerText = window.formatIDR(totalSelisih);
    
    // Checklist
    const chkDone = window.state.wedding.checklist.filter(c => c.status === 'Done').length;
    const chkProg = window.state.wedding.checklist.filter(c => c.status === 'In Progress').length;
    const chkNot = window.state.wedding.checklist.filter(c => c.status === 'Not Started').length;
    const chkTot = window.state.wedding.checklist.length;
    
    document.getElementById('wed-chk-done').innerText = chkDone;
    document.getElementById('wed-chk-prog').innerText = chkProg;
    document.getElementById('wed-chk-not').innerText = chkNot;
    document.getElementById('wed-chk-tot').innerText = chkTot;
    
    document.getElementById('wed-chk-done-pct').innerText = chkTot > 0 ? (chkDone/chkTot*100).toFixed(1) + '%' : '0.0%';
    document.getElementById('wed-chk-prog-pct').innerText = chkTot > 0 ? (chkProg/chkTot*100).toFixed(1) + '%' : '0.0%';
    document.getElementById('wed-chk-not-pct').innerText = chkTot > 0 ? (chkNot/chkTot*100).toFixed(1) + '%' : '0.0%';
    
    // Guests
    const guestHadir = window.state.wedding.guests.filter(g => g.status === 'Hadir').length;
    const guestTidak = window.state.wedding.guests.filter(g => g.status === 'Tidak Hadir').length;
    const guestBelum = window.state.wedding.guests.filter(g => g.status === 'Belum Konfirmasi').length;
    const guestTot = window.state.wedding.guests.length;
    
    document.getElementById('wed-guest-tot').innerText = guestTot;
    document.getElementById('wed-guest-hadir').innerText = guestHadir;
    document.getElementById('wed-guest-tidak').innerText = guestTidak;
    document.getElementById('wed-guest-belum').innerText = guestBelum;

    // Chart Update
    const ctx = document.getElementById('wedBudgetChart').getContext('2d');
    if(wedChartInstance) wedChartInstance.destroy();
    wedChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Estimasi Biaya', data: dataEst, backgroundColor: '#3b82f6', categoryPercentage: 0.8, barPercentage: 0.9 },
                { label: 'Realisasi Biaya', data: dataReal, backgroundColor: '#f43f5e', categoryPercentage: 0.8, barPercentage: 0.9 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top', align: 'end' } },
            scales: { y: { beginAtZero: true, ticks: { callback: function(val) { return 'Rp ' + (val/1000000) + 'Jt'; } } } }
        }
    });
}

window.renderWedAnggaranForm = function() {
    const container = document.getElementById('wed-anggaran-inputs');
    container.innerHTML = '';
    for (const key in window.state.wedding.budget) {
        const cat = window.state.wedding.budget[key];
        container.innerHTML += `
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 class="font-bold text-slate-800 mb-3 text-sm">${cat.name}</h4>
                <div class="space-y-3">
                    <div>
                        <label class="block text-xs font-medium text-slate-600 mb-1">Estimasi (Rp)</label>
                        <input type="text" id="wed-est-${key}" value="${new Intl.NumberFormat('id-ID').format(cat.estimasi)}" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" oninput="window.formatCurrencyInput(this)">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-600 mb-1">Realisasi (Rp)</label>
                        <input type="text" id="wed-real-${key}" value="${new Intl.NumberFormat('id-ID').format(cat.realisasi)}" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" oninput="window.formatCurrencyInput(this)">
                    </div>
                </div>
            </div>
        `;
    }
}

window.saveWeddingAnggaran = function() {
    for (const key in window.state.wedding.budget) {
        const newEst = window.parseIDR(document.getElementById(`wed-est-${key}`).value);
        const newReal = window.parseIDR(document.getElementById(`wed-real-${key}`).value);
        
        const oldReal = window.state.wedding.budget[key].realisasi;
        window.state.wedding.budget[key].estimasi = newEst;
        window.state.wedding.budget[key].realisasi = newReal;
        
        if (newReal > oldReal) {
            const diff = newReal - oldReal;
            window.state.transactions.push({
                id: window.generateId(),
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                category: `Wedding:  ${window.state.wedding.budget[key].name}`,
                amount: diff,
                houseRef: 'Wedding'
            });
        }
    }
    window.state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    window.saveData();
    window.updateAllViews();
    alert('Anggaran & Pengeluaran berhasil disimpan dan disinkronkan!');
}

// Checklist Forms
document.getElementById('wed-chk-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wed-chk-name').value;
    const status = document.getElementById('wed-chk-status').value;
    window.state.wedding.checklist.push({ id: window.generateId(), name, status });
    window.saveData();
    window.renderWedChecklist();
    document.getElementById('wed-chk-modal').classList.add('hidden');
    e.target.reset();
    if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) window.updateWeddingDashboard();
});

window.deleteWedChk = function(id) {
    if(confirm('Hapus tugas ini?')) {
        window.state.wedding.checklist = window.state.wedding.checklist.filter(c => c.id !== id);
        window.saveData();
        window.renderWedChecklist();
        if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) window.updateWeddingDashboard();
    }
}

window.toggleWedChk = function(id, selectElem) {
    const item = window.state.wedding.checklist.find(c => c.id === id);
    if(item) {
        item.status = selectElem.value;
        window.saveData();
        window.renderWedChecklist();
        if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) window.updateWeddingDashboard();
    }
}

window.renderWedChecklist = function() {
    const tbody = document.getElementById('wed-chk-table');
    tbody.innerHTML = '';
    if(window.state.wedding.checklist.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500">Belum ada tugas.</td></tr>';
    } else {
        window.state.wedding.checklist.forEach(c => {
            let stColor = c.status === 'Done' ? 'text-emerald-600 bg-emerald-50' : (c.status === 'In Progress' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-100');
            tbody.innerHTML += `
                <tr>
                    <td class="px-4 py-3 font-medium">${c.name}</td>
                    <td class="px-4 py-3">
                        <select onchange="window.toggleWedChk('${c.id}', this)" class="${stColor} text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer border border-transparent hover:border-slate-300">
                            <option value="Not Started" ${c.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                            <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Done" ${c.status === 'Done' ? 'selected' : ''}>Done</option>
                        </select>
                    </td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="window.deleteWedChk('${c.id}')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    if (window.lucide) window.lucide.createIcons();
}

// Guest Forms
document.getElementById('wed-tamu-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wed-tamu-name').value;
    const status = document.getElementById('wed-tamu-status').value;
    window.state.wedding.guests.push({ id: window.generateId(), name, status });
    window.saveData();
    window.renderWedTamu();
    document.getElementById('wed-tamu-modal').classList.add('hidden');
    e.target.reset();
    if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) window.updateWeddingDashboard();
});

window.deleteWedTamu = function(id) {
    if(confirm('Hapus tamu ini?')) {
        window.state.wedding.guests = window.state.wedding.guests.filter(g => g.id !== id);
        window.saveData();
        window.renderWedTamu();
        if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) window.updateWeddingDashboard();
    }
}

window.toggleWedTamu = function(id, selectElem) {
    const item = window.state.wedding.guests.find(g => g.id === id);
    if(item) {
        item.status = selectElem.value;
        window.saveData();
        window.renderWedTamu();
        if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) window.updateWeddingDashboard();
    }
}

window.renderWedTamu = function() {
    const tbody = document.getElementById('wed-tamu-table');
    tbody.innerHTML = '';
    if(window.state.wedding.guests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500">Belum ada daftar tamu.</td></tr>';
    } else {
        window.state.wedding.guests.forEach(g => {
            let stColor = g.status === 'Hadir' ? 'text-blue-600 bg-blue-50' : (g.status === 'Tidak Hadir' ? 'text-rose-600 bg-rose-50' : 'text-slate-600 bg-slate-100');
            tbody.innerHTML += `
                <tr>
                    <td class="px-4 py-3 font-medium">${g.name}</td>
                    <td class="px-4 py-3">
                        <select onchange="window.toggleWedTamu('${g.id}', this)" class="${stColor} text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer border border-transparent hover:border-slate-300">
                            <option value="Belum Konfirmasi" ${g.status === 'Belum Konfirmasi' ? 'selected' : ''}>Belum Konfirmasi</option>
                            <option value="Hadir" ${g.status === 'Hadir' ? 'selected' : ''}>Konfirmasi Hadir</option>
                            <option value="Tidak Hadir" ${g.status === 'Tidak Hadir' ? 'selected' : ''}>Tidak Hadir</option>
                        </select>
                    </td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="window.deleteWedTamu('${g.id}')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    if (window.lucide) window.lucide.createIcons();
}

// Vendor Forms
window.openWedVendorModal = function(type) {
    document.getElementById('wed-vendor-type').value = type;
    document.getElementById('wed-vendor-modal').classList.remove('hidden');
}

document.getElementById('wed-vendor-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('wed-vendor-type').value;
    const category = document.getElementById('wed-vendor-cat').value;
    const name = document.getElementById('wed-vendor-name').value;
    const contact = document.getElementById('wed-vendor-contact').value;
    
    const v = { id: window.generateId(), category, name, contact };
    if(type === 'deal') {
        window.state.wedding.vendors.push(v);
    } else {
        window.state.wedding.kandidatVendors.push(v);
    }
    window.saveData();
    window.renderWedVendors();
    document.getElementById('wed-vendor-modal').classList.add('hidden');
    e.target.reset();
});

window.deleteWedVendor = function(id, type) {
    if(confirm('Hapus vendor ini?')) {
        if(type === 'deal') {
            window.state.wedding.vendors = window.state.wedding.vendors.filter(v => v.id !== id);
        } else {
            window.state.wedding.kandidatVendors = window.state.wedding.kandidatVendors.filter(v => v.id !== id);
        }
        window.saveData();
        window.renderWedVendors();
    }
}

window.renderWedVendors = function() {
    const listDeal = document.getElementById('wed-vendor-list');
    const listKandidat = document.getElementById('wed-kandidat-list');
    listDeal.innerHTML = '';
    listKandidat.innerHTML = '';
    
    if(window.state.wedding.vendors.length === 0) listDeal.innerHTML = '<p class="text-slate-500 text-sm col-span-full">Belum ada vendor deal.</p>';
    window.state.wedding.vendors.forEach(v => {
        listDeal.innerHTML += `
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 relative group">
                <button onclick="window.deleteWedVendor('${v.id}', 'deal')" class="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                <span class="text-xs font-bold text-blue-600 mb-1 block uppercase">${v.category}</span>
                <h4 class="font-bold text-slate-900 mb-1">${v.name}</h4>
                <p class="text-sm text-slate-600"><i data-lucide="info" class="w-3 h-3 inline mr-1"></i>${v.contact||'-'}</p>
            </div>
        `;
    });
    
    if(window.state.wedding.kandidatVendors.length === 0) listKandidat.innerHTML = '<p class="text-slate-500 text-sm col-span-full">Belum ada kandidat vendor.</p>';
    window.state.wedding.kandidatVendors.forEach(v => {
        listKandidat.innerHTML += `
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">
                <button onclick="window.deleteWedVendor('${v.id}', 'kandidat')" class="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                <span class="text-xs font-bold text-slate-500 mb-1 block uppercase">${v.category}</span>
                <h4 class="font-bold text-slate-900 mb-1">${v.name}</h4>
                <p class="text-sm text-slate-600"><i data-lucide="info" class="w-3 h-3 inline mr-1"></i>${v.contact||'-'}</p>
            </div>
        `;
    });
    if (window.lucide) window.lucide.createIcons();
}

// Seserahan Forms
document.getElementById('wed-ses-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const item = document.getElementById('wed-ses-item').value;
    const status = document.getElementById('wed-ses-status').value;
    window.state.wedding.seserahan.push({ id: window.generateId(), item, status });
    window.saveData();
    window.renderWedSeserahan();
    document.getElementById('wed-ses-modal').classList.add('hidden');
    e.target.reset();
});

window.deleteWedSes = function(id) {
    if(confirm('Hapus item ini?')) {
        window.state.wedding.seserahan = window.state.wedding.seserahan.filter(s => s.id !== id);
        window.saveData();
        window.renderWedSeserahan();
    }
}

window.toggleWedSes = function(id, selectElem) {
    const s = window.state.wedding.seserahan.find(x => x.id === id);
    if(s) {
        s.status = selectElem.value;
        window.saveData();
        window.renderWedSeserahan();
    }
}

window.renderWedSeserahan = function() {
    const tbody = document.getElementById('wed-ses-table');
    tbody.innerHTML = '';
    if(window.state.wedding.seserahan.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500">Belum ada daftar seserahan.</td></tr>';
    } else {
        window.state.wedding.seserahan.forEach(s => {
            let stColor = s.status === 'Sudah Dibeli' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-100';
            tbody.innerHTML += `
                <tr>
                    <td class="px-4 py-3 font-medium">${s.item}</td>
                    <td class="px-4 py-3">
                        <select onchange="window.toggleWedSes('${s.id}', this)" class="${stColor} text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer border border-transparent hover:border-slate-300">
                            <option value="Belum Dibeli" ${s.status === 'Belum Dibeli' ? 'selected' : ''}>Belum Dibeli</option>
                            <option value="Sudah Dibeli" ${s.status === 'Sudah Dibeli' ? 'selected' : ''}>Sudah Dibeli</option>
                        </select>
                    </td>
                    <td class="px-4 py-3 text-right">
                        <button onclick="window.deleteWedSes('${s.id}')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    if (window.lucide) window.lucide.createIcons();
}

