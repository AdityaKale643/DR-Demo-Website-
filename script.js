// ===== GOOGLE APPS SCRIPT INTEGRATION =====
// ⚠️ IMPORTANT: Paste your Google Apps Script Web App URL here
// Get your URL from: Google Apps Script > Deploy > New Deployment > Web App
// Example: https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent.html
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4fFM39juiXfyIxB-49uksuPBXFgi9zw8PKDhhzJ71Zw7tT-K-kZe-91MOVpkvfty5Lg/exec';

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal-fade');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        // Check if element is visible in viewport
        if (elementTop < window.innerHeight * 0.85 && elementBottom > 0) {
            // Calculate delay based on position
            const delay = element.getBoundingClientRect().top / window.innerHeight;
            element.style.animationDelay = Math.min(delay * 0.5, 0.3) + 's';
            element.style.opacity = '1';
        }
    });
};

// Trigger on scroll
window.addEventListener('scroll', revealOnScroll);
// Trigger on load for elements already visible
window.addEventListener('load', revealOnScroll);

// ===== SMOOTH SCROLL FUNCTIONS =====
function scrollToAppointment() {
    const appointmentSection = document.getElementById('appointment');
    appointmentSection.scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
}

// ===== FORM VALIDATION & SUBMISSION =====
const appointmentForm = document.getElementById('appointmentForm');
const successMessage = document.getElementById('successMessage');
const submitButton = appointmentForm?.querySelector('.btn-submit');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const date = document.getElementById('date').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        // Validation flags
        let isValid = true;

        // ===== VALIDATION FUNCTIONS =====
        // Name validation
        if (name.length < 3) {
            document.getElementById('nameError').textContent = 'Name must be at least 3 characters long';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }

        // Phone validation (simple check)
        const phoneRegex = /^[0-9\s\-\(\)\+]+$/;
        if (!phoneRegex.test(phone) || phone.length < 10) {
            document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
            isValid = false;
        }

        // Date validation
        if (!date) {
            document.getElementById('dateError').textContent = 'Please select a date';
            isValid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                document.getElementById('dateError').textContent = 'Please select a future date';
                isValid = false;
            }
        }

        // Service validation
        if (!service) {
            document.getElementById('serviceError').textContent = 'Please select a service';
            isValid = false;
        }

        // If validation fails, stop here
        if (!isValid) {
            return;
        }

        // ===== FORM IS VALID - SUBMIT TO GOOGLE APPS SCRIPT =====
        try {
            // Show loading state
            showLoadingState();

            // Prepare form data
            const formData = {
                name,
                email,
                phone,
                date,
                service,
                message,
                timestamp: new Date().toLocaleString()
            };

            console.log('📤 Submitting form data:', formData);

            // Check if URL is configured
            if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') {
                throw new Error('Google Apps Script URL not configured. Please update GOOGLE_APPS_SCRIPT_URL in script.js');
            }

            // Submit to Google Apps Script
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                body: FormData.fromObject(formData)
            });

            // Parse response
            const result = await response.json();
            
            console.log('✅ Response from Google Apps Script:', result);

            // Check if submission was successful
            if (response.ok && result.status === 'success') {
                // Show success message
                showSuccessMessage();

                // Reset form
                appointmentForm.reset();

                // Log success
                console.log('✅ Form submitted successfully!', formData);

                // Hide success message after 6 seconds
                setTimeout(() => {
                    hideSuccessMessage();
                }, 6000);

                // Scroll to success message
                setTimeout(() => {
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            } else {
                throw new Error(result.message || 'Form submission failed. Please try again.');
            }

        } catch (error) {
            console.error('❌ Form submission error:', error);
            showErrorMessage(error.message || 'An error occurred while submitting the form. Please try again later.');
            hideLoadingState();
        }
    });
}

// ===== HELPER FUNCTION: FormData.fromObject =====
// Polyfill to convert object to FormData (needed for Google Apps Script)
if (!FormData.fromObject) {
    FormData.fromObject = function(obj) {
        const formData = new FormData();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                formData.append(key, obj[key]);
            }
        }
        return formData;
    };
}

// ===== LOADING STATE FUNCTIONS =====
function showLoadingState() {
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.style.opacity = '0.7';
    }
    if (successMessage) {
        successMessage.classList.remove('show');
    }
}

function hideLoadingState() {
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Book Appointment';
        submitButton.style.opacity = '1';
    }
}

// ===== SUCCESS MESSAGE FUNCTION =====
function showSuccessMessage() {
    if (successMessage) {
        successMessage.classList.add('show');
        hideLoadingState();
    }
}

function hideSuccessMessage() {
    if (successMessage) {
        successMessage.classList.remove('show');
    }
}

// ===== ERROR MESSAGE FUNCTION =====
function showErrorMessage(errorText) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-alert';
    errorContainer.innerHTML = `
        <div class="error-alert-content">
            <i class="fas fa-exclamation-circle"></i>
            <p>${errorText}</p>
            <button class="error-close-btn" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Insert before form
    appointmentForm.parentElement.insertBefore(errorContainer, appointmentForm);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (errorContainer.parentElement) {
            errorContainer.remove();
        }
    }, 8000);
    
    console.error('Error displayed to user:', errorText);
}

// ===== PARALLAX EFFECT =====
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    if (hero) {
        const scrollPosition = window.scrollY;
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

// ===== NAVBAR SHADOW ON SCROLL =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
});

// ===== INPUT FIELD FOCUS EFFECTS =====
const inputFields = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

inputFields.forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    field.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ===== BUTTON RIPPLE EFFECT =====
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = diameter + 'px';
    ripple.style.left = (event.clientX - button.offsetLeft - radius) + 'px';
    ripple.style.top = (event.clientY - button.offsetTop - radius) + 'px';
    ripple.classList.add('ripple');

    const rippleEl = button.querySelector('.ripple');
    if (rippleEl) {
        rippleEl.remove();
    }

    button.appendChild(ripple);
}

// ===== SCROLL ACTIVE NAVIGATION LINK =====
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== INTERSECTION OBSERVER FOR STAGGERED ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'revealFade 0.8s ease-out forwards';
                entry.target.style.opacity = '1';
            }, index * 100);

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(element => {
    observer.observe(element);
});

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== FORM INPUT VALIDATION ON CHANGE =====
// Real-time validation feedback as user types
document.getElementById('name')?.addEventListener('change', function() {
    const error = document.getElementById('nameError');
    if (this.value.trim().length < 3) {
        error.textContent = 'Name must be at least 3 characters long';
    } else {
        error.textContent = '';
    }
});

document.getElementById('email')?.addEventListener('change', function() {
    const error = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value.trim())) {
        error.textContent = 'Please enter a valid email address';
    } else {
        error.textContent = '';
    }
});

document.getElementById('phone')?.addEventListener('change', function() {
    const error = document.getElementById('phoneError');
    const phoneRegex = /^[0-9\s\-\(\)\+]+$/;
    if (!phoneRegex.test(this.value.trim()) || this.value.length < 10) {
        error.textContent = 'Please enter a valid phone number';
    } else {
        error.textContent = '';
    }
});

document.getElementById('date')?.addEventListener('change', function() {
    const error = document.getElementById('dateError');
    const selectedDate = new Date(this.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        error.textContent = 'Please select a future date';
    } else {
        error.textContent = '';
    }
});

document.getElementById('service')?.addEventListener('change', function() {
    const error = document.getElementById('serviceError');
    if (!this.value) {
        error.textContent = 'Please select a service';
    } else {
        error.textContent = '';
    }
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    // Trigger reveal animations for elements already in viewport
    revealOnScroll();

    // Add a slight scale-up animation to the page
    document.body.style.animation = 'pageLoad 0.5s ease-out';
});

// ===== ACCESSIBILITY - SKIP TO MAIN CONTENT =====
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.className = 'skip-to-main';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
`;

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

// ===== SERVICE CARD CLICK SCROLL =====
const serviceCards = document.querySelectorAll('.service-card .learn-more');
serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (card.getAttribute('href') === '#contact') {
            e.preventDefault();
            scrollToContact();
        }
    });
});

// ===== DATE INPUT MINIMUM DATE SETTING =====
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ===== LAZY LOAD IMAGES (when implemented) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS =====
if (!('scrollBehavior' in document.documentElement.style)) {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== CONSOLE LOG FOR DEMO & SETUP INSTRUCTIONS =====
console.log('%c👨‍⚕️ Premium Medical Website Demo', 'font-size: 20px; font-weight: bold; color: #0066cc;');
console.log('%cDesigned for doctors to increase patient inquiries', 'font-size: 12px; color: #666;');
console.log('%c🚀 GOOGLE APPS SCRIPT INTEGRATION', 'font-size: 14px; font-weight: bold; color: #10b981;');
console.log('%c1. Create a Google Apps Script Web App', 'font-size: 11px; color: #666;');
console.log('%c2. Copy your Web App URL from "Deploy" > "New Deployment" > "Web App"', 'font-size: 11px; color: #666;');
console.log('%c3. Open script.js and update GOOGLE_APPS_SCRIPT_URL with your URL', 'font-size: 11px; color: #666;');
console.log('%c4. Form submissions will now be saved to Google Sheets!', 'font-size: 11px; color: #666;');
console.log('%c\nExample Google Apps Script code is in the README.md file', 'font-size: 10px; color: #999; font-style: italic;');
