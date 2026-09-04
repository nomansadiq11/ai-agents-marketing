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
});
