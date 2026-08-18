const API_URL = 'http://localhost:3001/api';

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (err) {
    throw new Error('No se pudo conectar con el servidor. Intenta nuevamente más tarde.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Ocurrió un error inesperado. Intenta nuevamente.');
  }

  return data;
}

function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

function register(name, email, password) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

function getCourses() {
  return apiRequest('/courses');
}

function getCourseById(id) {
  return apiRequest(`/courses/${id}`);
}

function enrollInCourse(courseId) {
  return apiRequest('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

function getMyEnrollments() {
  return apiRequest('/enrollments/me');
}
