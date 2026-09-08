document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('nav ul');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  const header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
        }
      }
    });
  });

  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeInOnScroll = function () {
    fadeElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  fadeInOnScroll();
  window.addEventListener('scroll', fadeInOnScroll, { passive: true });
});
