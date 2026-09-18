// --- GOALS LOGIC ---
document.getElementById('goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('goal-name').value;
    const target = window.parseIDR(document.getElementById('goal-target').value);
    const current = window.parseIDR(document.getElementById('goal-current').value);
    const date = document.getElementById('goal-date').value;

    window.state.goals.push({ id: window.generateId(), name, target, current, date });
    window.saveData();
    
    e.target.reset();
    document.getElementById('goal-modal').classList.add('hidden');
    window.updateGoalsView();
});

window.deleteGoal = function(id) {
    if(confirm('Hapus target ini?')) {
        window.state.goals = window.state.goals.filter(g => g.id !== id);
        window.saveData();
        window.updateGoalsView();
    }
}

window.updateGoalsView = function() {
    const container = document.getElementById('goals-container');
    const emptyState = document.getElementById('goals-empty');
    container.innerHTML = '';
    
    if (window.state.goals.length === 0) emptyState.classList.remove('hidden');
    else {
        emptyState.classList.add('hidden');
        window.state.goals.forEach(g => {
            let pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
            if (pct > 100) pct = 100;

            const targetDate = new Date(g.date);
            const now = new Date();
            now.setHours(0,0,0,0);
            targetDate.setHours(0,0,0,0);
            
            const diffTime = targetDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isPassed = diffDays < 0;

            let timeText = diffDays === 0 ? 'Hari ini' : isPassed ? 'Terlewat' : `${diffDays} hari lagi`;

            container.innerHTML += `
                <div class="card p-6 flex flex-col h-full relative group">
                    <button onclick="window.deleteGoal('${g.id}')" class="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    <div class="flex-1">
                        <h3 class="font-bold text-lg text-slate-900 mb-1 pr-6">${g.name}</h3>
                        <p class="text-xs text-slate-500 mb-4 flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3 h-3"></i> ${targetDate.toLocaleDateString('id-ID')} 
                            <span class="ml-1 ${isPassed ? 'text-rose-500' : 'text-emerald-500'} font-medium">(${timeText})</span>
                        </p>
                        <div class="mb-2 flex justify-between items-end">
                            <span class="text-sm font-bold text-blue-600">${window.formatIDR(g.current)}</span>
                            <span class="text-xs text-slate-500">dari ${window.formatIDR(g.target)}</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                            <div class="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style="width: ${pct}%"></div>
                        </div>
                        <p class="text-xs text-right text-slate-500 font-medium">${pct.toFixed(1)}% Tercapai</p>
                    </div>
                </div>
            `;
        });
    }
    if (window.lucide) window.lucide.createIcons();
}
