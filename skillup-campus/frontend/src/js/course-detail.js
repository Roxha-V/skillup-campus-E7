function getCourseIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function renderCourseDetail(course) {
  const container = document.getElementById('course-detail');
  container.innerHTML = `
    <span class="badge">${course.category || 'General'}</span>
    <h1 class="page-header__title">${course.name || 'Curso'}</h1>
    <p class="page-header__subtitle">${course.description || ''}</p>
    <p class="course-card__author">Dictado por ${course.professor || 'SkillUp Campus'}</p>
    <div class="course-card__meta">
      <span class="course-card__rating"><span class="star">★</span> ${course.votes ?? '—'}</span>
    </div>
    <button type="button" id="enroll-btn" class="btn btn-primary">Inscribirme</button>
    <p id="enroll-message"></p>
  `;

  document.getElementById('enroll-btn').addEventListener('click', () => handleEnroll(course.id));
}

async function handleEnroll(courseId) {
  const button = document.getElementById('enroll-btn');
  const message = document.getElementById('enroll-message');
  message.textContent = '';

  if (!requireAuth(`login.html?redirect=course-detail.html?id=${courseId}`)) {
    return;
  }

  button.disabled = true;
  button.textContent = 'Inscribiendo...';

  try {
    await enrollInCourse(courseId);
    message.textContent = '¡Listo! Te inscribiste al curso.';
    button.textContent = 'Inscripto';
  } catch (err) {
    message.textContent = err.message;
    message.classList.add('form-error');
    button.disabled = false;
    button.textContent = 'Inscribirme';
  }
}

async function loadCourseDetail() {
  const container = document.getElementById('course-detail');
  const id = getCourseIdFromUrl();

  if (!id) {
    container.innerHTML = '<p class="form-error">No se especificó ningún curso.</p>';
    return;
  }

  try {
    const course = await getCourseById(id);
    renderCourseDetail(course);
  } catch (err) {
    container.innerHTML = `<p class="form-error">${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadCourseDetail);
