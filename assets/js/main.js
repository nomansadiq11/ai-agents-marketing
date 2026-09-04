// Shared page behaviour for Agentic Hub marketing pages.
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

  // Agents slider (only runs on pages that have it)
  const track = document.getElementById('agents-track');
  const prevBtn = document.getElementById('agents-prev');
  const nextBtn = document.getElementById('agents-next');
  const dotsWrap = document.getElementById('agents-dots');
  if (track && dotsWrap) {
    const cards = Array.from(track.children);

    // Build one dot per card
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to agent ${i + 1}`);
      dot.className = 'h-1.5 rounded-full transition-all bg-slate-300 w-1.5';
      dot.addEventListener('click', () => {
        track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
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

    const closestCardIndex = () => {
      const trackCenter = track.scrollLeft + track.offsetLeft;
      let closest = 0;
      let smallestDiff = Infinity;
      cards.forEach((card, i) => {
        const diff = Math.abs(card.offsetLeft - trackCenter);
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
      scrollTimeout = setTimeout(() => setActiveDot(closestCardIndex()), 100);
    });

    const scrollByCard = (direction) => {
      const current = closestCardIndex();
      const target = cards[Math.min(cards.length - 1, Math.max(0, current + direction))];
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    };

    if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));

    setActiveDot(0);
  }
});
