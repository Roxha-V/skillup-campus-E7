function getCourseIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

// getFavorites/toggleFavorite viven en guard.js (se comparten con dashboard.html)

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function renderCourseDetail(course) {
  const container = document.getElementById('course-detail');
  const category = course.category || 'General';
  const mediaStyle = course.image_path
    ? `background-image:url('${course.image_path}'); background-size:cover; background-position:center;`
    : '';

  const isFavorite = getFavorites().includes(String(course.id));
  const initials = getInitials(course.professor);

  container.innerHTML = `
    <nav class="breadcrumb">
      <a href="../index.html">Inicio</a>
      <span>/</span>
      <a href="catalog.html?categoria=${category}">${category}</a>
      <span>/</span>
      <span>${course.name || 'Curso'}</span>
    </nav>

    <div class="course-detail-layout">
      <div class="course-detail-main">
        <div class="course-detail-media" style="${mediaStyle}">${course.image_path ? '' : '▶'}</div>

        <h1 class="course-detail-card__title">${course.name || 'Curso'}</h1>
        <p class="course-detail-main__description">${course.description || 'Todavía no hay una descripción cargada para este curso.'}</p>

        <div class="instructor-profile">
          <div class="instructor-profile__avatar" title="${course.professor || 'SkillUp Campus'}">${initials}</div>
          <div>
            <strong>${course.professor || 'SkillUp Campus'}</strong>
            <p class="course-detail-card__author">Instructor/a del curso</p>
          </div>
        </div>

        <div class="course-card__rating"><span class="star">★</span> ${course.votes ?? '—'}</div>

        <div class="tabs" role="tablist">
          <button type="button" class="tabs__btn is-active" data-tab="desc">Descripción</button>
          <button type="button" class="tabs__btn" data-tab="contenido">Contenido de curso</button>
          <button type="button" class="tabs__btn" data-tab="instructor">Instructor</button>
          <button type="button" class="tabs__btn" data-tab="resenas">Reseñas</button>
        </div>

        <div class="tabs__panel" data-panel="desc">
          <p>${course.description || 'Todavía no hay una descripción cargada para este curso.'}</p>
        </div>
        <div class="tabs__panel" data-panel="contenido" hidden>
          <div class="placeholder-section">
            <div class="placeholder-section__icon">📚</div>
            <div class="placeholder-section__title">Todavía no existe</div>
            <p>Falta que el back agregue el temario/módulos de cada curso.</p>
          </div>
        </div>
        <div class="tabs__panel" data-panel="instructor" hidden>
          <div class="instructor-profile">
            <div class="instructor-profile__avatar" title="${course.professor || 'SkillUp Campus'}">${initials}</div>
            <div>
              <strong>${course.professor || 'SkillUp Campus'}</strong>
              <p class="course-detail-card__author">Instructor/a del curso</p>
            </div>
          </div>
        </div>
        <div class="tabs__panel" data-panel="resenas" hidden>
          <div class="placeholder-section">
            <div class="placeholder-section__icon">💬</div>
            <div class="placeholder-section__title">Todavía no existe</div>
            <p>Falta que el back agregue reseñas de estudiantes por curso.</p>
          </div>
        </div>
      </div>

      <aside class="course-detail-card">
        <span class="badge">${category}</span>

        <ul class="course-detail-card__benefits">
          <li>⏳ Acceso de por vida</li>
          <li>🎓 Certificado de finalización</li>
        </ul>

        <button type="button" id="enroll-btn" class="btn btn-primary btn-block">Inscribirme ahora</button>
        <button type="button" id="favorite-btn" class="btn btn-outline btn-block favorite-btn ${isFavorite ? 'is-active' : ''}">
          ${isFavorite ? '♥ En favoritos' : '♡ Añadir a favorito'}
        </button>
        <p id="enroll-message"></p>
      </aside>
    </div>

    <div class="modal-overlay" id="enroll-modal" hidden>
      <div class="modal">
        <div class="modal__icon">✓</div>
        <p class="modal__title">¡Te has inscrito con éxito!</p>
        <p class="modal__text">Ya podés acceder al curso desde tu panel de estudiante.</p>
        <a href="dashboard.html" class="btn btn-primary">Ir a mis cursos</a>
      </div>
    </div>
  `;

  document.getElementById('enroll-btn').addEventListener('click', () => handleEnroll(course.id));
  document.getElementById('favorite-btn').addEventListener('click', () => handleToggleFavorite(course.id));
  initTabs();
}

function handleToggleFavorite(courseId) {
  const button = document.getElementById('favorite-btn');
  const isFavorite = toggleFavorite(courseId);
  button.classList.toggle('is-active', isFavorite);
  button.textContent = isFavorite ? '♥ En favoritos' : '♡ Añadir a favorito';
}

function initTabs() {
  const buttons = document.querySelectorAll('.tabs__btn');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      button.classList.add('is-active');

      document.querySelectorAll('.tabs__panel').forEach((panel) => {
        panel.hidden = panel.dataset.panel !== button.dataset.tab;
      });
    });
  });
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
    button.textContent = 'Inscripto';
    const modal = document.getElementById('enroll-modal');
    modal.hidden = false;
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.hidden = true;
    });
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
