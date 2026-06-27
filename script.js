/**
 * Dr. Ramakishan Choudhary - Premium Medical Website
 * Interactions and Interactive Component Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initStatsCounter();
  initTestimonialsCarousel();
  initFAQAccordion();
  initAppointmentForm();
  initSmoothScroll();
});

/**
 * 1. HEADER SCROLL INTERACTION
 * Adds solid background and shadow on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check state on load
}

/**
 * 2. MOBILE NAVIGATION DRAWER
 * Toggles mobile drawer, animations, and handles body locking
 */
function initMobileNav() {
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const body = document.body;
  const overlayLinks = document.querySelectorAll('.mobile-nav a');

  if (!navToggle) return;

  const toggleMenu = () => {
    body.classList.toggle('nav-open');
  };

  navToggle.addEventListener('click', toggleMenu);

  // Close navigation when overlay links are clicked
  overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
      body.classList.remove('nav-open');
    });
  });
}

/**
 * 3. STATS COUNT-UP ANIMATION
 * Animates numbers when the hero section becomes visible
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length === 0) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-val'), 10);
    const duration = 1500; // ms
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * target);
      
      // Format 10000+ numbers nicely
      if (target >= 10000) {
        el.textContent = currentValue.toLocaleString('en-IN');
      } else {
        el.textContent = currentValue;
      }

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        if (target >= 10000) {
          el.textContent = target.toLocaleString('en-IN');
        } else {
          el.textContent = target;
        }
      }
    };

    requestAnimationFrame(updateValue);
  };

  // IntersectionObserver to start animation only when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Prevent duplicate animation running
        if (!el.classList.contains('animated')) {
          el.classList.add('animated');
          animateCounter(el);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}

/**
 * 4. PATIENT TESTIMONIALS SLIDER
 * Supports navigation, autoplay, and dots indicators
 */
function initTestimonialsCarousel() {
  const carousel = document.getElementById('reviewsCarousel');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  if (!carousel || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;
  let autoplayTimer;

  // Generate indicator dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  const updateDots = () => {
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = slideCount - 1;
    } else if (index >= slideCount) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    
    // Slide translate animation
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  // Control listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  // Autoplay functionality
  const startAutoplay = () => {
    autoplayTimer = setInterval(nextSlide, 6000);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayTimer);
    startAutoplay();
  };

  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  carousel.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/**
 * 5. FAQ ACCORDION TRIGGER
 * Expands panels using CSS grid for transition smoothness
 */
function initFAQAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close other opened FAQs (optional, but clean)
      triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current trigger
      trigger.setAttribute('aria-expanded', !isExpanded);
    });
  });
}

/**
 * 6. APPOINTMENT FORM VALIDATOR
 * Client side inputs check, animation triggers, and success states
 */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');

  // Input helper validators
  const validateName = () => {
    const nameVal = fullNameInput.value.trim();
    const group = fullNameInput.closest('.form-group');
    
    if (nameVal.length < 3) {
      group.classList.add('invalid');
      return false;
    } else {
      group.classList.remove('invalid');
      return true;
    }
  };

  const validatePhone = () => {
    const phoneVal = phoneInput.value.trim();
    const group = phoneInput.closest('.form-group');
    // Simple Indian mobile number validation (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    
    if (!phoneRegex.test(phoneVal)) {
      group.classList.add('invalid');
      return false;
    } else {
      group.classList.remove('invalid');
      return true;
    }
  };

  // Live checks
  fullNameInput.addEventListener('input', validateName);
  phoneInput.addEventListener('input', validatePhone);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isPhoneValid = validatePhone();

    if (isNameValid && isPhoneValid) {
      // Simulate form submission process
      form.classList.add('submitting');

      setTimeout(() => {
        // Success states transition
        form.classList.remove('submitting');
        form.style.display = 'none';
        formSuccess.style.display = 'flex';
      }, 1500);
    }
  });
}

/**
 * 7. SMOOTH LINK SCROLLS
 * Prevents default jump and implements smooth page scrolling
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        
        // Remove active menu drawer if open on mobile
        document.body.classList.remove('nav-open');

        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
