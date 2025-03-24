export function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const body = document.body;

  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.className = theme === 'dark'
      ? 'fas fa-sun fa-icon'
      : 'fas fa-moon fa-icon';
    themeToggle.setAttribute('aria-label', `${theme} mode`);
  }

  themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  });

  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  const spinner = document.querySelector('.fa-spinner');
  if (spinner) {
    spinner.style.animation = 'spin 1s linear infinite';
  }
}