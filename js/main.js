/* ============================================================
   Extending the Knob — Core JavaScript
   Scroll animations, navigation, interactive components
   ============================================================ */

// --- Scroll-triggered animations ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.addEventListener('DOMContentLoaded', () => {
  // Observe all fade-in elements
  document.querySelectorAll('.fade-in, .pipeline-step').forEach((el) => {
    observer.observe(el);
  });

  // Nav scroll state
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Confidence bars — animate on scroll
  document.querySelectorAll('.confidence-bar .fill').forEach((fill) => {
    const target = fill.dataset.value;
    const barObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fill.style.width = target + '%';
          barObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    barObserver.observe(fill);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// --- Packet Visualizer ---
function createPacketViz(container, bytes) {
  if (!container) return;
  container.innerHTML = '';

  bytes.forEach((b) => {
    const el = document.createElement('div');
    el.className = `packet-byte ${b.type}`;
    el.textContent = b.hex;

    const tip = document.createElement('div');
    tip.className = 'packet-tooltip';
    tip.textContent = b.label;
    el.appendChild(tip);

    container.appendChild(el);
  });
}

// --- Copy-to-clipboard for code blocks ---
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('copy-btn')) {
    const code = e.target.closest('pre')?.querySelector('code')?.textContent;
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        e.target.textContent = 'Copied';
        setTimeout(() => { e.target.textContent = 'Copy'; }, 1500);
      });
    }
  }
});
