(() => {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const panel = document.getElementById('mobile-menu-panel');
  if (!toggleBtn || !panel) return;

  const openIcon = toggleBtn.querySelector('[data-icon-open]');
  const closeIcon = toggleBtn.querySelector('[data-icon-close]');

  function setMenuOpen(open) {
    toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    if (open) {
      panel.removeAttribute('hidden');
      if (openIcon) openIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    } else {
      panel.setAttribute('hidden', '');
      if (openIcon) openIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggleBtn.focus();
    }
  });
})();
