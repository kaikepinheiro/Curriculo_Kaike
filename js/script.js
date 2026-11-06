document.addEventListener('DOMContentLoaded', () => {
  // 1. ANO NO FOOTER
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. SCROLL REVEAL
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });
  revealElements.forEach(el => revealObserver.observe(el));

  // 3. NAV FIXO COM FUNDO AO ROLAR
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 4. MENU MOBILE
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 5. DESTAQUE DO LINK ATIVO NO MENU
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // 6. ENVIO DO FORMULÁRIO VIA AJAX
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  
  if (form && submitBtn) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const btnSuccess = submitBtn.querySelector('.btn-success');
    const formError = document.getElementById('form-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      formError.style.display = 'none';
      formError.textContent = '';
      
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      submitBtn.style.background = 'var(--fg)';
      submitBtn.style.color = 'var(--bg)';

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          btnLoading.style.display = 'none';
          btnSuccess.style.display = 'flex';
          submitBtn.classList.add('success');
          submitBtn.disabled = true;
          form.reset();

          setTimeout(() => {
            submitBtn.classList.remove('success');
            btnSuccess.style.display = 'none';
            btnText.style.display = 'flex';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
          }, 5000);
        } else {
          const data = await response.json();
          throw new Error(data.errors ? data.errors.map(err => err.message).join(', ') : 'Erro ao enviar.');
        }
      } catch (error) {
        console.error('Erro no envio:', error);
        btnLoading.style.display = 'none';
        btnText.style.display = 'flex';
        submitBtn.disabled = false;
        formError.style.display = 'block';
        formError.textContent = error.message || 'Não foi possível enviar. Verifique sua conexão.';
      }
    });
  }

  // 7. MODO ESCURO
  const themeToggle = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    rootElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = rootElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        rootElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        rootElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // 8. CURSOR CUSTOMIZADO
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (window.matchMedia('(pointer: fine)').matches && cursor && cursorDot) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  } else {
    if (cursor) cursor.remove();
    if (cursorDot) cursorDot.remove();
  }

  // 9. EFEITO MAGNÉTICO NOS BOTÕES
  const magneticButtons = document.querySelectorAll('.magnetic');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
});