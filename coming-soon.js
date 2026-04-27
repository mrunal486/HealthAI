/**
 * coming-soon.js
 * Handles clicks on elements with the 'coming-soon' class to show a sleek notification and prevent navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject JSON styles/DOM if not present
    let toast = document.getElementById('cs-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cs-toast';
        toast.className = 'cs-toast-container';
        toast.innerHTML = `
            <div class="cs-toast-icon">
                <i class="fas fa-tools"></i>
            </div>
            <div class="cs-toast-content">
                <h4>Coming Soon</h4>
                <p>This feature is currently under development.</p>
            </div>
        `;
        document.body.appendChild(toast);
    }

    let toastTimer;

    // 2. Attach click listeners
    const attachComingSoonListeners = () => {
        const elements = document.querySelectorAll('.coming-soon');
        elements.forEach(el => {
            // Remove existing to avoid dupes if called multiple times
            el.removeEventListener('click', showComingSoon);
            el.addEventListener('click', showComingSoon);
            
            // Add visual badge if it's a sidebar link and doesn't already have one
            if (el.classList.contains('sidebar-link') && !el.querySelector('.coming-soon-badge')) {
                const badge = document.createElement('span');
                badge.className = 'coming-soon-badge';
                badge.textContent = 'Soon';
                el.appendChild(badge);
            }
        });
    }

    const showComingSoon = (e) => {
        e.preventDefault(); // Stop navigation
        e.stopPropagation(); // Prevent other handlers
        
        const t = document.getElementById('cs-toast');
        if(!t) return;

        // Reset animation
        t.classList.remove('show');
        clearTimeout(toastTimer);

        // Show
        setTimeout(() => {
            t.classList.add('show');
            
            // Hide after 3 seconds
            toastTimer = setTimeout(() => {
                t.classList.remove('show');
            }, 3000);
        }, 10);
    };

    attachComingSoonListeners();
    
    // Export globally in case we need to re-attach after dynamic DOM updates
    window.HealthAIComingSoon = {
        reInit: attachComingSoonListeners,
        show: () => showComingSoon({preventDefault:()=>{}, stopPropagation:()=>{}})
    };
});
