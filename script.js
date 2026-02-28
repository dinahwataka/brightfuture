/**
 * BrightFuture Institute of Technology
 * Main JavaScript File
 * Author: Dinah Wataka
 * Description: Navigation toggle, form validation, smooth scroll, dynamic year
 */

/* ============================================================
   1. DYNAMIC FOOTER YEAR
   - Automatically inserts the current year into footer elements
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const yearSpans = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(function (span) {
    span.textContent = currentYear;
  });

  /* ============================================================
     2. NAVIGATION TOGGLE (Mobile Hamburger Menu)
     ============================================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      nav.classList.toggle('open');
      // Accessibility: update aria-expanded
      const isOpen = nav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link is clicked (mobile)
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     3. SMOOTH SCROLL FOR ANCHOR LINKS
     - Handles all in-page anchor links with smooth scrolling
     ============================================================ */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ============================================================
     4. ACTIVE NAV LINK HIGHLIGHT
     - Adds 'active' class to current page nav link
     ============================================================ */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-links a');
  allNavLinks.forEach(function (link) {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     5. ADMISSION FORM VALIDATION
     - Validates required fields and shows appropriate messages
     ============================================================ */
  const admissionForm = document.getElementById('admission-form');
  const validationMsg = document.getElementById('validation-message');

  if (admissionForm && validationMsg) {
    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default; we'll validate then redirect

      let isValid = true;
      let errorMessages = [];

      // Validate Full Name
      const fullName = document.getElementById('full-name');
      if (fullName && fullName.value.trim().length < 3) {
        isValid = false;
        errorMessages.push('Full Name must be at least 3 characters.');
        highlightField(fullName, false);
      } else if (fullName) {
        highlightField(fullName, true);
      }

      // Validate Email
      const email = document.getElementById('email');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailPattern.test(email.value.trim())) {
        isValid = false;
        errorMessages.push('Please enter a valid email address.');
        highlightField(email, false);
      } else if (email) {
        highlightField(email, true);
      }

      // Validate Password
      const password = document.getElementById('password');
      if (password && password.value.length < 8) {
        isValid = false;
        errorMessages.push('Password must be at least 8 characters.');
        highlightField(password, false);
      } else if (password) {
        highlightField(password, true);
      }

      // Validate Gender (radio)
      const genderInputs = document.querySelectorAll('input[name="gender"]');
      const genderSelected = Array.from(genderInputs).some(function (r) { return r.checked; });
      if (!genderSelected) {
        isValid = false;
        errorMessages.push('Please select your gender.');
      }

      // Validate at least one course selected
      const courseCheckboxes = document.querySelectorAll('input[name="course"]');
      const courseSelected = Array.from(courseCheckboxes).some(function (c) { return c.checked; });
      if (!courseSelected) {
        isValid = false;
        errorMessages.push('Please select at least one course.');
      }

      // Validate Date of Birth
      const dob = document.getElementById('dob');
      if (dob && !dob.value) {
        isValid = false;
        errorMessages.push('Please enter your Date of Birth.');
        highlightField(dob, false);
      } else if (dob) {
        highlightField(dob, true);
      }

      // Show result
      if (!isValid) {
        validationMsg.className = 'error';
        validationMsg.innerHTML = '<strong>Please fix the following errors:</strong><ul style="margin-top:0.5rem;padding-left:1.25rem;">' +
          errorMessages.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>';
        validationMsg.style.display = 'block';
        validationMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // All valid — submit to submit.html
        validationMsg.className = 'success';
        validationMsg.textContent = '✔ Validation successful! Redirecting to confirmation page...';
        validationMsg.style.display = 'block';
        setTimeout(function () {
          admissionForm.action = 'submit.html';
          admissionForm.submit();
        }, 1200);
      }
    });

    // Reset validation styles on reset button
    admissionForm.addEventListener('reset', function () {
      validationMsg.style.display = 'none';
      const allInputs = admissionForm.querySelectorAll('input, select, textarea');
      allInputs.forEach(function (input) {
        input.style.borderColor = '';
      });
    });
  }

  /* ============================================================
     6. CONTACT FORM VALIDATION
     ============================================================ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.querySelector('#contact-name');
      const email = contactForm.querySelector('#contact-email');
      const message = contactForm.querySelector('#contact-message');
      let valid = true;

      [name, email, message].forEach(function (field) {
        if (field && !field.value.trim()) {
          highlightField(field, false);
          valid = false;
        } else if (field) {
          highlightField(field, true);
        }
      });

      const msgDiv = document.getElementById('contact-message-result');
      if (msgDiv) {
        if (valid) {
          msgDiv.className = 'alert alert-success';
          msgDiv.textContent = '✔ Thank you! Your message has been sent. We\'ll respond within 24 hours.';
          msgDiv.style.display = 'block';
          contactForm.reset();
        } else {
          msgDiv.className = 'alert';
          msgDiv.style.background = '#fdecea';
          msgDiv.style.borderLeft = '4px solid #c0392b';
          msgDiv.style.color = '#c0392b';
          msgDiv.style.display = 'block';
          msgDiv.textContent = '✘ Please fill in all required fields.';
        }
      }
    });
  }

  /* ============================================================
     7. SCROLL ANIMATIONS (simple fade-in on scroll)
     ============================================================ */
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .value-item, .team-card, .stat-item').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

});

/* ============================================================
   HELPER FUNCTION: Field highlight on validation
   ============================================================ */
function highlightField(field, isValid) {
  if (isValid) {
    field.style.borderColor = '#2d8a4e';
  } else {
    field.style.borderColor = '#c0392b';
    field.focus();
  }
}
