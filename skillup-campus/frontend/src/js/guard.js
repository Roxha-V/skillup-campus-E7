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

// Favoritos: no hay endpoint en el back todavía, así que se guardan
// en localStorage. Funciona de verdad, solo que no sincroniza entre
// dispositivos hasta que el back agregue el endpoint.
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch (err) {
    return [];
  }
}

function toggleFavorite(courseId) {
  const favorites = getFavorites();
  const id = String(courseId);
  const index = favorites.indexOf(id);

  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  return favorites.includes(id);
}

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}
