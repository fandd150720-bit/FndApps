// --- WEDDING PLANNER LOGIC ---
let wedChartInstance = null;

// Standard Template Checklist Persiapan Pernikahan
window.DEFAULT_WEDDING_CHECKLIST = [
    // 12+ Bulan Sebelum
    { id: 'chk-1', timeline: '12+ Bulan Sebelum', kategori: 'Konsep & Budget', name: 'Tentukan konsep umum pernikahan & pagu estimasi total anggaran', pic: 'Pengantin', status: 'Done', target: '', notes: 'Diskusi bersama pasangan & kedua orang tua' },
    { id: 'chk-2', timeline: '12+ Bulan Sebelum', kategori: 'Keluarga', name: 'Pertemuan keluarga besar (Lamaran resmi / perkenalan)', pic: 'Keluarga', status: 'Done', target: '', notes: 'Menentukan tanggal akad & resepsi' },
    { id: 'chk-3', timeline: '12+ Bulan Sebelum', kategori: 'Tanggal & Waktu', name: 'Pilih & tetapkan tanggal baik akad nikah dan resepsi', pic: 'Pengantin & Keluarga', status: 'Done', target: '', notes: '' },
    
    // 9-12 Bulan Sebelum
    { id: 'chk-4', timeline: '9-12 Bulan Sebelum', kategori: 'Venue', name: 'Survei, booking, & bayar DP gedung / tempat acara', pic: 'Pengantin', status: 'In Progress', target: '', notes: 'Pastikan kapasitas cukup untuk target undangan' },
    { id: 'chk-5', timeline: '9-12 Bulan Sebelum', kategori: 'Catering', name: 'Test food katering & kunci paket menu tamu & VIP', pic: 'Pengantin & Keluarga', status: 'In Progress', target: '', notes: 'Hitung rasio porsi makanan x2 jumlah undangan' },
    { id: 'chk-6', timeline: '9-12 Bulan Sebelum', kategori: 'MUA & Attire', name: 'Booking Makeup Artist (MUA) & busana pengantin', pic: 'Pengantin Wanita', status: 'Not Started', target: '', notes: 'Akad & resepsi' },
    { id: 'chk-7', timeline: '9-12 Bulan Sebelum', kategori: 'Dokumentasi', name: 'Booking fotografer & videografer (Prewedding & Hari H)', pic: 'Pengantin Pria', status: 'Not Started', target: '', notes: 'Termasuk cetak album & video cinematic' },

    // 6-9 Bulan Sebelum
    { id: 'chk-8', timeline: '6-9 Bulan Sebelum', kategori: 'Dekorasi', name: 'Pilih tema pelaminan & booking vendor dekorasi venue', pic: 'Pengantin', status: 'Not Started', target: '', notes: 'Dekorasi pelaminan, lorong masuk, & photobooth' },
    { id: 'chk-9', timeline: '6-9 Bulan Sebelum', kategori: 'Entertainment', name: 'Booking MC (Master of Ceremony) & Sound System / Band', pic: 'Pengantin', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-10', timeline: '6-9 Bulan Sebelum', kategori: 'Busana', name: 'Pesan bahan & jahit seragam keluarga besar & bridesmaid', pic: 'Keluarga', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-11', timeline: '6-9 Bulan Sebelum', kategori: 'Dokumentasi', name: 'Sesi foto prewedding & seleksi foto cetak', pic: 'Pengantin', status: 'Not Started', target: '', notes: '' },

    // 3-6 Bulan Sebelum
    { id: 'chk-12', timeline: '3-6 Bulan Sebelum', kategori: 'Legal & KUA', name: 'Urus berkas N1-N4 ke RT/RW/Kelurahan untuk KUA / Catatan Sipil', pic: 'Pengantin', status: 'Not Started', target: '', notes: 'Siapkan KTP, KK, Akta Kelahiran, Pasfoto background biru' },
    { id: 'chk-13', timeline: '3-6 Bulan Sebelum', kategori: 'Cincin', name: 'Pesan cincin kawin & grafir nama pasangan', pic: 'Pengantin', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-14', timeline: '3-6 Bulan Sebelum', kategori: 'Tamu & Undangan', name: 'Susun database daftar tamu undangan & finalisasi jumlah', pic: 'Pengantin & Keluarga', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-15', timeline: '3-6 Bulan Sebelum', kategori: 'Souvenir', name: 'Pesan souvenir pernikahan & kemasannya', pic: 'Pengantin', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-16', timeline: '3-6 Bulan Sebelum', kategori: 'Seserahan', name: 'Mulai cicil belanja barang seserahan / hantaran & mahar', pic: 'Pengantin Pria', status: 'Not Started', target: '', notes: '' },

    // 1-3 Bulan Sebelum
    { id: 'chk-17', timeline: '1-3 Bulan Sebelum', kategori: 'Legal & KUA', name: 'Daftar resmi ke KUA kecamatan & ikuti bimbingan pranikah (Suscatin)', pic: 'Pengantin', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-18', timeline: '1-3 Bulan Sebelum', kategori: 'Kesehatan', name: 'Pemeriksaan kesehatan pranikah (Premarital check-up di Puskesmas/RS)', pic: 'Pengantin', status: 'Not Started', target: '', notes: 'Vaksin TT & skrining kesehatan' },
    { id: 'chk-19', timeline: '1-3 Bulan Sebelum', kategori: 'Undangan', name: 'Cetak fisik & buat link website undangan digital (e-invitation)', pic: 'Pengantin', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-20', timeline: '1-3 Bulan Sebelum', kategori: 'Busana', name: 'Fitting busana pengantin tahap akhir', pic: 'Pengantin', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-21', timeline: '1-3 Bulan Sebelum', kategori: 'Seserahan', name: 'Hias kotak seserahan, mahar, & kotak cincin', pic: 'Pengantin', status: 'Not Started', target: '', notes: '' },

    // 1 Bulan Sebelum
    { id: 'chk-22', timeline: '1 Bulan Sebelum', kategori: 'Technical Meeting', name: 'Technical Meeting (TM) seluruh vendor & panitia keluarga di venue', pic: 'WO / Pengantin', status: 'Not Started', target: '', notes: 'Kordinasi alur listrik, sound, katering, rundown' },
    { id: 'chk-23', timeline: '1 Bulan Sebelum', kategori: 'Undangan', name: 'Sebar undangan fisik & blast undangan digital ke tamu', pic: 'Pengantin & Keluarga', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-24', timeline: '1 Bulan Sebelum', kategori: 'Konsep & Budget', name: 'Finalisasi susunan acara (Rundown Hari H) & teks ijab qabul', pic: 'WO / Pengantin', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-25', timeline: '1 Bulan Sebelum', kategori: 'Akomodasi', name: 'Booking kamar hotel / transportasi keluarga dari luar kota', pic: 'Keluarga', status: 'Not Started', target: '', notes: '' },

    // H-7 s.d. H-1
    { id: 'chk-26', timeline: 'H-7 s.d. H-1', kategori: 'Keuangan', name: 'Pelunasan sisa tagihan semua vendor pernikahan & siapkan tips tunai', pic: 'Keuangan / Pengantin', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-27', timeline: 'H-7 s.d. H-1', kategori: 'Logistik', name: 'Kirim seserahan, mahar, souvenir, & buku nikah ke lokasi venue', pic: 'Logistik / Keluarga', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-28', timeline: 'H-7 s.d. H-1', kategori: 'Pelaksanaan', name: 'Acara pengajian pranikah, siraman / midodareni', pic: 'Keluarga', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-29', timeline: 'H-7 s.d. H-1', kategori: 'Pelaksanaan', name: 'Gladi resik akad nikah bersama saksi & keluarga inti', pic: 'WO / Keluarga', status: 'Not Started', target: '', notes: '' },

    // HARI H
    { id: 'chk-30', timeline: 'HARI H', kategori: 'Pelaksanaan', name: 'Prosesi Akad Nikah / Ijab Qabul & penandatanganan buku nikah', pic: 'Penghulu / Saksi / WO', status: 'Not Started', target: '', notes: 'Pastikan mas kawin, cincin, & berkas siap' },
    { id: 'chk-31', timeline: 'HARI H', kategori: 'Pelaksanaan', name: 'Resepsi pernikahan, ramah tamah, foto bersama & lempar buket', pic: 'WO / MC / Keluarga', status: 'Not Started', target: '', notes: '' },
    { id: 'chk-32', timeline: 'HARI H', kategori: 'Logistik', name: 'Serah terima kado, amplop, kotak angpau & checking perlengkapan sesudah acara', pic: 'PIC Keluarga Keuangan', status: 'Not Started', target: '', notes: 'Simpan buku nikah & mahar di tempat aman' }
];

// Switch Tabs inside Wedding Planner
window.switchWedTab = function(tabId) {
    const tabs = ['dashboard', 'checklist', 'anggaran', 'tamu', 'vendor', 'seserahan', 'kandidat'];
    tabs.forEach(id => {
        const view = document.getElementById(`view-wed-${id}`);
        if (view) {
            view.classList.add('hidden');
            view.classList.remove('block');
        }
        
        const el = document.getElementById(`tab-wed-${id}`);
        if (el) {
            el.classList.remove('active');
        }
    });
    
    const targetView = document.getElementById(`view-wed-${tabId}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('block');
    }
    
    const btn = document.getElementById(`tab-wed-${tabId}`);
    if (btn) {
        btn.classList.add('active');
    }
    
    if (tabId === 'dashboard') window.updateWeddingDashboard();
    if (tabId === 'checklist') window.renderWedChecklist();
    if (tabId === 'tamu') window.renderWedTamu();
    if (tabId === 'vendor' || tabId === 'kandidat') window.renderWedVendors();
    if (tabId === 'seserahan') window.renderWedSeserahan();
    if (tabId === 'anggaran') window.renderWedAnggaranForm();
};
window.switchWeddingTab = window.switchWedTab;

window.initWeddingPlannerUI = function() {
    window.renderWedChecklist();
    window.renderWedTamu();
    window.renderWedVendors();
    window.renderWedSeserahan();
    window.renderWedAnggaranForm();
    window.updateWeddingDashboard();
};

window.updateWeddingDashboard = function() {
    if (!window.state.wedding) return;
    
    let totalEst = 0;
    let totalReal = 0;
    const labels = [];
    const dataEst = [];
    const dataReal = [];
    
    const tbody = document.getElementById('wed-dash-budget-tbody');
    if (tbody && window.state.wedding.budget) {
        tbody.innerHTML = '';
        for (const key in window.state.wedding.budget) {
            const cat = window.state.wedding.budget[key];
            totalEst += cat.estimasi || 0;
            totalReal += cat.realisasi || 0;
            
            const catLabel = cat.name ? cat.name.split('.')[1]?.trim()?.split(' ')[0] || cat.name : key;
            labels.push(catLabel);
            dataEst.push(cat.estimasi || 0);
            dataReal.push(cat.realisasi || 0);
            
            const selisih = (cat.estimasi || 0) - (cat.realisasi || 0);
            tbody.innerHTML += `
                <tr class="hover:bg-[#F4F7FE] transition-colors">
                    <td class="py-2 px-2 text-[#2B3674] font-medium">${cat.name || key}</td>
                    <td class="py-2 px-2 text-[#2B3674] text-right">${window.formatIDR(cat.estimasi || 0)}</td>
                    <td class="py-2 px-2 text-[#2B3674] text-right">${window.formatIDR(cat.realisasi || 0)}</td>
                    <td class="py-2 px-2 text-right ${selisih >= 0 ? 'text-emerald-500' : 'text-rose-500'} font-bold">${window.formatIDR(selisih)}</td>
                </tr>
            `;
        }
    }
    
    const totalSelisih = totalEst - totalReal;
    const setElemText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setElemText('wed-dash-tot-est', window.formatIDR(totalEst));
    setElemText('wed-dash-tot-real', window.formatIDR(totalReal));
    setElemText('wed-dash-tot-selisih', window.formatIDR(totalSelisih));
    const selisihEl = document.getElementById('wed-dash-tot-selisih');
    if (selisihEl) selisihEl.className = `px-4 py-2 font-bold ${totalSelisih >= 0 ? 'text-emerald-500' : 'text-rose-500'}`;
    
    setElemText('wed-dash-tot-bayar', window.formatIDR(totalReal));
    setElemText('wed-dash-tot-sisa', window.formatIDR(totalEst - totalReal > 0 ? totalEst - totalReal : 0));
    setElemText('wed-dash-budget-tot-est', window.formatIDR(totalEst));
    setElemText('wed-dash-budget-tot-real', window.formatIDR(totalReal));
    setElemText('wed-dash-budget-tot-selisih', window.formatIDR(totalSelisih));
    
    // Checklist Stats
    const checklist = window.state.wedding.checklist || [];
    const chkDone = checklist.filter(c => c.status === 'Done').length;
    const chkProg = checklist.filter(c => c.status === 'In Progress').length;
    const chkNot = checklist.filter(c => c.status === 'Not Started').length;
    const chkTot = checklist.length;
    
    setElemText('wed-chk-done', chkDone);
    setElemText('wed-chk-prog', chkProg);
    setElemText('wed-chk-not', chkNot);
    setElemText('wed-chk-tot', chkTot);
    
    setElemText('wed-chk-done-pct', chkTot > 0 ? (chkDone/chkTot*100).toFixed(1) + '%' : '0.0%');
    setElemText('wed-chk-prog-pct', chkTot > 0 ? (chkProg/chkTot*100).toFixed(1) + '%' : '0.0%');
    setElemText('wed-chk-not-pct', chkTot > 0 ? (chkNot/chkTot*100).toFixed(1) + '%' : '0.0%');
    
    // Guests Stats
    const guests = window.state.wedding.guests || [];
    const guestHadir = guests.filter(g => g.status === 'Hadir').length;
    const guestTidak = guests.filter(g => g.status === 'Tidak Hadir').length;
    const guestBelum = guests.filter(g => g.status === 'Belum Konfirmasi').length;
    const guestTot = guests.length;
    
    setElemText('wed-guest-tot', guestTot);
    setElemText('wed-guest-hadir', guestHadir);
    setElemText('wed-guest-tidak', guestTidak);
    setElemText('wed-guest-belum', guestBelum);

    // Chart Update safely
    const chartCanvas = document.getElementById('wedBudgetChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');
        if (wedChartInstance) wedChartInstance.destroy();
        wedChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Estimasi Biaya', data: dataEst, backgroundColor: '#4318FF', categoryPercentage: 0.8, barPercentage: 0.9, borderRadius: 4 },
                    { label: 'Realisasi Biaya', data: dataReal, backgroundColor: '#39B8FF', categoryPercentage: 0.8, barPercentage: 0.9, borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', align: 'end' } },
                scales: { y: { beginAtZero: true, ticks: { callback: function(val) { return val === 0 ? 'Rp 0' : (val >= 1000000 ? 'Rp ' + Number((val/1000000).toFixed(1)).toLocaleString('id-ID') + ' Jt' : 'Rp ' + val.toLocaleString('id-ID')); } } } }
            }
        });
    }
};

window.renderWedAnggaranForm = function() {
    const container = document.getElementById('wed-anggaran-inputs');
    if (!container || !window.state.wedding?.budget) return;
    container.innerHTML = '';
    for (const key in window.state.wedding.budget) {
        const cat = window.state.wedding.budget[key];
        container.innerHTML += `
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 class="font-bold text-slate-800 mb-3 text-sm">${cat.name}</h4>
                <div class="space-y-3">
                    <div>
                        <label class="block text-xs font-medium text-slate-600 mb-1">Estimasi (Rp)</label>
                        <input type="text" id="wed-est-${key}" value="${new Intl.NumberFormat('id-ID').format(cat.estimasi || 0)}" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" oninput="window.formatCurrencyInput(this)">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-600 mb-1">Realisasi (Rp)</label>
                        <input type="text" id="wed-real-${key}" value="${new Intl.NumberFormat('id-ID').format(cat.realisasi || 0)}" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" oninput="window.formatCurrencyInput(this)">
                    </div>
                </div>
            </div>
        `;
    }
};

window.saveWeddingAnggaran = function() {
    if (!window.state.wedding?.budget) return;
    for (const key in window.state.wedding.budget) {
        const estEl = document.getElementById(`wed-est-${key}`);
        const realEl = document.getElementById(`wed-real-${key}`);
        if (!estEl || !realEl) continue;

        const newEst = window.parseIDR(estEl.value);
        const newReal = window.parseIDR(realEl.value);
        
        const oldReal = window.state.wedding.budget[key].realisasi || 0;
        window.state.wedding.budget[key].estimasi = newEst;
        window.state.wedding.budget[key].realisasi = newReal;
        
        if (newReal > oldReal) {
            const diff = newReal - oldReal;
            window.state.transactions.push({
                id: window.generateId(),
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                category: `Wedding: ${window.state.wedding.budget[key].name}`,
                amount: diff,
                houseRef: 'Wedding'
            });
        }
    }
    window.state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    window.saveData();
    window.updateAllViews();
    alert('Anggaran & Pengeluaran berhasil disimpan dan disinkronkan!');
};

// ============= WEDDING CHECKLIST CRUD & TEMPLATE =============

// Load standard Indonesian wedding preparation checklist
window.loadDefaultWedChecklist = function(force = false) {
    if (!window.state.wedding) window.state.wedding = {};
    const currentList = window.state.wedding.checklist || [];
    
    if (force && currentList.length > 0) {
        if (!confirm('Ganti checklist saat ini dengan template standar rekomendasi? Data checklist Anda saat ini akan digantikan.')) return;
    }
    
    window.state.wedding.checklist = JSON.parse(JSON.stringify(window.DEFAULT_WEDDING_CHECKLIST));
    window.saveData();
    window.renderWedChecklist();
    window.updateWeddingDashboard();
};

// Form Submit (Add or Edit)
document.getElementById('wed-chk-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('wed-chk-edit-id')?.value;
    const item = {
        id: editId || window.generateId(),
        timeline: document.getElementById('wed-chk-timeline')?.value || '12+ Bulan Sebelum',
        kategori: document.getElementById('wed-chk-kategori')?.value || 'Umum',
        name: document.getElementById('wed-chk-name')?.value || '',
        pic: document.getElementById('wed-chk-pic')?.value || '',
        target: document.getElementById('wed-chk-target')?.value || '',
        status: document.getElementById('wed-chk-status')?.value || 'Not Started',
        notes: document.getElementById('wed-chk-notes')?.value || ''
    };

    if (!window.state.wedding) window.state.wedding = {};
    if (!window.state.wedding.checklist) window.state.wedding.checklist = [];

    if (editId) {
        const idx = window.state.wedding.checklist.findIndex(c => c.id === editId);
        if (idx !== -1) window.state.wedding.checklist[idx] = item;
    } else {
        window.state.wedding.checklist.push(item);
    }

    window.saveData();
    window.renderWedChecklist();
    window.updateWeddingDashboard();
    document.getElementById('wed-chk-modal')?.classList.add('hidden');
    e.target.reset();
    const editIdEl = document.getElementById('wed-chk-edit-id');
    if (editIdEl) editIdEl.value = '';
    const modalTitleEl = document.getElementById('wed-chk-modal-title');
    if (modalTitleEl) modalTitleEl.innerText = 'Tambah Tugas Persiapan';
});

window.deleteWedChk = function(id) {
    if (confirm('Hapus tugas ini?')) {
        window.state.wedding.checklist = (window.state.wedding.checklist || []).filter(c => c.id !== id);
        window.saveData();
        window.renderWedChecklist();
        window.updateWeddingDashboard();
    }
};

window.editWedChk = function(id) {
    const item = (window.state.wedding.checklist || []).find(c => c.id === id);
    if (!item) return;
    
    const setVal = (fieldId, val) => {
        const el = document.getElementById(fieldId);
        if (el) el.value = val || '';
    };

    setVal('wed-chk-edit-id', item.id);
    setVal('wed-chk-timeline', item.timeline || '12+ Bulan Sebelum');
    setVal('wed-chk-kategori', item.kategori || '');
    setVal('wed-chk-name', item.name || '');
    setVal('wed-chk-pic', item.pic || '');
    setVal('wed-chk-target', item.target || '');
    setVal('wed-chk-status', item.status || 'Not Started');
    setVal('wed-chk-notes', item.notes || '');

    const titleEl = document.getElementById('wed-chk-modal-title');
    if (titleEl) titleEl.innerText = 'Edit Tugas Persiapan';
    document.getElementById('wed-chk-modal')?.classList.remove('hidden');
};

window.toggleWedChkStatus = function(id, selectElem) {
    const item = (window.state.wedding.checklist || []).find(c => c.id === id);
    if (item) {
        item.status = selectElem.value;
        window.saveData();
        window.renderWedChecklist();
        window.updateWeddingDashboard();
    }
};

const TIMELINE_ORDER = [
    '12+ Bulan Sebelum', '9-12 Bulan Sebelum', '6-9 Bulan Sebelum',
    '3-6 Bulan Sebelum', '1-3 Bulan Sebelum', '1 Bulan Sebelum',
    'H-7 s.d. H-1', 'HARI H'
];

window.renderWedChecklist = function() {
    const tbody = document.getElementById('wed-chk-table');
    if (!tbody) return;

    // If checklist is empty, auto-populate with standard template
    if (!window.state.wedding) window.state.wedding = {};
    if (!window.state.wedding.checklist || window.state.wedding.checklist.length === 0) {
        window.state.wedding.checklist = JSON.parse(JSON.stringify(window.DEFAULT_WEDDING_CHECKLIST));
        window.saveData();
    }

    const allItems = window.state.wedding.checklist || [];
    
    // Update Stat Badges
    const chkDone = allItems.filter(c => c.status === 'Done').length;
    const chkProg = allItems.filter(c => c.status === 'In Progress').length;
    const chkNot = allItems.filter(c => c.status === 'Not Started').length;
    const chkTot = allItems.length;
    const chkPct = chkTot > 0 ? (chkDone / chkTot * 100).toFixed(0) : '0';

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('wed-chk-stat-total', chkTot);
    setEl('wed-chk-stat-done', chkDone);
    setEl('wed-chk-stat-done-pct', `(${chkPct}%)`);
    setEl('wed-chk-stat-prog', chkProg);
    setEl('wed-chk-stat-not', chkNot);

    const filterStatus = document.getElementById('wed-chk-filter-status')?.value || 'all';
    const filterTimeline = document.getElementById('wed-chk-filter-timeline')?.value || 'all';
    const searchQ = (document.getElementById('wed-chk-search')?.value || '').toLowerCase();

    let items = [...allItems];

    // Sort by timeline order
    items.sort((a, b) => {
        const ai = TIMELINE_ORDER.indexOf(a.timeline);
        const bi = TIMELINE_ORDER.indexOf(b.timeline);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    // Apply filters
    if (filterStatus !== 'all') items = items.filter(c => c.status === filterStatus);
    if (filterTimeline !== 'all') items = items.filter(c => c.timeline === filterTimeline);
    if (searchQ) items = items.filter(c =>
        (c.name || '').toLowerCase().includes(searchQ) ||
        (c.kategori || '').toLowerCase().includes(searchQ) ||
        (c.pic || '').toLowerCase().includes(searchQ) ||
        (c.notes || '').toLowerCase().includes(searchQ)
    );

    tbody.innerHTML = '';

    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500">
            Tidak ada tugas yang sesuai filter. Klik <b>+ Tambah Tugas</b> atau <a href="javascript:void(0)" onclick="window.loadDefaultWedChecklist(true)" class="text-rose-600 underline font-medium">Muat Template Standar</a>.
        </td></tr>`;
        return;
    }

    let lastTimeline = '';
    items.forEach(c => {
        const statusColor = c.status === 'Done'
            ? 'bg-emerald-100 text-emerald-700'
            : c.status === 'In Progress'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-slate-100 text-slate-600';

        // Group header row per timeline
        let groupRow = '';
        if (c.timeline !== lastTimeline) {
            lastTimeline = c.timeline;
            const isHariH = c.timeline === 'HARI H';
            const tlClass = isHariH ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white' : 'bg-slate-700 text-white';
            groupRow = `<tr>
                <td colspan="6" class="${tlClass} text-xs font-bold px-4 py-2.5 uppercase tracking-wide">
                    📅 ${c.timeline}
                </td>
            </tr>`;
        }

        const targetFmt = c.target ? new Date(c.target).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'}) : '-';

        tbody.innerHTML += groupRow + `
        <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${c.status === 'Done' ? 'bg-slate-50/50' : ''}">
            <td class="px-3 py-2.5 text-xs font-medium text-slate-600 whitespace-nowrap">
                <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">${c.kategori || 'Umum'}</span>
            </td>
            <td class="px-3 py-2.5 text-sm text-slate-800">
                <div class="font-medium ${c.status === 'Done' ? 'line-through text-slate-400' : ''}">${c.name}</div>
                ${c.notes ? `<div class="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><i data-lucide="info" class="w-3 h-3 text-slate-400 inline"></i> ${c.notes}</div>` : ''}
            </td>
            <td class="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    👤 ${c.pic || '-'}
                </span>
            </td>
            <td class="px-3 py-2.5 whitespace-nowrap">
                <select onchange="window.toggleWedChkStatus('${c.id}', this)"
                    class="text-xs px-2.5 py-1 rounded-lg border-0 font-semibold ${statusColor} cursor-pointer outline-none shadow-sm">
                    <option value="Not Started" ${c.status === 'Not Started' ? 'selected' : ''}>⬜ Belum Mulai</option>
                    <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>🔄 Dalam Proses</option>
                    <option value="Done" ${c.status === 'Done' ? 'selected' : ''}>✅ Selesai</option>
                </select>
            </td>
            <td class="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">${targetFmt}</td>
            <td class="px-3 py-2.5 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1">
                    <button onclick="window.editWedChk('${c.id}')"
                        class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Tugas">
                        <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="window.deleteWedChk('${c.id}')"
                        class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus Tugas">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    if (window.lucide) window.lucide.createIcons();
};

// ============= WEDDING GUEST CRUD =============
document.getElementById('wed-tamu-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wed-tamu-name')?.value;
    const status = document.getElementById('wed-tamu-status')?.value || 'Belum Konfirmasi';
    if (!window.state.wedding) window.state.wedding = {};
    if (!window.state.wedding.guests) window.state.wedding.guests = [];
    window.state.wedding.guests.push({ id: window.generateId(), name, status });
    window.saveData();
    window.renderWedTamu();
    document.getElementById('wed-tamu-modal')?.classList.add('hidden');
    e.target.reset();
    window.updateWeddingDashboard();
});

window.deleteWedTamu = function(id) {
    if(confirm('Hapus tamu ini?')) {
        window.state.wedding.guests = (window.state.wedding.guests || []).filter(g => g.id !== id);
        window.saveData();
        window.renderWedTamu();
        window.updateWeddingDashboard();
    }
};

window.toggleWedTamu = function(id, selectElem) {
    const item = (window.state.wedding.guests || []).find(g => g.id === id);
    if(item) {
        item.status = selectElem.value;
        window.saveData();
        window.renderWedTamu();
        window.updateWeddingDashboard();
    }
};

window.renderWedTamu = function() {
    const tbody = document.getElementById('wed-tamu-table');
    if (!tbody) return;
    tbody.innerHTML = '';
    const guests = window.state.wedding?.guests || [];
    if(guests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500">Belum ada daftar tamu.</td></tr>';
    } else {
        guests.forEach(g => {
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
};

// ============= WEDDING VENDORS CRUD =============
window.openWedVendorModal = function(type) {
    const typeEl = document.getElementById('wed-vendor-type');
    if (typeEl) typeEl.value = type;
    document.getElementById('wed-vendor-modal')?.classList.remove('hidden');
};

document.getElementById('wed-vendor-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('wed-vendor-type')?.value;
    const category = document.getElementById('wed-vendor-cat')?.value;
    const name = document.getElementById('wed-vendor-name')?.value;
    const contact = document.getElementById('wed-vendor-contact')?.value;
    
    const v = { id: window.generateId(), category, name, contact };
    if (!window.state.wedding) window.state.wedding = {};
    if (!window.state.wedding.vendors) window.state.wedding.vendors = [];
    if (!window.state.wedding.kandidatVendors) window.state.wedding.kandidatVendors = [];

    if(type === 'deal') {
        window.state.wedding.vendors.push(v);
    } else {
        window.state.wedding.kandidatVendors.push(v);
    }
    window.saveData();
    window.renderWedVendors();
    document.getElementById('wed-vendor-modal')?.classList.add('hidden');
    e.target.reset();
});

window.deleteWedVendor = function(id, type) {
    if(confirm('Hapus vendor ini?')) {
        if(type === 'deal') {
            window.state.wedding.vendors = (window.state.wedding.vendors || []).filter(v => v.id !== id);
        } else {
            window.state.wedding.kandidatVendors = (window.state.wedding.kandidatVendors || []).filter(v => v.id !== id);
        }
        window.saveData();
        window.renderWedVendors();
    }
};

window.renderWedVendors = function() {
    const listDeal = document.getElementById('wed-vendor-list');
    const listKandidat = document.getElementById('wed-kandidat-list');
    if (!listDeal && !listKandidat) return;
    
    if (listDeal) {
        listDeal.innerHTML = '';
        const vendors = window.state.wedding?.vendors || [];
        if(vendors.length === 0) listDeal.innerHTML = '<p class="text-slate-500 text-sm col-span-full">Belum ada vendor deal.</p>';
        vendors.forEach(v => {
            listDeal.innerHTML += `
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 relative group">
                    <button onclick="window.deleteWedVendor('${v.id}', 'deal')" class="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    <span class="text-xs font-bold text-blue-600 mb-1 block uppercase">${v.category}</span>
                    <h4 class="font-bold text-slate-900 mb-1">${v.name}</h4>
                    <p class="text-sm text-slate-600"><i data-lucide="info" class="w-3 h-3 inline mr-1"></i>${v.contact||'-'}</p>
                </div>
            `;
        });
    }
    
    if (listKandidat) {
        listKandidat.innerHTML = '';
        const kandidat = window.state.wedding?.kandidatVendors || [];
        if(kandidat.length === 0) listKandidat.innerHTML = '<p class="text-slate-500 text-sm col-span-full">Belum ada kandidat vendor.</p>';
        kandidat.forEach(v => {
            listKandidat.innerHTML += `
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">
                    <button onclick="window.deleteWedVendor('${v.id}', 'kandidat')" class="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    <span class="text-xs font-bold text-slate-500 mb-1 block uppercase">${v.category}</span>
                    <h4 class="font-bold text-slate-900 mb-1">${v.name}</h4>
                    <p class="text-sm text-slate-600"><i data-lucide="info" class="w-3 h-3 inline mr-1"></i>${v.contact||'-'}</p>
                </div>
            `;
        });
    }
    if (window.lucide) window.lucide.createIcons();
};

// ============= SESERAHAN FORMS & CRUD =============
document.getElementById('wed-ses-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const item = document.getElementById('wed-ses-item')?.value;
    const status = document.getElementById('wed-ses-status')?.value || 'Belum Dibeli';
    if (!window.state.wedding) window.state.wedding = {};
    if (!window.state.wedding.seserahan) window.state.wedding.seserahan = [];
    window.state.wedding.seserahan.push({ id: window.generateId(), item, status });
    window.saveData();
    window.renderWedSeserahan();
    document.getElementById('wed-ses-modal')?.classList.add('hidden');
    e.target.reset();
});

window.deleteWedSes = function(id) {
    if(confirm('Hapus item ini?')) {
        window.state.wedding.seserahan = (window.state.wedding.seserahan || []).filter(s => s.id !== id);
        window.saveData();
        window.renderWedSeserahan();
    }
};

window.toggleWedSes = function(id, selectElem) {
    const s = (window.state.wedding?.seserahan || []).find(x => x.id === id);
    if(s) {
        s.status = selectElem.value;
        window.saveData();
        window.renderWedSeserahan();
    }
};

window.renderWedSeserahan = function() {
    const tbody = document.getElementById('wed-ses-table');
    if (!tbody) return;
    tbody.innerHTML = '';
    const items = window.state.wedding?.seserahan || [];
    if(items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500">Belum ada daftar seserahan.</td></tr>';
    } else {
        items.forEach(s => {
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
};
