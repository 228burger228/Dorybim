// ─── GALLERY DATA ───
const works = [
  // PIXEL PROJECT — real images, links to case page
  { cat: 'cafe',    img: 'pixel_cafe.jpg',   label: 'Пиксель-арт',  title: 'Кофейня · игровой проект',   color: '#E8D5C0', link: 'pixel.html' },
  { cat: 'chars',   img: 'pixel_chars1.jpg', label: 'Персонажи',    title: 'Посетители кофейни',          color: '#FFD8C0', link: 'pixel.html' },
  { cat: 'chars',   img: 'pixel_char2.jpg',  label: 'Персонаж',     title: 'Главная героиня',             color: '#E8D8F0', link: 'pixel.html' },
  // Placeholders — замени на реальные работы
  { cat: 'aesthetic', emoji: '🌸', label: 'Эстетика',  title: 'Весенняя эстетика',    color: '#FFE0E8' },
  { cat: 'fantasy',   emoji: '🐉', label: 'Фэнтези',   title: 'Лесная фея',           color: '#D8E8D8' },
  { cat: 'cute',      emoji: '🍓', label: 'Милота',    title: 'Клубничный котик',     color: '#FFD8E0' },
  { cat: 'cafe',      emoji: '🏡', label: 'Интерьер',  title: 'Уголок с книгами',     color: '#F0E8D8' },
  { cat: 'aesthetic', emoji: '🌙', label: 'Эстетика',  title: 'Ночная эстетика',      color: '#D0D8F0' },
  { cat: 'fantasy',   emoji: '🦋', label: 'Фэнтези',   title: 'Бабочковая ведьма',    color: '#E8F0D8' },
  { cat: 'cute',      emoji: '🍰', label: 'Милота',    title: 'Торт на праздник',     color: '#FFE8D8' },
  { cat: 'chars',     emoji: '🎀', label: 'Персонаж',  title: 'Принцесса',            color: '#FFD8EC' },
  { cat: 'cafe',      emoji: '🌿', label: 'Кафе',      title: 'Зелёная терраса',      color: '#D8ECD8' },
];

const grid = document.getElementById('galleryGrid');
let currentCat = 'all';

function renderGallery(cat) {
  const filtered = cat === 'all' ? works : works.filter(w => w.cat === cat);
  grid.innerHTML = '';

  filtered.forEach((w, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    if (i === 0 && filtered.length >= 3) {
      item.style.gridColumn = 'span 2';
      item.style.aspectRatio = '2/1';
    }

    const inner = w.img
      ? `<img src="${w.img}" alt="${w.title}" style="width:100%;height:100%;object-fit:cover;image-rendering:pixelated;transition:transform 0.5s ease;">`
      : `<div class="gallery-placeholder" style="background:linear-gradient(135deg,${w.color},#FAF6F0);width:100%;height:100%;">
           <span>${w.emoji}</span><p>${w.label}</p>
         </div>`;

    item.innerHTML = `
      ${inner}
      <div class="gallery-overlay">
        <div class="gallery-overlay-text">${w.title}${w.link ? ' <span style="opacity:.7;font-size:.75rem;">→ подробнее</span>' : ''}</div>
      </div>
    `;

    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;
    item.style.cursor = (w.link || w.img) ? 'pointer' : 'default';

    // Overlay must not block pointer events
    const overlay = item.querySelector('.gallery-overlay');
    if (overlay) overlay.style.pointerEvents = 'none';

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (w.link) { window.location.href = w.link; return; }
      if (w.img)  { openLightbox(w.img); }
    });

    grid.appendChild(item);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    });
  });
}

// ─── TABS ───
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCat = btn.dataset.cat;
    renderGallery(currentCat);
  });
});

renderGallery('all');

// ─── LIGHTBOX ───
function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ─── SCROLL REVEAL ───
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right')];
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ─── NAV ACTIVE ───
const sections = document.querySelectorAll('section[id], footer');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${entry.target.id}`) {
          a.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

// ─── FORM SUBMIT ───
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.querySelector('.btn-submit');
  btn.textContent = '✓ Заявка отправлена!';
  btn.style.background = 'var(--peach-deep)';
  setTimeout(() => {
    btn.textContent = 'Отправить заявку ✦';
    btn.style.background = '';
  }, 3000);
}

// ─── SMOOTH NAV SCROLL OFFSET ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
