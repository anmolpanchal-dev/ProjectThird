/* ── Processor options by brand ── */
const processors = {
    Intel: ['Core i3 (10th Gen)', 'Core i3 (12th Gen)', 'Core i5 (10th Gen)', 'Core i5 (11th Gen)', 'Core i5 (12th Gen)', 'Core i5 (13th Gen)', 'Core i7 (10th Gen)', 'Core i7 (11th Gen)', 'Core i7 (12th Gen)', 'Core i7 (13th Gen)', 'Core i9 (12th Gen)', 'Core i9 (13th Gen)', 'Pentium / Celeron'],
    AMD: ['Ryzen 3 5000', 'Ryzen 3 7000', 'Ryzen 5 5000', 'Ryzen 5 7000', 'Ryzen 7 5000', 'Ryzen 7 7000', 'Ryzen 9 5000', 'Ryzen 9 7000', 'Threadripper'],
    'Apple Silicon': ['M1', 'M1 Pro', 'M1 Max', 'M2', 'M2 Pro', 'M2 Max', 'M3', 'M3 Pro', 'M3 Max'],
    Qualcomm: ['Snapdragon X Elite', 'Snapdragon X Plus', 'Snapdragon 8cx Gen 3'],
};

const procBrandSel = document.getElementById('proc-brand');
const procNameSel = document.getElementById('proc-name');

function populateProcessors(brand) {
    procNameSel.innerHTML = '<option value="" disabled selected>Select processor</option>';
    (processors[brand] || []).forEach(p => {
        const o = document.createElement('option'); o.value = p; o.textContent = p;
        procNameSel.appendChild(o);
    });
}

procBrandSel.addEventListener('change', () => populateProcessors(procBrandSel.value));

/* ── Validation ── */
function validate(form) {
    let ok = true;
    const rules = [
        { id: 'f-brand', el: '#brand', test: v => v !== '' },
        { id: 'f-proc-brand', el: '#proc-brand', test: v => v !== '' },
        { id: 'f-proc-name', el: '#proc-name', test: v => v !== '' },
        { id: 'f-ram', el: '[name=ram]', test: v => v && +v >= 1 && +v <= 512 },
        { id: 'f-ssd', el: '[name=ssd]', test: v => v && +v >= 0 && +v <= 8000 },
        { id: 'f-weight', el: '[name=weight]', test: v => v && +v >= 0.5 && +v <= 10 },
    ];
    rules.forEach(r => {
        const field = document.getElementById(r.id);
        const input = form.querySelector(r.el);
        const val = input ? input.value.trim() : '';
        if (!r.test(val)) { field.classList.add('error'); ok = false; }
        else { field.classList.remove('error'); }
    });
    return ok;
}

/* ── Form submit (demo mode — replace fetch block for real backend) ── */
document.getElementById('predictForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validate(this)) return;

    const btn = document.getElementById('submitBtn');
    btn.classList.add('loading');
    btn.disabled = true;

    // ── DEMO: simulate API call ──
    await new Promise(r => setTimeout(r, 1500));

    const ram = +this.querySelector('[name=ram]').value;
    const ssd = +this.querySelector('[name=ssd]').value;
    const hdd = (+this.querySelector('[name=hdd]').value) || 0;
    const graphic = (+this.querySelector('[name=graphic]').value) || 0;
    const weight = +this.querySelector('[name=weight]').value;
    const brand = this.querySelector('[name=brand]').value;
    const proc = this.querySelector('[name=processor_name]').value;
    const ts = this.querySelector('[name=touchscreen]:checked').value;

    // Simple demo formula (replace with real backend call)
    let base = 35000;
    base += ram * 600;
    base += ssd * 50;
    base += hdd * 2;
    base += graphic * 3000;
    base -= weight * 1200;
    if (['Apple', 'Razer', 'Microsoft'].includes(brand)) base *= 1.35;
    if (['MSI', 'Dell', 'Lenovo'].includes(brand)) base *= 1.1;
    if (ts === 'Yes') base += 8000;
    if (proc && proc.includes('i9')) base += 20000;
    if (proc && proc.includes('i7')) base += 10000;
    if (proc && (proc.includes('M2') || proc.includes('M3'))) base += 25000;
    base = Math.round(base / 100) * 100;

    btn.classList.remove('loading');
    btn.disabled = false;

    // Show result
    const resultCard = document.getElementById('resultCard');
    const resultPrice = document.getElementById('resultPrice');
    const resultMeta = document.getElementById('resultMeta');

    resultPrice.innerHTML = `<span>₹</span>${base.toLocaleString('en-IN')}`;
    resultMeta.innerHTML = [
        `${brand}`, `${proc || 'Unknown CPU'}`,
        `${ram}GB RAM`, `${ssd}GB SSD`,
        graphic ? `${graphic}GB GPU` : 'Integrated GPU',
        ts === 'Yes' ? 'Touchscreen' : '',
    ].filter(Boolean).map(t => `<span class="meta-pill">${t}</span>`).join('');

    resultCard.classList.add('visible');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    /* ── For real backend, replace the demo block above with:
    const fd = new FormData(this);
    const res = await fetch('/predict', { method: 'POST', body: fd });
    const data = await res.json(); // or res.text()
    resultPrice.innerHTML = `<span>₹</span>${Number(data.price).toLocaleString('en-IN')}`;
    ── */
});

/* ── Clear error on change ── */
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => el.closest('.field')?.classList.remove('error'));
    el.addEventListener('change', () => el.closest('.field')?.classList.remove('error'));
});