function togglePasswordVisibility(buttonId, inputId) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);

  if (!button || !input) return;

  button.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    button.textContent = isHidden ? '🙈' : '👁';
  });
}

function initNavbarDropdowns() {
  const dropdowns = document.querySelectorAll('.navbar__dropdown');

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.navbar__dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');

      dropdowns.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.navbar__dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        dropdown.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      dropdown.querySelector('.navbar__dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      dropdown.querySelector('.navbar__dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('DOMContentLoaded', initNavbarDropdowns);
