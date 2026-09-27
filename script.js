// Story flow, typed text, and interactive love-scene logic.
const storyChapters = Array.from(document.querySelectorAll('.chapter'));
const introScreen = document.getElementById('intro');
const startStoryBtn = document.getElementById('start-story');
const nextButtons = document.querySelectorAll('[data-next]');
const danceBtn = document.getElementById('dance-btn');
const openLetterBtn = document.getElementById('open-letter-btn');
const loveLetterCard = document.getElementById('love-letter');
const letterSection = document.getElementById('chapter-letter');
const letterAtmosphere = document.querySelector('.letter-atmosphere');
const specialDayButton = document.querySelector('.special-day');
const calendarShell = document.querySelector('.calendar-shell');
const secretTrigger = document.querySelector('.secret-trigger');
const secretMessage = document.querySelector('.secret-message');
let relationshipTimer = null;
let letterPreludeStarted = false;
let letterOpened = false;
let letterEndingPlayed = false;

function typeText(element, text, speed = 28) {
  if (!element) return;

  let index = 0;
  element.textContent = '';
  element.classList.add('visible');

  const tick = () => {
    if (index <= text.length) {
      element.textContent = text.slice(0, index);
      index += 1;
      setTimeout(tick, speed);
    }
  };

  tick();
}

function animateTextInSection(section) {
  const textNodes = section.querySelectorAll('[data-text]');
  textNodes.forEach((node, index) => {
    const value = node.dataset.text || '';
    node.textContent = '';
    node.classList.remove('visible');
    setTimeout(() => {
      typeText(node, value, value.length > 80 ? 14 : 26);
    }, index * 200);
  });
}

function showChapter(index) {
  storyChapters.forEach((chapter, chapterIndex) => {
    chapter.classList.toggle('active', chapterIndex === index);
  });

  const activeChapter = storyChapters[index];
  if (activeChapter) {
    activeChapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
    animateTextInSection(activeChapter);
  }

  if (index === 11) {
    updateRelationshipCounter();
  }

  if (index === 12) {
    beginLetterPrelude();
  }
}

function createHeartParticle(origin, count = 20, spread = 110) {
  const parent = document.querySelector('.floating-hearts') || document.body;

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'heart-particle';

    const angle = (Math.PI * 2 * i) / count;
    const x = Math.cos(angle) * (30 + Math.random() * spread);
    const y = Math.sin(angle) * (30 + Math.random() * spread);

    const left = origin.getBoundingClientRect().left + origin.offsetWidth / 2;
    const top = origin.getBoundingClientRect().top + origin.offsetHeight / 2;

    particle.style.left = `${left}px`;
    particle.style.top = `${top}px`;
    particle.style.setProperty('--tx', `${x}px`);
    particle.style.setProperty('--ty', `${y - 30}px`);

    parent.appendChild(particle);
    setTimeout(() => particle.remove(), 1600);
  }
}

function startStory() {
  createHeartParticle(startStoryBtn, 32, 120);
  if (introScreen) {
    introScreen.classList.add('fade-out');
  }
  setTimeout(() => showChapter(1), 700);
}

function bindNextButtons() {
  nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = Number(button.dataset.next);
      if (!Number.isNaN(target)) {
        showChapter(target);
      }
    });
  });
}

function revealCards() {
  const cards = document.querySelectorAll('.memory-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

function revealReasonHearts() {
  const reasons = [
    'Because you make me smile.',
    'Because you make ordinary conversations special.',
    'Because I can be myself with you.',
    'Because you make me feel loved.',
    'Because I love our little moments.',
    'Because you are someone I never want to lose.',
    'Because distance hasn’t stopped me from choosing you.',
    'Because you became my favorite person.',
    'Because you’re my baby.',
    'Because you’re you. ❤️'
  ];

  const hearts = document.querySelectorAll('.reason-heart');
  const reasonDisplay = document.querySelector('.reason-display');
  hearts.forEach((heart, index) => {
    heart.addEventListener('click', () => {
      hearts.forEach((item) => item.classList.remove('opened'));
      heart.classList.add('opened');
      if (reasonDisplay) {
        reasonDisplay.textContent = reasons[index];
        reasonDisplay.classList.add('visible');
      }
    });
  });
}

function beginLetterPrelude() {
  if (letterPreludeStarted || !letterSection) return;
  letterPreludeStarted = true;

  const lines = letterSection.querySelectorAll('.prelude-line');
  lines.forEach((line, index) => {
    setTimeout(() => line.classList.add('visible'), 350 + index * 1450);
  });
  setTimeout(() => letterSection.classList.add('ready'), 4500);
}

function createLetterAtmosphere(hearts, sparkles) {
  if (!letterAtmosphere) return;

  for (let index = 0; index < hearts + sparkles; index += 1) {
    const particle = document.createElement('span');
    const isHeart = index < hearts;
    particle.className = isHeart ? 'letter-floating-heart' : 'letter-sparkle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${12 + Math.random() * 72}%`;
    particle.style.setProperty('--drift', `${Math.round(Math.random() * 80 - 40)}px`);
    particle.style.animationDelay = `${Math.random() * 0.8}s`;
    letterAtmosphere.appendChild(particle);
    setTimeout(() => particle.remove(), isHeart ? 5200 : 3400);
  }
}

function revealLetterEnding() {
  if (letterEndingPlayed || !letterSection) return;
  letterEndingPlayed = true;

  const ending = letterSection.querySelector('.letter-ending');
  if (ending) {
    ending.classList.add('visible');
    ending.setAttribute('aria-hidden', 'false');
  }
  document.body.classList.add('letter-ending-mode');
  createLetterAtmosphere(20, 14);
}

function initializeLoveLetter() {
  if (!openLetterBtn || !loveLetterCard || !letterSection) return;

  const openLetter = () => {
    if (letterOpened) return;
    letterOpened = true;

    const envelope = letterSection.querySelector('.letter-envelope');
    if (envelope) envelope.classList.add('opened');
    document.body.classList.add('letter-mode');
    letterSection.classList.add('letter-opened');
    loveLetterCard.hidden = false;
    requestAnimationFrame(() => loveLetterCard.classList.add('visible'));
    createLetterAtmosphere(9, 14);
    setTimeout(() => loveLetterCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);

    const paragraphs = loveLetterCard.querySelectorAll('.letter-paragraph');
    if ('IntersectionObserver' in window) {
      const paragraphObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const paragraphIndex = Array.from(paragraphs).indexOf(entry.target);
            if (paragraphIndex > 0 && paragraphIndex % 8 === 0) {
              createLetterAtmosphere(2, 3);
            }
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      paragraphs.forEach((paragraph) => paragraphObserver.observe(paragraph));

      const sentinel = loveLetterCard.querySelector('.letter-ending-sentinel');
      if (sentinel) {
        const endingObserver = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            revealLetterEnding();
            endingObserver.disconnect();
          }
        }, { threshold: 0.1 });
        endingObserver.observe(sentinel);
      }
    } else {
      paragraphs.forEach((paragraph) => paragraph.classList.add('visible'));
      revealLetterEnding();
    }
  };

  openLetterBtn.addEventListener('click', openLetter);
  const envelopeButton = letterSection.querySelector('.letter-envelope');
  if (envelopeButton) envelopeButton.addEventListener('click', openLetter);
}

function danceCharacters() {
  const danceScene = document.querySelector('.dance-scene');
  const danceHearts = document.querySelector('.dance-hearts');
  const chapterNext = document.querySelector('#chapter-3 .chapter-next');

  if (danceScene) {
    danceScene.classList.add('dancing');
    danceScene.setAttribute('aria-label', 'Dancing side by side');
  }

  if (danceHearts) {
    danceHearts.classList.add('active');
  }

  if (chapterNext) {
    chapterNext.classList.remove('hidden');
  }

  if (danceBtn) {
    danceBtn.disabled = true;
    danceBtn.textContent = 'Dancing together ❤️';
  }

  createHeartParticle(danceBtn, 40, 90);
}

function initCalendar() {
  if (!specialDayButton || !calendarShell) return;

  specialDayButton.addEventListener('click', () => {
    calendarShell.classList.add('transformed');
    createHeartParticle(specialDayButton, 45, 90);
    const revealBlock = document.querySelector('#chapter-5 .calendar-reveal');
    if (revealBlock) {
      animateTextInSection(revealBlock);
    }
  });
}

function updateRelationshipCounter() {
  const relationshipStart = new Date('2025-09-28T00:00:00');
  const dayElement = document.getElementById('days');
  const hourElement = document.getElementById('hours');
  const minuteElement = document.getElementById('minutes');
  const secondElement = document.getElementById('seconds');

  const tick = () => {
    const now = new Date();
    let diff = Math.max(0, now.getTime() - relationshipStart.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    if (dayElement) dayElement.textContent = days;
    if (hourElement) hourElement.textContent = hours;
    if (minuteElement) minuteElement.textContent = minutes;
    if (secondElement) secondElement.textContent = seconds;
  };

  tick();
  if (relationshipTimer) clearInterval(relationshipTimer);
  relationshipTimer = setInterval(tick, 1000);
}

function initSecretHeart() {
  if (!secretTrigger || !secretMessage) return;

  secretTrigger.addEventListener('click', () => {
    secretMessage.classList.toggle('visible');
    const lines = document.querySelectorAll('.secret-line');
    lines.forEach((line, index) => {
      const text = line.dataset.text || '';
      setTimeout(() => typeText(line, text, 18), index * 240);
    });
  });
}

function initIntroSequence() {
  const introLines = document.querySelectorAll('.intro-line');
  introLines.forEach((line, index) => {
    const text = line.dataset.text || '';
    setTimeout(() => typeText(line, text, 28), index * 650);
  });
}

function initialize() {
  bindNextButtons();
  revealCards();
  revealReasonHearts();
  initializeLoveLetter();
  initCalendar();
  initSecretHeart();

  if (startStoryBtn) startStoryBtn.addEventListener('click', startStory);
  if (danceBtn) danceBtn.addEventListener('click', danceCharacters);

  initIntroSequence();
}

initialize();
