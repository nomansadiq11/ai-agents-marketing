// Shared page behaviour for Agentic Hub marketing pages.

// Wires up a horizontal snap-scroll slider (track + optional prev/next buttons + dot indicators).
function initSnapSlider({ trackId, prevId, nextId, dotsId, itemLabel }) {
  const track = document.getElementById(trackId);
  const dotsWrap = document.getElementById(dotsId);
  if (!track || !dotsWrap) return;

  const prevBtn = prevId && document.getElementById(prevId);
  const nextBtn = nextId && document.getElementById(nextId);
  const items = Array.from(track.children);

  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to ${itemLabel} ${i + 1}`);
    dot.className = 'h-1.5 rounded-full transition-all bg-slate-300 w-1.5';
    dot.addEventListener('click', () => {
      track.scrollTo({ left: items[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  const setActiveDot = (index) => {
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-indigo-500', i === index);
      dot.classList.toggle('w-6', i === index);
      dot.classList.toggle('bg-slate-300', i !== index);
      dot.classList.toggle('w-1.5', i !== index);
    });
  };

  const closestItemIndex = () => {
    const trackCenter = track.scrollLeft + track.offsetLeft;
    let closest = 0;
    let smallestDiff = Infinity;
    items.forEach((item, i) => {
      const diff = Math.abs(item.offsetLeft - trackCenter);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closest = i;
      }
    });
    return closest;
  };

  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => setActiveDot(closestItemIndex()), 100);
  });

  const scrollByItem = (direction) => {
    const current = closestItemIndex();
    const target = items[Math.min(items.length - 1, Math.max(0, current + direction))];
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  if (prevBtn) prevBtn.addEventListener('click', () => scrollByItem(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByItem(1));

  setActiveDot(0);
}

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Signup modal, opened by any [data-open-modal="signup"] trigger (only runs on pages that have it)
  const signupModal = document.getElementById('signup-modal');
  if (signupModal) {
    const backdrop = document.getElementById('signup-modal-backdrop');
    const closeBtn = document.getElementById('signup-modal-close');
    const form = document.getElementById('signup-modal-form');
    const formState = document.getElementById('signup-modal-form-state');
    const successState = document.getElementById('signup-modal-success-state');
    const emailInput = document.getElementById('signup-email');

    const openModal = (prefillEmail) => {
      form.reset();
      formState.classList.remove('hidden');
      successState.classList.add('hidden');
      if (prefillEmail) emailInput.value = prefillEmail;
      signupModal.classList.remove('hidden');
      signupModal.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
      signupModal.classList.add('hidden');
      signupModal.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    };

    document.querySelectorAll('[data-open-modal="signup"]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const prefillId = trigger.getAttribute('data-prefill-email');
        const prefillSource = prefillId ? document.getElementById(prefillId) : null;
        openModal(prefillSource ? prefillSource.value : '');
      });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !signupModal.classList.contains('hidden')) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formState.classList.add('hidden');
      successState.classList.remove('hidden');
    });
  }

  // Pricing monthly/yearly toggle (only runs on pages that have it)
  const monthlyBtn = document.getElementById('toggle-monthly');
  const yearlyBtn = document.getElementById('toggle-yearly');
  if (monthlyBtn && yearlyBtn) {
    const priceMonthly = document.querySelectorAll('.price-monthly');
    const priceYearly = document.querySelectorAll('.price-yearly');

    const setActive = (monthly) => {
      monthlyBtn.classList.toggle('bg-white', monthly);
      monthlyBtn.classList.toggle('shadow-sm', monthly);
      monthlyBtn.classList.toggle('text-slate-900', monthly);
      monthlyBtn.classList.toggle('text-slate-500', !monthly);

      yearlyBtn.classList.toggle('bg-white', !monthly);
      yearlyBtn.classList.toggle('shadow-sm', !monthly);
      yearlyBtn.classList.toggle('text-slate-900', !monthly);
      yearlyBtn.classList.toggle('text-slate-500', monthly);

      priceMonthly.forEach((el) => el.classList.toggle('hidden', !monthly));
      priceYearly.forEach((el) => el.classList.toggle('hidden', monthly));
    };

    monthlyBtn.addEventListener('click', () => setActive(true));
    yearlyBtn.addEventListener('click', () => setActive(false));
  }

  // Hero headline slogan rotator (only runs on pages that have it)
  const heroHeadline = document.getElementById('hero-headline');
  const heroSubheadline = document.getElementById('hero-subheadline');
  const heroDotsWrap = document.getElementById('hero-headline-dots');
  if (heroHeadline && heroDotsWrap) {
    const slogans = [
      'Tired of Repetitive <span class="text-gradient">Administrative Work</span>?',
      'Turn Every Meeting &amp; Business Card Into <span class="text-gradient">Actionable Intelligence</span>',
      'Build Your Own AI Agents, <span class="text-gradient">Tailored to Your Requirements</span>',
    ];
    const subheadlines = [
      'Stop losing hours to manual note-taking, data entry, and repetitive admin work — let AI agents handle it while you focus on the actual job.',
      'Automatically transcribe client meetings, convert paper business cards into structured databases, and brainstorm requirements directly with your private AI assistant.',
      'Describe the workflow you want automated and our team ships a custom AI agent for your business — deployable on your own cloud if you need it.',
    ];
    let activeSlogan = 1; // matches the slogan already in the markup
    let rotateTimer;

    slogans.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show headline ${i + 1}`);
      dot.className = 'h-1.5 rounded-full transition-all bg-slate-300 w-1.5';
      dot.addEventListener('click', () => showSlogan(i, true));
      heroDotsWrap.appendChild(dot);
    });
    const heroDots = Array.from(heroDotsWrap.children);

    const setActiveHeroDot = (index) => {
      heroDots.forEach((dot, i) => {
        dot.classList.toggle('bg-indigo-500', i === index);
        dot.classList.toggle('w-6', i === index);
        dot.classList.toggle('bg-slate-300', i !== index);
        dot.classList.toggle('w-1.5', i !== index);
      });
    };

    const showSlogan = (index, manual) => {
      heroHeadline.classList.add('opacity-0');
      if (heroSubheadline) heroSubheadline.classList.add('opacity-0');
      setTimeout(() => {
        heroHeadline.innerHTML = slogans[index];
        heroHeadline.classList.remove('opacity-0');
        if (heroSubheadline) {
          heroSubheadline.innerHTML = subheadlines[index];
          heroSubheadline.classList.remove('opacity-0');
        }
        activeSlogan = index;
        setActiveHeroDot(index);
      }, 500);
      if (manual) restartHeroRotation();
    };

    const restartHeroRotation = () => {
      clearInterval(rotateTimer);
      rotateTimer = setInterval(() => showSlogan((activeSlogan + 1) % slogans.length), 5000);
    };

    setActiveHeroDot(activeSlogan);
    restartHeroRotation();
  }

  // Agents slider (only runs on pages that have it)
  initSnapSlider({ trackId: 'agents-track', prevId: 'agents-prev', nextId: 'agents-next', dotsId: 'agents-dots', itemLabel: 'agent' });

  // Mobile app screen slider (only runs on pages that have it)
  initSnapSlider({ trackId: 'mobile-track', prevId: 'mobile-prev', nextId: 'mobile-next', dotsId: 'mobile-dots', itemLabel: 'screen' });
});
