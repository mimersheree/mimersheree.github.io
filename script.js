function toggleMenu() { 
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open")
    icon.classList.toggle("open") // Opens and closes hamburger icon menu 
}

// Scroll-to-top button behavior
const scrollBtn = document.getElementById('scrollUpBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight / 2) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});