$ErrorActionPreference = "Stop"

$filePath = "C:\Users\USER\.gemini\antigravity-ide\scratch\fnd-apps\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Update initial state in init() and localstorage fallback
$state_init_old = @"
                    state.house = d.house || { kprTarget: 0, dpTarget: 0, renovations: [] };
                    state.marriedBudget = d.marriedBudget || { categories: { venue: 0, catering: 0, dokumentasi: 0, attire: 0, lainnya: 0 }, target: 0 };
"@

$state_init_new = @"
                    state.house = d.house || { kprTarget: 0, dpTarget: 0, renovations: [] };
                    state.wedding = d.wedding || {
                        groomName: "Febi Wahyudi",
                        brideName: "Debi Apriani",
                        weddingDate: "",
                        budget: {
                            venue: { estimasi: d.marriedBudget?.categories?.venue || 0, realisasi: 0, name: "01. Venue & Catering" },
                            dekorasi: { estimasi: 0, realisasi: 0, name: "02. Dekorasi & Styling" },
                            busana: { estimasi: d.marriedBudget?.categories?.attire || 0, realisasi: 0, name: "03. Busana & Makeup (Attire & Beauty)" },
                            dokumentasi: { estimasi: d.marriedBudget?.categories?.dokumentasi || 0, realisasi: 0, name: "04. Dokumentasi (Foto & Video)" },
                            hiburan: { estimasi: 0, realisasi: 0, name: "05. Hiburan, MC & Sound System" },
                            undangan: { estimasi: 0, realisasi: 0, name: "06. Undangan & Souvenir" },
                            legal: { estimasi: 0, realisasi: 0, name: "07. Legal / KUA / Keagamaan" },
                            cincin: { estimasi: 0, realisasi: 0, name: "08. Cincin & Seserahan / Mahar" },
                            akomodasi: { estimasi: 0, realisasi: 0, name: "09. Akomodasi & Transportasi" },
                            seragam: { estimasi: 0, realisasi: 0, name: "10. Seragam Keluarga" },
                            lainnya: { estimasi: d.marriedBudget?.categories?.lainnya || 0, realisasi: 0, name: "11. Lain-lain & Dana Darurat" }
                        },
                        checklist: [],
                        guests: [],
                        vendors: [],
                        kandidatVendors: [],
                        seserahan: []
                    };
"@

$ls_init_old = @"
                            if(ls.house) state.house = ls.house;
                            if(ls.marriedBudget) state.marriedBudget = ls.marriedBudget;
"@

$ls_init_new = @"
                            if(ls.house) state.house = ls.house;
                            if(ls.wedding) state.wedding = ls.wedding;
                            else if(ls.marriedBudget) {
                                state.wedding = {
                                    groomName: "Febi Wahyudi",
                                    brideName: "Debi Apriani",
                                    weddingDate: "",
                                    budget: {
                                        venue: { estimasi: ls.marriedBudget?.categories?.venue || 0, realisasi: 0, name: "01. Venue & Catering" },
                                        dekorasi: { estimasi: 0, realisasi: 0, name: "02. Dekorasi & Styling" },
                                        busana: { estimasi: ls.marriedBudget?.categories?.attire || 0, realisasi: 0, name: "03. Busana & Makeup (Attire & Beauty)" },
                                        dokumentasi: { estimasi: ls.marriedBudget?.categories?.dokumentasi || 0, realisasi: 0, name: "04. Dokumentasi (Foto & Video)" },
                                        hiburan: { estimasi: 0, realisasi: 0, name: "05. Hiburan, MC & Sound System" },
                                        undangan: { estimasi: 0, realisasi: 0, name: "06. Undangan & Souvenir" },
                                        legal: { estimasi: 0, realisasi: 0, name: "07. Legal / KUA / Keagamaan" },
                                        cincin: { estimasi: 0, realisasi: 0, name: "08. Cincin & Seserahan / Mahar" },
                                        akomodasi: { estimasi: 0, realisasi: 0, name: "09. Akomodasi & Transportasi" },
                                        seragam: { estimasi: 0, realisasi: 0, name: "10. Seragam Keluarga" },
                                        lainnya: { estimasi: ls.marriedBudget?.categories?.lainnya || 0, realisasi: 0, name: "11. Lain-lain & Dana Darurat" }
                                    },
                                    checklist: [],
                                    guests: [],
                                    vendors: [],
                                    kandidatVendors: [],
                                    seserahan: []
                                };
                            }
"@

$content = $content.Replace($state_init_old, $state_init_new)
$content = $content.Replace($ls_init_old, $ls_init_new)

# 2. Replace HTML section
$section_married_new = @"
<!-- Wedding Planner Section -->
            <section id="married" class="section-view">
                <div class="flex flex-col mb-6">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4">Wedding Planner</h2>
                    <div class="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-slate-200" id="wedding-tabs">
                        <button onclick="switchWeddingTab('dashboard')" id="tab-wed-dashboard" class="wedding-tab px-4 py-2 font-medium rounded-t-lg bg-blue-50 text-blue-700 border-b-2 border-blue-600 whitespace-nowrap">Dashboard & Summary</button>
                        <button onclick="switchWeddingTab('checklist')" id="tab-wed-checklist" class="wedding-tab px-4 py-2 font-medium text-slate-500 hover:text-slate-700 whitespace-nowrap">Checklist Persiapan</button>
                        <button onclick="switchWeddingTab('anggaran')" id="tab-wed-anggaran" class="wedding-tab px-4 py-2 font-medium text-slate-500 hover:text-slate-700 whitespace-nowrap">Anggaran & Pengeluaran</button>
                        <button onclick="switchWeddingTab('tamu')" id="tab-wed-tamu" class="wedding-tab px-4 py-2 font-medium text-slate-500 hover:text-slate-700 whitespace-nowrap">Daftar Tamu</button>
                        <button onclick="switchWeddingTab('vendor')" id="tab-wed-vendor" class="wedding-tab px-4 py-2 font-medium text-slate-500 hover:text-slate-700 whitespace-nowrap">Direktori Vendor</button>
                        <button onclick="switchWeddingTab('seserahan')" id="tab-wed-seserahan" class="wedding-tab px-4 py-2 font-medium text-slate-500 hover:text-slate-700 whitespace-nowrap">Detail Seserahan</button>
                        <button onclick="switchWeddingTab('kandidat')" id="tab-wed-kandidat" class="wedding-tab px-4 py-2 font-medium text-slate-500 hover:text-slate-700 whitespace-nowrap">List Kandidat Vendor</button>
                    </div>
                </div>

                <!-- Wed Tab: Dashboard -->
                <div id="view-wed-dashboard" class="wedding-view block">
                    <div class="card p-6 mb-6 overflow-hidden">
                        <h2 class="text-xl font-bold text-slate-900 mb-1">WEDDING PLANNING DASHBOARD</h2>
                        <p class="text-sm text-slate-500 italic mb-6">Rencana Pernikahan: Febi Wahyudi & Debi Apriani | Tanggal Acara: <span id="wed-dash-date">-</span></p>
                        
                        <h3 class="font-bold text-slate-800 mb-2">RINGKASAN KEUANGAN</h3>
                        <div class="overflow-x-auto mb-6">
                            <table class="w-full text-sm text-left border-collapse border border-slate-200">
                                <thead class="bg-slate-800 text-white">
                                    <tr>
                                        <th class="px-4 py-2 border border-slate-700">Total Estimasi</th>
                                        <th class="px-4 py-2 border border-slate-700">Total Realisasi</th>
                                        <th class="px-4 py-2 border border-slate-700">Selisih (Hemat/Over)</th>
                                        <th class="px-4 py-2 border border-slate-700">Total Terbayar</th>
                                        <th class="px-4 py-2 border border-slate-700">Sisa Tagihan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="font-medium text-slate-900 bg-white">
                                        <td class="px-4 py-2 border border-slate-200" id="wed-dash-tot-est">Rp 0</td>
                                        <td class="px-4 py-2 border border-slate-200" id="wed-dash-tot-real">Rp 0</td>
                                        <td class="px-4 py-2 border border-slate-200" id="wed-dash-tot-selisih">Rp 0</td>
                                        <td class="px-4 py-2 border border-slate-200" id="wed-dash-tot-bayar">Rp 0</td>
                                        <td class="px-4 py-2 border border-slate-200" id="wed-dash-tot-sisa">Rp 0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 class="font-bold text-slate-800 mb-2">PROGRESS PERSIAPAN (CHECKLIST)</h3>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-sm text-left border-collapse border border-slate-200">
                                        <thead class="bg-slate-800 text-white">
                                            <tr>
                                                <th class="px-4 py-2 border border-slate-700">Status Persiapan</th>
                                                <th class="px-4 py-2 border border-slate-700 text-center">Jumlah Tugas</th>
                                                <th class="px-4 py-2 border border-slate-700 text-right">Persentase</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white">
                                            <tr><td class="px-4 py-2 border border-slate-200">Selesai (Done)</td><td class="px-4 py-2 border border-slate-200 text-center" id="wed-chk-done">0</td><td class="px-4 py-2 border border-slate-200 text-right" id="wed-chk-done-pct">0.0%</td></tr>
                                            <tr><td class="px-4 py-2 border border-slate-200">Dalam Proses (In Progress)</td><td class="px-4 py-2 border border-slate-200 text-center" id="wed-chk-prog">0</td><td class="px-4 py-2 border border-slate-200 text-right" id="wed-chk-prog-pct">0.0%</td></tr>
                                            <tr><td class="px-4 py-2 border border-slate-200">Belum Dimulai (Not Started)</td><td class="px-4 py-2 border border-slate-200 text-center" id="wed-chk-not">0</td><td class="px-4 py-2 border border-slate-200 text-right" id="wed-chk-not-pct">0.0%</td></tr>
                                            <tr class="font-bold bg-slate-50"><td class="px-4 py-2 border border-slate-200">Total Tugas</td><td class="px-4 py-2 border border-slate-200 text-center" id="wed-chk-tot">0</td><td class="px-4 py-2 border border-slate-200 text-right">100.0%</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 mb-2">RINGKASAN TAMU & RSVP</h3>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-sm text-left border-collapse border border-slate-200">
                                        <tbody class="bg-white">
                                            <tr><td class="px-4 py-2 border border-slate-200 bg-slate-50">Total Target Tamu</td><td class="px-4 py-2 border border-slate-200 text-right font-bold bg-slate-50" id="wed-guest-tot">0</td></tr>
                                            <tr><td class="px-4 py-2 border border-slate-200">Konfirmasi Hadir</td><td class="px-4 py-2 border border-slate-200 text-right text-blue-600 font-medium" id="wed-guest-hadir">0</td></tr>
                                            <tr><td class="px-4 py-2 border border-slate-200">Tidak Hadir</td><td class="px-4 py-2 border border-slate-200 text-right text-rose-600 font-medium" id="wed-guest-tidak">0</td></tr>
                                            <tr><td class="px-4 py-2 border border-slate-200">Belum Konfirmasi</td><td class="px-4 py-2 border border-slate-200 text-right text-slate-500 font-medium" id="wed-guest-belum">0</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div>
                                <h3 class="font-bold text-slate-800 mb-2">RINCIAN BIAYA PER KATEGORI</h3>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-xs text-left border-collapse border border-slate-200">
                                        <thead class="bg-slate-800 text-white">
                                            <tr>
                                                <th class="px-2 py-2 border border-slate-700 w-1/3">Kategori Pengeluaran</th>
                                                <th class="px-2 py-2 border border-slate-700 text-right">Estimasi Biaya</th>
                                                <th class="px-2 py-2 border border-slate-700 text-right">Realisasi Biaya</th>
                                                <th class="px-2 py-2 border border-slate-700 text-right">Selisih</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-slate-200" id="wed-dash-budget-tbody">
                                            <!-- JS will populate this -->
                                        </tbody>
                                        <tfoot class="bg-slate-100 font-bold border-t border-slate-200">
                                            <tr>
                                                <td class="px-2 py-2 border border-slate-200">TOTAL</td>
                                                <td class="px-2 py-2 text-right border border-slate-200" id="wed-dash-budget-tot-est">Rp 0</td>
                                                <td class="px-2 py-2 text-right border border-slate-200" id="wed-dash-budget-tot-real">Rp 0</td>
                                                <td class="px-2 py-2 text-right border border-slate-200" id="wed-dash-budget-tot-selisih">Rp 0</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <h3 class="font-bold text-slate-800 mb-2">Perbandingan Estimasi vs Realisasi Biaya</h3>
                                <div class="border border-slate-200 p-4 rounded-xl bg-white flex-1 relative" style="min-height: 350px;">
                                    <canvas id="wedBudgetChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Wed Tab: Checklist -->
                <div id="view-wed-checklist" class="wedding-view hidden">
                    <div class="card p-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h3 class="text-lg font-bold">Checklist Persiapan</h3>
                            <button onclick="document.getElementById('wed-chk-modal').classList.remove('hidden')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2">
                                <i data-lucide="plus" class="w-4 h-4"></i> Tambah Tugas
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 text-slate-500 text-sm">
                                        <th class="px-4 py-3 font-medium">Tugas</th>
                                        <th class="px-4 py-3 font-medium">Status</th>
                                        <th class="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="wed-chk-table" class="text-sm divide-y divide-slate-100"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Wed Tab: Anggaran -->
                <div id="view-wed-anggaran" class="wedding-view hidden">
                    <div class="card p-6">
                        <h3 class="text-lg font-bold mb-4">Update Anggaran & Pengeluaran</h3>
                        <p class="text-sm text-slate-500 mb-6">Masukkan estimasi dan realisasi biaya untuk setiap kategori. Realisasi pengeluaran akan otomatis disinkronkan ke Cashflow utama.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="wed-anggaran-inputs">
                            <!-- Populated by JS -->
                        </div>
                        <button onclick="saveWeddingAnggaran()" class="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1">Simpan Perubahan Anggaran</button>
                    </div>
                </div>

                <!-- Wed Tab: Tamu -->
                <div id="view-wed-tamu" class="wedding-view hidden">
                    <div class="card p-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h3 class="text-lg font-bold">Daftar Tamu</h3>
                            <button onclick="document.getElementById('wed-tamu-modal').classList.remove('hidden')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2">
                                <i data-lucide="plus" class="w-4 h-4"></i> Tambah Tamu
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 text-slate-500 text-sm">
                                        <th class="px-4 py-3 font-medium">Nama Tamu</th>
                                        <th class="px-4 py-3 font-medium">Status RSVP</th>
                                        <th class="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="wed-tamu-table" class="text-sm divide-y divide-slate-100"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Wed Tab: Vendor -->
                <div id="view-wed-vendor" class="wedding-view hidden">
                    <div class="card p-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h3 class="text-lg font-bold">Direktori Vendor (Deal)</h3>
                            <button onclick="openWedVendorModal('deal')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2">
                                <i data-lucide="plus" class="w-4 h-4"></i> Tambah Vendor
                            </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="wed-vendor-list">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>

                <!-- Wed Tab: Kandidat -->
                <div id="view-wed-kandidat" class="wedding-view hidden">
                    <div class="card p-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h3 class="text-lg font-bold">List Kandidat Vendor</h3>
                            <button onclick="openWedVendorModal('kandidat')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2">
                                <i data-lucide="plus" class="w-4 h-4"></i> Tambah Kandidat
                            </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="wed-kandidat-list">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>

                <!-- Wed Tab: Seserahan -->
                <div id="view-wed-seserahan" class="wedding-view hidden">
                    <div class="card p-6">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h3 class="text-lg font-bold">Detail Seserahan & Mahar</h3>
                            <button onclick="document.getElementById('wed-ses-modal').classList.remove('hidden')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2">
                                <i data-lucide="plus" class="w-4 h-4"></i> Tambah Item
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 text-slate-500 text-sm">
                                        <th class="px-4 py-3 font-medium">Item</th>
                                        <th class="px-4 py-3 font-medium">Status</th>
                                        <th class="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="wed-ses-table" class="text-sm divide-y divide-slate-100"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
"@
$content = $content -replace '(?s)<!-- Married Budget Section -->\s*<section id="married".*?</section>', $section_married_new

# 3. Modals HTML
$modals_html = @"
    <!-- Wedding Checklist Modal -->
    <div id="wed-chk-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-lg text-slate-900">Tambah Tugas</h3>
                <button type="button" onclick="document.getElementById('wed-chk-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x"></i></button>
            </div>
            <form id="wed-chk-form" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Nama Tugas</label>
                    <input type="text" id="wed-chk-name" required class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select id="wed-chk-status" required class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Not Started">Belum Dimulai (Not Started)</option>
                        <option value="In Progress">Dalam Proses (In Progress)</option>
                        <option value="Done">Selesai (Done)</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors">Simpan Tugas</button>
            </form>
        </div>
    </div>

    <!-- Wedding Guest Modal -->
    <div id="wed-tamu-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-lg text-slate-900">Tambah Tamu</h3>
                <button type="button" onclick="document.getElementById('wed-tamu-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x"></i></button>
            </div>
            <form id="wed-tamu-form" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Nama Tamu</label>
                    <input type="text" id="wed-tamu-name" required class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Status RSVP</label>
                    <select id="wed-tamu-status" required class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Belum Konfirmasi">Belum Konfirmasi</option>
                        <option value="Hadir">Konfirmasi Hadir</option>
                        <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors">Simpan Tamu</button>
            </form>
        </div>
    </div>

    <!-- Wedding Vendor Modal -->
    <div id="wed-vendor-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-lg text-slate-900">Tambah Vendor</h3>
                <button type="button" onclick="document.getElementById('wed-vendor-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x"></i></button>
            </div>
            <form id="wed-vendor-form" class="p-6 space-y-4">
                <input type="hidden" id="wed-vendor-type">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                    <input type="text" id="wed-vendor-cat" required placeholder="Catering / Dekorasi / dsb" class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Nama Vendor</label>
                    <input type="text" id="wed-vendor-name" required class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Kontak / IG / Info</label>
                    <input type="text" id="wed-vendor-contact" class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors">Simpan Vendor</button>
            </form>
        </div>
    </div>

    <!-- Wedding Seserahan Modal -->
    <div id="wed-ses-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-lg text-slate-900">Tambah Seserahan</h3>
                <button type="button" onclick="document.getElementById('wed-ses-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x"></i></button>
            </div>
            <form id="wed-ses-form" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Item / Barang</label>
                    <input type="text" id="wed-ses-item" required class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select id="wed-ses-status" class="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Belum Dibeli">Belum Dibeli</option>
                        <option value="Sudah Dibeli">Sudah Dibeli</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors">Simpan Item</button>
            </form>
        </div>
    </div>

    <div id="goal-modal"
"@

$content = $content.Replace('<div id="goal-modal"', $modals_html)

# 4. JS Logic
$js_new = @"
        let wedChartInstance = null;

        window.switchWeddingTab = function(tabId) {
            document.querySelectorAll('.wedding-view').forEach(el => el.classList.remove('block'));
            document.querySelectorAll('.wedding-view').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.wedding-tab').forEach(el => {
                el.classList.remove('bg-blue-50', 'text-blue-700', 'border-b-2', 'border-blue-600');
                el.classList.add('text-slate-500');
            });
            
            document.getElementById(`view-wed-`+tabId).classList.remove('hidden');
            document.getElementById(`view-wed-`+tabId).classList.add('block');
            
            const btn = document.getElementById(`tab-wed-`+tabId);
            btn.classList.remove('text-slate-500');
            btn.classList.add('bg-blue-50', 'text-blue-700', 'border-b-2', 'border-blue-600');
            
            if(tabId === 'dashboard') {
                updateWeddingDashboard();
            }
        }

        function initWeddingPlannerUI() {
            // Check list
            renderWedChecklist();
            // Guests
            renderWedTamu();
            // Vendors
            renderWedVendors();
            // Seserahan
            renderWedSeserahan();
            // Anggaran form
            renderWedAnggaranForm();
            // Dashboard
            updateWeddingDashboard();
        }

        function updateWeddingDashboard() {
            // Dashboard Metrics
            let totalEst = 0;
            let totalReal = 0;
            const labels = [];
            const dataEst = [];
            const dataReal = [];
            
            const tbody = document.getElementById('wed-dash-budget-tbody');
            tbody.innerHTML = '';
            
            for (const key in state.wedding.budget) {
                const cat = state.wedding.budget[key];
                totalEst += cat.estimasi;
                totalReal += cat.realisasi;
                
                labels.push(cat.name.split('.')[1].trim().split(' ')[0]); // shortened label
                dataEst.push(cat.estimasi);
                dataReal.push(cat.realisasi);
                
                const selisih = cat.estimasi - cat.realisasi;
                tbody.innerHTML += `
                    <tr>
                        <td class="px-2 py-2 border border-slate-200">`+cat.name+`</td>
                        <td class="px-2 py-2 border border-slate-200 text-right">`+formatIDR(cat.estimasi)+`</td>
                        <td class="px-2 py-2 border border-slate-200 text-right">`+formatIDR(cat.realisasi)+`</td>
                        <td class="px-2 py-2 border border-slate-200 text-right `+(selisih >= 0 ? 'text-emerald-600' : 'text-rose-600')+` font-medium">`+formatIDR(selisih)+`</td>
                    </tr>
                `;
            }
            
            const totalSelisih = totalEst - totalReal;
            document.getElementById('wed-dash-tot-est').innerText = formatIDR(totalEst);
            document.getElementById('wed-dash-tot-real').innerText = formatIDR(totalReal);
            document.getElementById('wed-dash-tot-selisih').innerText = formatIDR(totalSelisih);
            document.getElementById('wed-dash-tot-selisih').className = `px-4 py-2 border border-slate-200 font-bold ` + (totalSelisih >= 0 ? 'text-emerald-600' : 'text-rose-600');
            document.getElementById('wed-dash-tot-bayar').innerText = formatIDR(totalReal);
            document.getElementById('wed-dash-tot-sisa').innerText = formatIDR(totalEst - totalReal > 0 ? totalEst - totalReal : 0);
            
            document.getElementById('wed-dash-budget-tot-est').innerText = formatIDR(totalEst);
            document.getElementById('wed-dash-budget-tot-real').innerText = formatIDR(totalReal);
            document.getElementById('wed-dash-budget-tot-selisih').innerText = formatIDR(totalSelisih);
            
            // Checklist
            const chkDone = state.wedding.checklist.filter(c => c.status === 'Done').length;
            const chkProg = state.wedding.checklist.filter(c => c.status === 'In Progress').length;
            const chkNot = state.wedding.checklist.filter(c => c.status === 'Not Started').length;
            const chkTot = state.wedding.checklist.length;
            
            document.getElementById('wed-chk-done').innerText = chkDone;
            document.getElementById('wed-chk-prog').innerText = chkProg;
            document.getElementById('wed-chk-not').innerText = chkNot;
            document.getElementById('wed-chk-tot').innerText = chkTot;
            
            document.getElementById('wed-chk-done-pct').innerText = chkTot > 0 ? (chkDone/chkTot*100).toFixed(1) + '%' : '0.0%';
            document.getElementById('wed-chk-prog-pct').innerText = chkTot > 0 ? (chkProg/chkTot*100).toFixed(1) + '%' : '0.0%';
            document.getElementById('wed-chk-not-pct').innerText = chkTot > 0 ? (chkNot/chkTot*100).toFixed(1) + '%' : '0.0%';
            
            // Guests
            const guestHadir = state.wedding.guests.filter(g => g.status === 'Hadir').length;
            const guestTidak = state.wedding.guests.filter(g => g.status === 'Tidak Hadir').length;
            const guestBelum = state.wedding.guests.filter(g => g.status === 'Belum Konfirmasi').length;
            const guestTot = state.wedding.guests.length;
            
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

        function renderWedAnggaranForm() {
            const container = document.getElementById('wed-anggaran-inputs');
            container.innerHTML = '';
            for (const key in state.wedding.budget) {
                const cat = state.wedding.budget[key];
                container.innerHTML += `
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 class="font-bold text-slate-800 mb-3 text-sm">`+cat.name+`</h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs font-medium text-slate-600 mb-1">Estimasi (Rp)</label>
                                <input type="text" id="wed-est-`+key+`" value="`+new Intl.NumberFormat('id-ID').format(cat.estimasi)+`" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" oninput="formatCurrencyInput(this)">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-600 mb-1">Realisasi (Rp)</label>
                                <input type="text" id="wed-real-`+key+`" value="`+new Intl.NumberFormat('id-ID').format(cat.realisasi)+`" class="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" oninput="formatCurrencyInput(this)">
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        window.saveWeddingAnggaran = function() {
            for (const key in state.wedding.budget) {
                const newEst = parseIDR(document.getElementById(`wed-est-`+key).value);
                const newReal = parseIDR(document.getElementById(`wed-real-`+key).value);
                
                const oldReal = state.wedding.budget[key].realisasi;
                state.wedding.budget[key].estimasi = newEst;
                state.wedding.budget[key].realisasi = newReal;
                
                if (newReal > oldReal) {
                    const diff = newReal - oldReal;
                    state.transactions.push({
                        id: generateId(),
                        date: new Date().toISOString().split('T')[0],
                        type: 'expense',
                        category: `Wedding: ` + state.wedding.budget[key].name,
                        amount: diff,
                        houseRef: 'Wedding'
                    });
                }
            }
            state.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            saveData();
            updateAllViews();
            alert('Anggaran & Pengeluaran berhasil disimpan dan disinkronkan!');
        }

        // Checklist Forms
        document.getElementById('wed-chk-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('wed-chk-name').value;
            const status = document.getElementById('wed-chk-status').value;
            state.wedding.checklist.push({ id: generateId(), name, status });
            saveData();
            renderWedChecklist();
            document.getElementById('wed-chk-modal').classList.add('hidden');
            document.getElementById('wed-chk-form').reset();
            if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) updateWeddingDashboard();
        });
        
        window.deleteWedChk = function(id) {
            if(confirm('Hapus tugas ini?')) {
                state.wedding.checklist = state.wedding.checklist.filter(c => c.id !== id);
                saveData();
                renderWedChecklist();
                if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) updateWeddingDashboard();
            }
        }
        
        window.toggleWedChk = function(id, selectElem) {
            const item = state.wedding.checklist.find(c => c.id === id);
            if(item) {
                item.status = selectElem.value;
                saveData();
                renderWedChecklist();
                if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) updateWeddingDashboard();
            }
        }

        function renderWedChecklist() {
            const tbody = document.getElementById('wed-chk-table');
            tbody.innerHTML = '';
            if(state.wedding.checklist.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500">Belum ada tugas.</td></tr>';
            } else {
                state.wedding.checklist.forEach(c => {
                    let stColor = c.status === 'Done' ? 'text-emerald-600 bg-emerald-50' : (c.status === 'In Progress' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-100');
                    tbody.innerHTML += `
                        <tr>
                            <td class="px-4 py-3 font-medium">`+c.name+`</td>
                            <td class="px-4 py-3">
                                <select onchange="toggleWedChk('`+c.id+`', this)" class="`+stColor+` text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer border border-transparent hover:border-slate-300">
                                    <option value="Not Started" `+(c.status === 'Not Started' ? 'selected' : '')+`>Not Started</option>
                                    <option value="In Progress" `+(c.status === 'In Progress' ? 'selected' : '')+`>In Progress</option>
                                    <option value="Done" `+(c.status === 'Done' ? 'selected' : '')+`>Done</option>
                                </select>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="deleteWedChk('`+c.id+`')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </td>
                        </tr>
                    `;
                });
            }
            lucide.createIcons();
        }

        // Guest Forms
        document.getElementById('wed-tamu-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('wed-tamu-name').value;
            const status = document.getElementById('wed-tamu-status').value;
            state.wedding.guests.push({ id: generateId(), name, status });
            saveData();
            renderWedTamu();
            document.getElementById('wed-tamu-modal').classList.add('hidden');
            document.getElementById('wed-tamu-form').reset();
            if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) updateWeddingDashboard();
        });
        
        window.deleteWedTamu = function(id) {
            if(confirm('Hapus tamu ini?')) {
                state.wedding.guests = state.wedding.guests.filter(g => g.id !== id);
                saveData();
                renderWedTamu();
                if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) updateWeddingDashboard();
            }
        }
        
        window.toggleWedTamu = function(id, selectElem) {
            const item = state.wedding.guests.find(g => g.id === id);
            if(item) {
                item.status = selectElem.value;
                saveData();
                renderWedTamu();
                if(!document.getElementById('view-wed-dashboard').classList.contains('hidden')) updateWeddingDashboard();
            }
        }

        function renderWedTamu() {
            const tbody = document.getElementById('wed-tamu-table');
            tbody.innerHTML = '';
            if(state.wedding.guests.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500">Belum ada daftar tamu.</td></tr>';
            } else {
                state.wedding.guests.forEach(g => {
                    let stColor = g.status === 'Hadir' ? 'text-blue-600 bg-blue-50' : (g.status === 'Tidak Hadir' ? 'text-rose-600 bg-rose-50' : 'text-slate-600 bg-slate-100');
                    tbody.innerHTML += `
                        <tr>
                            <td class="px-4 py-3 font-medium">`+g.name+`</td>
                            <td class="px-4 py-3">
                                <select onchange="toggleWedTamu('`+g.id+`', this)" class="`+stColor+` text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer border border-transparent hover:border-slate-300">
                                    <option value="Belum Konfirmasi" `+(g.status === 'Belum Konfirmasi' ? 'selected' : '')+`>Belum Konfirmasi</option>
                                    <option value="Hadir" `+(g.status === 'Hadir' ? 'selected' : '')+`>Konfirmasi Hadir</option>
                                    <option value="Tidak Hadir" `+(g.status === 'Tidak Hadir' ? 'selected' : '')+`>Tidak Hadir</option>
                                </select>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="deleteWedTamu('`+g.id+`')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </td>
                        </tr>
                    `;
                });
            }
            lucide.createIcons();
        }

        // Vendor Forms
        window.openWedVendorModal = function(type) {
            document.getElementById('wed-vendor-type').value = type; // deal or kandidat
            document.getElementById('wed-vendor-modal').classList.remove('hidden');
        }

        document.getElementById('wed-vendor-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('wed-vendor-type').value;
            const category = document.getElementById('wed-vendor-cat').value;
            const name = document.getElementById('wed-vendor-name').value;
            const contact = document.getElementById('wed-vendor-contact').value;
            
            const v = { id: generateId(), category, name, contact };
            if(type === 'deal') {
                state.wedding.vendors.push(v);
            } else {
                state.wedding.kandidatVendors.push(v);
            }
            saveData();
            renderWedVendors();
            document.getElementById('wed-vendor-modal').classList.add('hidden');
            document.getElementById('wed-vendor-form').reset();
        });
        
        window.deleteWedVendor = function(id, type) {
            if(confirm('Hapus vendor ini?')) {
                if(type === 'deal') {
                    state.wedding.vendors = state.wedding.vendors.filter(v => v.id !== id);
                } else {
                    state.wedding.kandidatVendors = state.wedding.kandidatVendors.filter(v => v.id !== id);
                }
                saveData();
                renderWedVendors();
            }
        }

        function renderWedVendors() {
            const listDeal = document.getElementById('wed-vendor-list');
            const listKandidat = document.getElementById('wed-kandidat-list');
            listDeal.innerHTML = '';
            listKandidat.innerHTML = '';
            
            if(state.wedding.vendors.length === 0) listDeal.innerHTML = '<p class="text-slate-500 text-sm col-span-full">Belum ada vendor deal.</p>';
            state.wedding.vendors.forEach(v => {
                listDeal.innerHTML += `
                    <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 relative group">
                        <button onclick="deleteWedVendor('`+v.id+`', 'deal')" class="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        <span class="text-xs font-bold text-blue-600 mb-1 block uppercase">`+v.category+`</span>
                        <h4 class="font-bold text-slate-900 mb-1">`+v.name+`</h4>
                        <p class="text-sm text-slate-600"><i data-lucide="info" class="w-3 h-3 inline mr-1"></i>`+(v.contact||'-')+`</p>
                    </div>
                `;
            });
            
            if(state.wedding.kandidatVendors.length === 0) listKandidat.innerHTML = '<p class="text-slate-500 text-sm col-span-full">Belum ada kandidat vendor.</p>';
            state.wedding.kandidatVendors.forEach(v => {
                listKandidat.innerHTML += `
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">
                        <button onclick="deleteWedVendor('`+v.id+`', 'kandidat')" class="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        <span class="text-xs font-bold text-slate-500 mb-1 block uppercase">`+v.category+`</span>
                        <h4 class="font-bold text-slate-900 mb-1">`+v.name+`</h4>
                        <p class="text-sm text-slate-600"><i data-lucide="info" class="w-3 h-3 inline mr-1"></i>`+(v.contact||'-')+`</p>
                    </div>
                `;
            });
            lucide.createIcons();
        }

        // Seserahan Forms
        document.getElementById('wed-ses-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const item = document.getElementById('wed-ses-item').value;
            const status = document.getElementById('wed-ses-status').value;
            state.wedding.seserahan.push({ id: generateId(), item, status });
            saveData();
            renderWedSeserahan();
            document.getElementById('wed-ses-modal').classList.add('hidden');
            document.getElementById('wed-ses-form').reset();
        });
        
        window.deleteWedSes = function(id) {
            if(confirm('Hapus item ini?')) {
                state.wedding.seserahan = state.wedding.seserahan.filter(s => s.id !== id);
                saveData();
                renderWedSeserahan();
            }
        }
        
        window.toggleWedSes = function(id, selectElem) {
            const s = state.wedding.seserahan.find(x => x.id === id);
            if(s) {
                s.status = selectElem.value;
                saveData();
                renderWedSeserahan();
            }
        }

        function renderWedSeserahan() {
            const tbody = document.getElementById('wed-ses-table');
            tbody.innerHTML = '';
            if(state.wedding.seserahan.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500">Belum ada daftar seserahan.</td></tr>';
            } else {
                state.wedding.seserahan.forEach(s => {
                    let stColor = s.status === 'Sudah Dibeli' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-100';
                    tbody.innerHTML += `
                        <tr>
                            <td class="px-4 py-3 font-medium">`+s.item+`</td>
                            <td class="px-4 py-3">
                                <select onchange="toggleWedSes('`+s.id+`', this)" class="`+stColor+` text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer border border-transparent hover:border-slate-300">
                                    <option value="Belum Dibeli" `+(s.status === 'Belum Dibeli' ? 'selected' : '')+`>Belum Dibeli</option>
                                    <option value="Sudah Dibeli" `+(s.status === 'Sudah Dibeli' ? 'selected' : '')+`>Sudah Dibeli</option>
                                </select>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="deleteWedSes('`+s.id+`')" class="text-slate-400 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </td>
                        </tr>
                    `;
                });
            }
            lucide.createIcons();
        }
"@

$content = $content -replace '(?s)const mbCategories = \[.*?\s*\}\s*window\.updateMarriedBudget = function\(\) \{.*?\s*\}\s*function renderMarriedBudgetProgress\(\) \{.*?\s*\}', $js_new

# 5. Fix UI calls
$content = $content.Replace("initMarriedBudgetUI();", "initWeddingPlannerUI();")
$content = $content.Replace("renderMarriedBudgetProgress();", "")

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)

Write-Host "Refactoring completed successfully!"
