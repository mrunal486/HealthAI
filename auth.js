/**
 * HealthAI Auth Manager
 * Lightweight localStorage-based auth simulation for the demo.
 */
(function () {
    const STORAGE_KEY = 'healthai_user';

    const ROLE_CONFIG = {
        patient: {
            label: 'Patient',
            dashboard: 'patient.html',
            icon: 'fa-user',
            color: '#2563EB',
        },
        doctor: {
            label: 'Doctor',
            dashboard: 'doctor-dashboard.html',
            icon: 'fa-user-md',
            color: '#14B8A6',
        },
        hospital: {
            label: 'Hospital Admin',
            dashboard: 'hospital-dashboard.html',
            icon: 'fa-hospital',
            color: '#F97316',
        },
        admin: {
            label: 'System Admin',
            dashboard: 'admin-dashboard.html',
            icon: 'fa-shield-alt',
            color: '#8B5CF6',
        },
    };

    window.HealthAIAuth = {
        /** Save user to localStorage */
        setUser(role, name, email, extra = {}) {
            const user = { role, name, email, extra, loginTime: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            return user;
        },

        /** Get current user object or null */
        getUser() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        },

        /** Check if someone is logged in */
        isLoggedIn() {
            return Boolean(this.getUser());
        },

        /** Logout: clear state and go home */
        logout() {
            localStorage.removeItem(STORAGE_KEY);
            window.location.href = 'index.html';
        },

        /** Get role config */
        getRoleConfig(role) {
            return ROLE_CONFIG[role] || null;
        },

        /**
         * Guard a page — redirect to login if user not in allowedRoles.
         * Pass empty array [] to allow any logged-in user.
         */
        guardPage(allowedRoles = []) {
            const user = this.getUser();
            if (!user) {
                window.location.href = 'login.html';
                return null;
            }
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                // Redirect to user's correct dashboard
                const cfg = ROLE_CONFIG[user.role];
                if (cfg) window.location.href = cfg.dashboard;
                return null;
            }
            return user;
        },

        /** Get the correct dashboard URL for a role */
        getDashboard(role) {
            return (ROLE_CONFIG[role] || {}).dashboard || 'index.html';
        },

        /**
         * Inject user info into a sidebar/topbar element.
         * Looks for elements with data-auth-name, data-auth-role, data-auth-avatar.
         */
        injectUserUI() {
            const user = this.getUser();
            if (!user) return;
            const cfg = ROLE_CONFIG[user.role] || {};
            const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

            document.querySelectorAll('[data-auth-name]').forEach(el => {
                el.textContent = user.name;
            });
            document.querySelectorAll('[data-auth-role]').forEach(el => {
                el.textContent = cfg.label || user.role;
            });
            document.querySelectorAll('[data-auth-avatar]').forEach(el => {
                el.textContent = initials;
                if (cfg.color) el.style.background = `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color})`;
            });
            document.querySelectorAll('[data-auth-email]').forEach(el => {
                el.textContent = user.email;
            });
        },

        /**
         * Update the landing page navbar based on auth state.
         * Called on index.html only.
         */
        renderLandingNav() {
            const user = this.getUser();
            const navActions = document.getElementById('nav-actions');
            if (!navActions) return;

            if (!user) {
                navActions.innerHTML = `
                    <a href="login.html" class="btn btn-primary" id="nav-login-btn">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </a>`;
            } else {
                const cfg = ROLE_CONFIG[user.role] || {};
                const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                navActions.innerHTML = `
                    <a href="${cfg.dashboard || '#'}" class="btn btn-outline" id="nav-dashboard-btn">
                        <i class="fas ${cfg.icon || 'fa-th-large'}"></i> My Dashboard
                    </a>
                    <div class="nav-user-chip" id="nav-user-chip">
                        <div class="nav-avatar" style="background:linear-gradient(135deg,${cfg.color || '#2563EB'}cc,${cfg.color || '#2563EB'})">${initials}</div>
                        <span>${user.name.split(' ')[0]}</span>
                        <button onclick="HealthAIAuth.logout()" class="btn btn-sm nav-logout-btn" id="nav-logout-btn" title="Logout">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>`;
            }
        },

        /**
         * Add a mobile hamburger toggle to .sidebar-based dashboards.
         * Call once in DOMContentLoaded.
         */
        initMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            const topbar = document.querySelector('.topbar');
            if (!sidebar || !topbar) return;

            // Inject hamburger into topbar-left
            const topbarLeft = topbar.querySelector('.topbar-left');
            if (topbarLeft && !document.getElementById('mob-hamburger')) {
                const ham = document.createElement('button');
                ham.id = 'mob-hamburger';
                ham.className = 'mob-hamburger-btn';
                ham.setAttribute('aria-label', 'Open menu');
                ham.innerHTML = '<i class="fas fa-bars"></i>';
                topbarLeft.insertBefore(ham, topbarLeft.firstChild);
            }

            // Overlay
            let overlay = document.getElementById('sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'sidebar-overlay';
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
            }

            function openSidebar() {
                sidebar.classList.add('mobile-open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            function closeSidebar() {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            document.getElementById('mob-hamburger').addEventListener('click', openSidebar);
            overlay.addEventListener('click', closeSidebar);

            // Close on nav link click (mobile)
            sidebar.querySelectorAll('.sidebar-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) closeSidebar();
                });
            });
        },
    };
})();
