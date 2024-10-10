document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const closeInfoButton = document.getElementById('closeInfo');

  // Check for saved mode in localStorage
  const savedMode = localStorage.getItem('theme');
  if (savedMode === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.classList.replace('fa-sun', 'fa-moon');
  }

  // Toggle mode on click
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggle.classList.toggle('fa-moon');
    themeToggle.classList.toggle('fa-sun');
  });

  // Close info.html and update storage
  closeInfoButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resetInfoShown' });
    window.close();
  });
});
