document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('header nav a').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.getElementById(this.getAttribute('href').substring(1));
        targetElement?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  
    const header = document.querySelector('header');
    if (header) {
      const navToggle = document.createElement('button');
      navToggle.className = 'nav-toggle';
      navToggle.innerText = '☰';
      header.prepend(navToggle);
  
      const navMenu = header.querySelector('nav');
      navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    }
  
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerText = '↑';
    document.body.appendChild(backToTop);
  
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 200);
    });
  
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  