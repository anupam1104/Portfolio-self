// Terminal typing effect
const typedEl = document.getElementById('typed');
const phrases = ['whoami', 'cat role.txt', 'echo "shipping Visstya AI"'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 40 : 70);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  type();
} else {
  typedEl.textContent = phrases[0];
}

// Scroll reveal - IntersectionObserver, no library
const revealEls = document.querySelectorAll('.reveal, .card, .achievements, .philosophy-line, .skill-group, .hackathon-photo, .sih-gallery');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => observer.observe(el));

// Timeline items reveal individually
document.querySelectorAll('.timeline li').forEach((el) => observer.observe(el));

// Subtle card tilt for richer motion
const tiltCards = document.querySelectorAll('.card, .sih-photo');
tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = (0.5 - (y / rect.height)) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});