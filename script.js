/* =========================
   UTILS
========================= */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* =========================
   YEAR FOOTER
========================= */
(() => {
  const year = new Date().getFullYear();
  const y = $('#year');
  if (y) y.textContent = year;
})();

/* =========================
   NAV TOGGLE MOBILE
========================= */
(() => {
  const btn = $('.nav-toggle');
  const nav = $('#nav-list');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open');
  });
})();

/* =========================
   TYPING HERO
========================= */
(() => {
  const el = $('#typing-hero') || $('.hero-subtitle');
  if (!el) return;

  const texts = [
    'Costruzioni di qualità',
    'Ristrutturazioni su misura',
    'Design e precisione'
  ];

  let t = 0, c = 0, del = false;

  function type() {
    el.textContent = texts[t].slice(0, c);

    if (!del) {
      c++;
      if (c > texts[t].length) {
        del = true;
        setTimeout(type, 1200);
        return;
      }
    } else {
      c--;
      if (c === 0) {
        del = false;
        t = (t + 1) % texts.length;
      }
    }
    setTimeout(type, del ? 60 : 100);
  }
  type();
})();

/* =========================
   REVEAL ON SCROLL
========================= */
(() => {
  const els = $$('.fade-in');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('appear');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => obs.observe(el));
})();

/* =========================
   LAZY LOAD IMAGES
========================= */
(() => {
  const imgs = $$('img[data-src], img.lazy');
  if (!imgs.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const img = e.target;
      const src = img.dataset.src;
      if (src) img.src = src;
      img.classList.remove('lazy');
      io.unobserve(img);
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => io.observe(img));
})();

/* =========================
   LIGHTBOX
========================= */
(() => {
  const lb = $('.lightbox');
  if (!lb) return;

  const imgBox = lb.querySelector('.lightbox-img');
  const close = lb.querySelector('.lightbox-close');

  $$('img').forEach(img => {
    img.addEventListener('click', () => {
      imgBox.src = img.src;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  const hide = () => {
    lb.style.display = 'none';
    imgBox.src = '';
    document.body.style.overflow = '';
  };

  close?.addEventListener('click', hide);
  lb.addEventListener('click', e => e.target === lb && hide());
  document.addEventListener('keydown', e => e.key === 'Escape' && hide());
})();

/* =========================
   EMAILJS FORM
========================= */
document.addEventListener('DOMContentLoaded', function () {

  // INIT EMAILJS (v4)
  emailjs.init('DIp8WoqHR6379mtJq'); // PUBLIC KEY

  const form = $('#contact-form');
  const status = $('#form-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = $('#nome').value.trim();
    const email = $('#email').value.trim();
    const telefono = $('#telefono').value.trim();
    const messaggio = $('#messaggio').value.trim();

    if (!nome || !email || !messaggio) {
      status.textContent = 'Compila tutti i campi obbligatori';
      status.style.color = 'red';
      return;
    }

    status.textContent = 'Invio in corso…';
    status.style.color = '#555';

    /* ===== EMAIL ADMIN ===== */
    emailjs.send(
      'service_wspry7e',
      'template_admin',
      {
        from_name: nome,
        reply_to: email,
        telefono: telefono,
        message: messaggio,
        to_email: 'leoperedoro@gmail.com'
      }
    )

    /* ===== EMAIL CLIENTE ===== */
    .then(() => {
      return emailjs.send(
        'service_wspry7e',
        'template_cliente',
        {
          to_email: email,
          from_name: "Le Opere d’Oro",
          message:
`Ciao ${nome},

abbiamo ricevuto la tua richiesta.
Ti risponderemo il prima possibile.

Le Opere d’Oro`
        }
      );
    })

    .then(() => {
      status.textContent = 'Messaggio inviato con successo!';
      status.style.color = 'green';
      form.reset();
    })

    .catch(err => {
      console.error('Errore EmailJS:', err);
      status.textContent = 'Errore durante l’invio';
      status.style.color = 'red';
    });
  });
});
