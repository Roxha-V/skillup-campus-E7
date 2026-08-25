function getCourseIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function renderCourseDetail(course) {
  const container = document.getElementById('course-detail');
  const category = course.category || 'General';
  const mediaStyle = course.image_path
    ? `background-image:url('${course.image_path}'); background-size:cover; background-position:center;`
    : '';

  container.innerHTML = `
    <nav class="breadcrumb">
      <a href="catalog.html">Cursos</a>
      <span>/</span>
      <a href="catalog.html?categoria=${category}">${category}</a>
      <span>/</span>
      <span>${course.name || 'Curso'}</span>
    </nav>

    <div class="course-detail-layout">
      <div class="course-detail-main">
        <div class="course-detail-media" style="${mediaStyle}">${course.image_path ? '' : '▶'}</div>

        <div class="tabs" role="tablist">
          <button type="button" class="tabs__btn is-active" data-tab="desc">Descripción</button>
          <button type="button" class="tabs__btn" data-tab="instructor">Instructor</button>
        </div>

        <div class="tabs__panel" data-panel="desc">
          <p>${course.description || 'Todavía no hay una descripción cargada para este curso.'}</p>
        </div>
        <div class="tabs__panel" data-panel="instructor" hidden>
          <p>Este curso está dictado por <strong>${course.professor || 'SkillUp Campus'}</strong>.</p>
        </div>
      </div>

      <aside class="course-detail-card">
        <span class="badge">${category}</span>
        <h1 class="course-detail-card__title">${course.name || 'Curso'}</h1>
        <p class="course-detail-card__author">Dictado por ${course.professor || 'SkillUp Campus'}</p>
        <div class="course-card__rating"><span class="star">★</span> ${course.votes ?? '—'}</div>
        <button type="button" id="enroll-btn" class="btn btn-primary btn-block">Inscribirme</button>
        <p id="enroll-message"></p>
      </aside>
    </div>
  `;

  document.getElementById('enroll-btn').addEventListener('click', () => handleEnroll(course.id));
  initTabs();
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
