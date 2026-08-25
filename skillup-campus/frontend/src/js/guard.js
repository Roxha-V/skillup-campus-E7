function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function requireAuth(redirectTo = 'login.html') {
  if (!isLoggedIn()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    return null;
  }
}

function requireAdmin(redirectTo = 'login.html') {
  if (!requireAuth(redirectTo)) return false;

  const user = getUserFromToken();
  if (!user || user.role !== 'admin') {
    window.location.href = 'dashboard.html';
    return false;
  }
  return true;
}
