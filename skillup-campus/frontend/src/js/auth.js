function showFormError(form, message) {
  let errorBox = form.querySelector('.form-error');
  if (!errorBox) {
    errorBox = document.createElement('p');
    errorBox.className = 'form-error';
    form.prepend(errorBox);
  }
  errorBox.textContent = message;
}

function clearFormError(form) {
  form.querySelector('.form-error')?.remove();
}

function setLoading(button, isLoading, loadingText, defaultText) {
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : defaultText;
}

function initLoginForm() {
  const form = document.querySelector('.auth__form');
  if (!form || !document.getElementById('remember')) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const defaultText = submitButton.textContent;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearFormError(form);

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      showFormError(form, 'Completá tu correo y contraseña.');
      return;
    }

    setLoading(submitButton, true, 'Ingresando...', defaultText);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirect || 'dashboard.html';
    } catch (err) {
      showFormError(form, err.message);
    } finally {
      setLoading(submitButton, false, 'Ingresando...', defaultText);
    }
  });
}

function initRegisterForm() {
  const form = document.querySelector('.auth__form');
  if (!form || !document.getElementById('confirm-password')) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const defaultText = submitButton.textContent;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearFormError(form);

    const firstName = form['first-name'].value.trim();
    const lastName = form['last-name'].value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form['confirm-password'].value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showFormError(form, 'Completá todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      showFormError(form, 'Las contraseñas no coinciden.');
      return;
    }

    if (!form.terms.checked) {
      showFormError(form, 'Debés aceptar los términos y condiciones.');
      return;
    }

    setLoading(submitButton, true, 'Creando cuenta...', defaultText);
    try {
      const name = `${firstName} ${lastName}`;
      await register(name, email, password);
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } catch (err) {
      showFormError(form, err.message);
    } finally {
      setLoading(submitButton, false, 'Creando cuenta...', defaultText);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initRegisterForm();
});
