const CATEGORY_ICONS = {
  diseno: '🎨',
  negocios: '📊',
  tecnologia: '🐍',
  marketing: '📣',
  productividad: '🗒️',
};

function renderCourseCard(course) {
  const category = course.category || 'General';
  const icon = CATEGORY_ICONS[course.category] || '📚';

  const card = document.createElement('article');
  card.className = 'course-card';
  card.innerHTML = `
    <div class="course-card__image" style="background-color:#0f172a; color:#fff;">${icon}</div>
    <div class="course-card__body">
      <span class="badge">${category}</span>
      <h2 class="course-card__title">${course.title || course.name || 'Curso'}</h2>
      <p class="course-card__author">${course.instructor || course.author || ''}</p>
      <div class="course-card__meta">
        <span class="course-card__rating"><span class="star">★</span> ${course.rating ?? '—'}</span>
        <span>${course.duration ? `${course.duration} horas` : ''}</span>
      </div>
      <a class="btn btn-outline course-card__cta" href="course-detail.html?id=${course.id}">Ver más</a>
    </div>
  `;
  return card;
}

async function loadCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  grid.innerHTML = '<p>Cargando cursos...</p>';

  try {
    const courses = await getCourses();

    if (!courses || courses.length === 0) {
      grid.innerHTML = '<p>No hay cursos disponibles por el momento.</p>';
      return;
    }

    grid.innerHTML = '';
    courses.forEach((course) => grid.appendChild(renderCourseCard(course)));
  } catch (err) {
    grid.innerHTML = `<p class="form-error">${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadCatalog);
