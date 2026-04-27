// Dashboard shared JS
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle (mobile)
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-toggle');

    menuBtn?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
    });

    // Animate progress bars
    document.querySelectorAll('.progress-bar-fill').forEach(bar => {
        const target = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = target; }, 300);
    });

    // Animate metric values
    document.querySelectorAll('.metric-value').forEach(el => {
        const val = parseInt(el.textContent);
        if (!isNaN(val) && val > 0 && val < 10000) {
            let cur = 0;
            const step = val / 40;
            const timer = setInterval(() => {
                cur += step;
                if (cur >= val) { cur = val; clearInterval(timer); }
                el.textContent = Math.floor(cur).toLocaleString();
            }, 30);
        }
    });
});
