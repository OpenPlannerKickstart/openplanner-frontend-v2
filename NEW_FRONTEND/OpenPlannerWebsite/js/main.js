/**
 * Open Planner - Frontend JavaScript
 * Handles all interactive functionality
 */

// ============================================
// DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initMobileMenu();
  initBackToTop();
  initTestimonialsSlider();
  initFAQAccordion();
  initSidebar();
  initPasswordToggle();
  initTaskCheckboxes();
  initFilterButtons();
  initToggles();
});

// ============================================
// Navbar Scroll Effect
// ============================================

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
}

// ============================================
// Mobile Menu
// ============================================

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close menu when clicking links
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}

// ============================================
// Back to Top Button
// ============================================

function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  function toggleVisibility() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility(); // Initial check

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// Testimonials Slider
// ============================================

function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  
  if (!track || dots.length === 0) return;

  let currentIndex = 0;
  const totalSlides = dots.length;
  let autoSlideInterval;

  function getVisibleCards() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateSlider() {
    const visibleCards = getVisibleCards();
    const slideWidth = 100 / visibleCards;
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoSlide();
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  // Add click handlers to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  // Start auto-slide
  autoSlideInterval = setInterval(nextSlide, 5000);

  // Update on resize
  window.addEventListener('resize', updateSlider);
}

// ============================================
// FAQ Accordion
// ============================================

function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Check if this item is already open
      const isOpen = item.classList.contains('active');

      // Close all items
      faqItems.forEach(faq => {
        faq.classList.remove('active');
      });

      // Open clicked item if it wasn't already open
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // Open first item by default
  if (faqItems[0]) {
    faqItems[0].classList.add('active');
  }
}

// ============================================
// Dashboard Sidebar
// ============================================

function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const closeBtn = document.querySelector('.sidebar-close');
  
  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', openSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar on link click (mobile)
  const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });
}

// ============================================
// Password Toggle
// ============================================

function initPasswordToggle() {
  const toggleBtns = document.querySelectorAll('.form-input-toggle');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      const eyeIcon = this.querySelector('.eye-icon');
      const eyeOffIcon = this.querySelector('.eye-off-icon');
      
      if (input.type === 'password') {
        input.type = 'text';
        if (eyeIcon) eyeIcon.style.display = 'none';
        if (eyeOffIcon) eyeOffIcon.style.display = 'block';
      } else {
        input.type = 'password';
        if (eyeIcon) eyeIcon.style.display = 'block';
        if (eyeOffIcon) eyeOffIcon.style.display = 'none';
      }
    });
  });
}

// ============================================
// Task Checkboxes
// ============================================

function initTaskCheckboxes() {
  const checkboxes = document.querySelectorAll('.task-checkbox');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {
      this.classList.toggle('checked');
      
      // Visual feedback for completed task
      const taskItem = this.closest('.task-item, .task-row');
      if (taskItem) {
        const title = taskItem.querySelector('.task-title');
        if (title) {
          title.style.textDecoration = this.classList.contains('checked') ? 'line-through' : 'none';
          title.style.color = this.classList.contains('checked') ? 'var(--neutral-400)' : '';
        }
      }
    });
  });
}

// ============================================
// Filter Buttons
// ============================================

function initFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      // In a real app, this would filter the task list
      // For now, it's just a visual toggle
    });
  });
}

// ============================================
// Settings Toggles
// ============================================

function initToggles() {
  const toggles = document.querySelectorAll('.toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// Form Validation Helpers
// ============================================

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// Form submission handler (for demo purposes)
const authForms = document.querySelectorAll('.auth-form');
authForms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = form.querySelector('input[type="email"], input[type="text"]');
    const password = form.querySelector('input[type="password"]');
    
    // Basic validation
    if (email && !validateEmail(email.value) && email.type === 'email') {
      alert('Please enter a valid email address');
      return;
    }
    
    if (password && !validatePassword(password.value)) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    // In a real app, this would submit to a server
    // For demo, redirect to dashboard
    window.location.href = 'dashboard.html';
  });
});

// ============================================
// Calendar Navigation (Demo)
// ============================================

const calendarNavBtns = document.querySelectorAll('.calendar-nav-btn');
calendarNavBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    // In a real app, this would navigate months
    // For demo, just show a message
    console.log('Calendar navigation clicked');
  });
});

// ============================================
// Animation on Scroll (Simple Implementation)
// ============================================

function animateOnScroll() {
  const elements = document.querySelectorAll('[data-aos]');
  
  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100;
    
    if (isVisible) {
      element.classList.add('aos-animate');
    }
  });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
