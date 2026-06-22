(function () {
  'use strict';

  /* =====================
    1. ELEMENTS
  ===================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialDots = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  const reveals = document.querySelectorAll('.reveal');
  const statNumbers = document.querySelectorAll('.stat-number');
  const skillBarFills = document.querySelectorAll('.skill-bar-fill');

  let currentTestimonial = 0;
  let testimonialCount = document.querySelectorAll('.testimonial-card').length;

  /* =====================
    2. NAVIGATION
  ===================== */

  // Hamburger toggle
  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close nav on link click (mobile)
  navAnchors.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Navbar background on scroll
  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active nav link on scroll
  function updateActiveLink() {
    var scrollPos = window.scrollY + 120;
    var sections = document.querySelectorAll('section[id]');

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* =====================
    3. INTERACTIVE HERO BACKGROUND
  ===================== */
  var heroInteractive = document.createElement('div');
  heroInteractive.className = 'hero-interactive';
  var heroElement = document.querySelector('.hero');
  heroElement.insertBefore(heroInteractive, heroElement.firstChild);

  function updateInteractiveBackground(e) {
    var x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    var y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;
    var deltaX = (x - centerX) / centerX;
    var deltaY = (y - centerY) / centerY;

    heroInteractive.style.transform = 'translate(' + deltaX * 30 + 'px, ' + deltaY * 30 + 'px)';
  }

  heroInteractive.addEventListener('mousemove', updateInteractiveBackground);
  heroInteractive.addEventListener('touchmove', updateInteractiveBackground);

  /* =====================
    4. PARALLAX HERO SHAPES
  ===================== */
  var heroShapes = document.querySelectorAll('.shape');
  function handleParallax() {
    var scrollY = window.scrollY;
    heroShapes.forEach(function (shape, i) {
      var speed = 0.03 + i * 0.02;
      shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
  }

  /* =====================
    4. BACK TO TOP
  ===================== */
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =====================
    5. SCROLL REVEAL (Intersection Observer)
  ===================== */
  function initRevealObserver() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger children in grids
            var parent = entry.target;
            var staggerChildren = parent.querySelectorAll('.stagger-item');
            if (staggerChildren.length > 0) {
              staggerChildren.forEach(function (child, i) {
                setTimeout(function () {
                  child.classList.add('visible');
                }, i * 100);
              });
            }

            entry.target.classList.add('visible');

            // Animate skill bars when they become visible
            var bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach(function (bar, i) {
              var width = bar.getAttribute('data-width');
              if (width) {
                setTimeout(function () {
                  bar.style.width = width + '%';
                }, 300 + i * 100);
              }
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach(function (el) {
      // Add stagger classes to grid children
      var grid = el.querySelector('.services-grid, .work-grid, .skills-bars');
      if (grid) {
        var items = grid.children;
        for (var i = 0; i < items.length; i++) {
          items[i].classList.add('stagger-item');
        }
      }
      observer.observe(el);
    });
  }

  /* =====================
    6. COUNTER ANIMATION
  ===================== */
  function animateCounters() {
    statNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      var startTime = null;
      var duration = 1500;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Trigger counter animation when stats section is visible
  function initCounterObserver() {
    var statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsSection);
  }

  /* =====================
    7. PROJECT FILTERING
  ===================== */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      var filter = this.getAttribute('data-filter');
      var delay = 0;

      workCards.forEach(function (card, i) {
        var category = card.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 80 + i * 60);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(function () {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* =====================
    8. TESTIMONIALS CAROUSEL
  ===================== */
  function updateTestimonial(index) {
    if (index < 0) index = testimonialCount - 1;
    if (index >= testimonialCount) index = 0;
    currentTestimonial = index;

    testimonialTrack.style.transform = 'translateX(-' + (currentTestimonial * 100) + '%)';

    // Update dots
    var dots = testimonialDots.querySelectorAll('.dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentTestimonial);
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () {
      updateTestimonial(currentTestimonial - 1);
    });

    nextBtn.addEventListener('click', function () {
      updateTestimonial(currentTestimonial + 1);
    });
  }

  // Dot click
  if (testimonialDots) {
    testimonialDots.addEventListener('click', function (e) {
      if (e.target.classList.contains('dot')) {
        var dots = Array.from(this.querySelectorAll('.dot'));
        var index = dots.indexOf(e.target);
        if (index !== -1) updateTestimonial(index);
      }
    });
  }

  // Auto-play testimonials
  var testimonialInterval = setInterval(function () {
    updateTestimonial(currentTestimonial + 1);
  }, 5000);

  // Pause auto-play on hover
  var slider = document.querySelector('.testimonials-slider');
  if (slider) {
    slider.addEventListener('mouseenter', function () {
      clearInterval(testimonialInterval);
    });

    slider.addEventListener('mouseleave', function () {
      testimonialInterval = setInterval(function () {
        updateTestimonial(currentTestimonial + 1);
      }, 5000);
    });
  }

  /* =====================
    9. CONTACT FORM VALIDATION
  ===================== */
  if (contactForm) {
    var formInputs = contactForm.querySelectorAll('input, textarea');

    // Real-time validation
    formInputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(this);
      });

      input.addEventListener('input', function () {
        var group = this.closest('.form-group');
        if (group.classList.contains('error') || group.classList.contains('success')) {
          validateField(this);
        }
      });
    });

    function validateField(field) {
      var group = field.closest('.form-group');
      group.classList.remove('error', 'success');

      if (field.hasAttribute('required') && field.value.trim() === '') {
        group.classList.add('error');
        return false;
      }

      if (field.type === 'email' && field.value.trim() !== '') {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          group.classList.add('error');
          return false;
        }
      }

      group.classList.add('success');
      return true;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      formInputs.forEach(function (input) {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        var btn = this.querySelector('.btn-submit');
        var originalText = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.style.pointerEvents = 'none';

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.pointerEvents = '';
          contactForm.reset();
          formInputs.forEach(function (input) {
            input.closest('.form-group').classList.remove('success');
          });
        }, 2500);
      }
    });
  }

  /* =====================
    10. WINDOW EVENTS
  ===================== */
  function onScroll() {
    handleNavScroll();
    updateActiveLink();
    handleBackToTop();
    handleParallax();
  }

  // Initial call
  onScroll();

  // Throttle scroll for performance
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial call
  onScroll();

  /* =====================
    11. INIT
  ===================== */
  initRevealObserver();
  initCounterObserver();

})();
