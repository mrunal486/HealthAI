// Landing Page JS
document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    hamburger?.addEventListener('click', () => {
        const links = document.querySelector('.nav-links');
        links?.classList.toggle('open');
    });

    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });
    };

    // Intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .step, .role-card, .hero-stats').forEach(el => {
        observer.observe(el);
    });

    // Start counter when hero loads
    setTimeout(animateCounters, 1000);
});
