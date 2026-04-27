/**
 * HealthAI - Theme Manager
 * Handles Dark/Light mode toggling and persistence
 */

// Execute immediately to prevent flash of wrong theme
(function initTheme() {
    const savedTheme = localStorage.getItem('healthai_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark if no saved theme and system prefers dark, else light
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
})();

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    localStorage.setItem('healthai_theme', newTheme);
    updateThemeIcons();
}

function updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const themeIcons = document.querySelectorAll('.theme-icon-indicator');
    
    themeIcons.forEach(icon => {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Run when DOM is fully loaded to ensure the icons are updated properly
document.addEventListener('DOMContentLoaded', updateThemeIcons);
