/**
 * AdQuench Website JavaScript
 * All interactive functionality and animations
 */

// ========================================
// Mobile Menu Toggle
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // --- MISSING: successModal definition ---
    const successModal = document.getElementById('successModal');
    // ---------------------------------------

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('animate-fade-in-down');
        });
    }

    // ========================================
    // Smooth Scrolling for Navigation Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('shadow-md');
            } else {
                nav.classList.remove('shadow-md');
            }
        });
    }

    // SUCCESS MODAL – now properly defined and handled
    window.closeModal = function() {
        if (successModal) {
            successModal.classList.add('hidden');
            successModal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    };

    // Close modal on outside click
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal && !successModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // ========================================
    // Live Counter Animation
    // ========================================
    const counters = document.querySelectorAll('.counter[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ========================================
    // Scroll Animations
    // ========================================
    const animatedElements = document.querySelectorAll('.fade-in, .card-hover, .stat-card, .testimonial-card');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });

    // ========================================
    // Bottles Pause on Hover
    // ========================================
    const bottles = document.querySelectorAll('.bottle-3d');
    bottles.forEach(bottle => {
        bottle.addEventListener('mouseenter', () => {
            bottle.style.animationPlayState = 'paused';
        });
        bottle.addEventListener('mouseleave', () => {
            bottle.style.animationPlayState = 'running';
        });
    });

    // ========================================
    // Interactive Map (Leaflet.js)
    // ========================================
    const mapElement = document.getElementById('map');
    if (mapElement && typeof L !== 'undefined') {
        // Center on Mumbai as a sample high-traffic location
        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView([19.0760, 72.8777], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        // Custom Kiosk Icon
        const kioskIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#547792; height:30px; width:30px; border-radius:50%; border:3px solid white; box-shadow:0 0 15px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center;'><i class='fas fa-tint' style='color:white; font-size:14px;'></i></div>",
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const kiosks = [
            { pos: [19.1176, 72.8481], name: "Andheri West Station", users: "5,000+" },
            { pos: [19.0178, 72.8478], name: "Dadar TT Circle", users: "8,000+" },
            { pos: [18.9218, 72.8347], name: "Gateway of India", users: "12,000+" },
            { pos: [19.0607, 72.8362], name: "Bandra Linking Road", users: "7,000+" },
            { pos: [19.1351, 72.9149], name: "Powai Hiranandani", users: "4,000+" }
        ];

        kiosks.forEach(k => {
            L.marker(k.pos, { icon: kioskIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="padding: 10px;">
                        <h4 style="font-weight:bold; color:#1A3263; margin-bottom:5px;">${k.name}</h4>
                        <p style="font-size:12px; color:#666;">Serving ${k.users} users daily</p>
                        <hr style="margin:8px 0; border:0; border-top:1px solid #eee;">
                        <span style="color:#547792; font-weight:600; font-size:12px;">Status: Online</span>
                    </div>
                `);
        });
    }

    // ========================================
    // Button Click Handlers (fixed preventDefault)
    // ========================================
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        if (!btn.type || btn.type !== 'submit') {
            btn.addEventListener('click', (e) => {
                // Prevent default anchor behavior if it's a link
                if (btn.tagName === 'A') {
                    e.preventDefault();
                }
                if (!btn.closest('form')) {
                    const text = btn.textContent.trim().toLowerCase();
                    if (text.includes('get started') || text.includes('advertise')) {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (text.includes('find')) {
                        document.getElementById('bottles')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (text.includes('view all')) {
                        showNotification('Full location map coming soon!', 'info');
                    }
                }
            });
        }
    });

    // ========================================
    // View Details Buttons (prevent form issues)
    // ========================================
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('View Details')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();      // stop any possible form submission
                e.stopPropagation();     // avoid bubbling to parent forms
                showNotification('Detailed location information coming soon!', 'info');
            });
        }
    });

});

// ========================================
// Utility Functions
// ========================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 flex items-center gap-3`;
    
    // Set colors based on type
    if (type === 'error') {
        notification.classList.add('bg-red-500', 'text-white');
        notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    } else if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else {
        notification.classList.add('bg-blue-500', 'text-white');
        notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// Dynamic Stats Update (Simulated)
// ========================================
function updateLiveStats() {
    const counter = document.querySelector('.counter[data-target="52347"]');
    if (counter) {
        let current = parseInt(counter.textContent.replace(/,/g, ''));
        current += Math.floor(Math.random() * 5);
        counter.textContent = current.toLocaleString();
    }
}

// Update stats every 10 seconds
setInterval(updateLiveStats, 10000);

// ========================================
// Parallax Effect for Hero Section
// ========================================
window.addEventListener('scroll', () => {
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const scrolled = window.pageYOffset;
        const parallaxElements = heroSection.querySelectorAll('.relative > div');
        parallaxElements.forEach(el => {
            el.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }
});

// ========================================
// Lazy Loading for Images
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Console Welcome Message
// ========================================
console.log('%c Welcome to AdQuench! ', 'background: linear-gradient(135deg, #547792, #1A3263); color: white; font-size: 20px; padding: 10px 20px; border-radius: 10px;');
console.log('%c Free Water, Smart Advertising ', 'color: #547792; font-size: 14px;');
