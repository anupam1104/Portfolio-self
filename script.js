// Terminal typing effect
const typedEl = document.getElementById('typed');
const phrases = ['whoami', 'cat role.txt', 'whispering "hackathons"', 'echo "AI integration"', 'ls -la', 'sudo apt-get install creativity', 'git commit -m "fix bugs"', 'python3 deadroute.py', 'npm run build', 'curl -X POST https://api.openai.com/v1/engines/davinci/completions', 'tail -f /var/log/syslog', 'ping localhost'];
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

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const closeButton = document.querySelector('.image-modal-close');
const teamCards = document.querySelectorAll('.team-card');

function openTeamImage(imageName, title) {
  modalImage.src = imageName;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeTeamImage() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

teamCards.forEach((card) => {
  card.addEventListener('click', () => {
    openTeamImage(card.dataset.image, card.dataset.title);
  });
});

if (closeButton) {
  closeButton.addEventListener('click', closeTeamImage);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'true' || event.target === modal) {
      closeTeamImage();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
    closeTeamImage();
  }
});

const preloader = document.getElementById('preloader');
if (preloader) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = Array.from(document.querySelectorAll('.preloader-line'));
  let lineIndex = 0;
  let typeTimer = 1000;
  let holdTimer = 1000;

  lines.forEach((line) => {
    line.dataset.fullText = line.textContent.trim();
    line.textContent = '';
  });

  const randomizePosition = (line) => {
    line.style.left = `${Math.random() * 75 + 10}%`;
    line.style.top = `${Math.random() * 65 + 15}%`;
  };

  const cycleText = () => {
    const activeLine = lines[lineIndex];
    if (!activeLine) return;

    lines.forEach((line, index) => {
      const isActive = index === lineIndex;
      line.classList.toggle('active', isActive);
      if (isActive) {
        randomizePosition(line);
      }
    });

    const fullText = activeLine.dataset.fullText;
    let charIndex = 0;

    const typeLine = () => {
      charIndex += 1;
      activeLine.textContent = fullText.slice(0, charIndex);

      if (charIndex < fullText.length) {
        typeTimer = window.setTimeout(typeLine, 70);
        return;
      }

      holdTimer = window.setTimeout(() => {
        activeLine.classList.remove('active');
        lineIndex = (lineIndex + 1) % lines.length;
        cycleText();
      }, 2500);
    };

    typeLine();
  };

  if (reducedMotion) {
    lines.forEach((line) => {
      line.textContent = line.dataset.fullText;
      line.classList.add('active');
    });
    preloader.classList.add('hidden');
    document.body.classList.remove('preloader-active');
  } else {
    cycleText();
    window.setTimeout(() => {
      window.clearTimeout(typeTimer);
      window.clearTimeout(holdTimer);
      preloader.classList.add('hidden');
      document.body.classList.remove('preloader-active');
      window.setTimeout(() => preloader.remove(), 1000);
    }, 10000);
  }
} else {
  document.body.classList.remove('preloader-active');
}