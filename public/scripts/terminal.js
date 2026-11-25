(() => {
  const root = document.querySelector('[data-hero-terminal]');
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lineEls = Array.from(root.querySelectorAll('[data-terminal-line]'));
  const textTargets = lineEls.map((el) => el.querySelector('[data-terminal-text]'));

  lineEls.forEach((el, idx) => {
    if (idx > 0) el.classList.add('opacity-0', 'transition-opacity', 'duration-200');
    const target = textTargets[idx];
    if (target && idx === 0) {
      const full = target.dataset.terminalText || '';
      target.textContent = '';
      let cursor = 0;
      const timer = window.setInterval(() => {
        cursor += 1;
        target.textContent = full.slice(0, cursor);
        if (cursor >= full.length) window.clearInterval(timer);
      }, 28);
    }
  });

  const delays = [0, 520, 920, 1450, 1780, 2100];
  lineEls.forEach((el, idx) => {
    if (idx === 0) return;
    window.setTimeout(() => {
      el.classList.remove('opacity-0');
      el.classList.add('opacity-100');
      const target = textTargets[idx];
      if (target && idx === 2) {
        const full = target.dataset.terminalText || '';
        target.textContent = '';
        let cursor = 0;
        const t = window.setInterval(() => {
          cursor += 2;
          target.textContent = full.slice(0, cursor);
          if (cursor >= full.length) window.clearInterval(t);
        }, 22);
      }
    }, delays[idx] ?? idx * 420);
  });
})();
