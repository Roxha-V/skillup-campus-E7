let editingCourseId = null;
let editingCourseOriginal = null;

function showAdminMessage(elementId, message, isError = true) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.className = isError ? 'form-error' : 'admin-message admin-message--success';
}

function clearAdminMessage(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.className = '';
}

function showCourseFormSection() {
  document.getElementById('course-form-section').hidden = false;
}

function hideCourseFormSection() {
  document.getElementById('course-form-section').hidden = true;
}

function fillCourseForm(course) {
  const form = document.getElementById('course-form');
  form.name.value = course.name || '';
  form.category.value = course.category || 'tecnologia';
  form.professor.value = course.professor || '';
  form.image_path.value = course.image_path || '';
  form.description.value = course.description || '';

  editingCourseId = course.id;
  editingCourseOriginal = { ...course };
  document.getElementById('course-form-title').textContent = 'Editar curso';
  document.getElementById('course-form-submit').textContent = 'Guardar cambios';
  showCourseFormSection();
}

function resetCourseForm() {
  const form = document.getElementById('course-form');
  form.reset();
  editingCourseId = null;
  editingCourseOriginal = null;
  document.getElementById('course-form-title').textContent = 'Crear curso';
  document.getElementById('course-form-submit').textContent = 'Crear curso';
  clearAdminMessage('course-form-message');
  hideCourseFormSection();
}

function renderCoursesTable(courses) {
  const tbody = document.getElementById('courses-table-body');
  tbody.innerHTML = '';

  if (!courses || courses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No hay cursos cargados todavía.</td></tr>';
    return;
  }

  courses.forEach((course) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${course.name || ''}</td>
      <td>${course.category || ''}</td>
      <td>${course.professor || ''}</td>
      <td class="admin-table__actions">
        <button type="button" class="icon-btn" data-action="edit" data-id="${course.id}" aria-label="Editar curso" title="Editar">✏️</button>
        <button type="button" class="icon-btn icon-btn--danger" data-action="delete" data-id="${course.id}" aria-label="Eliminar curso" title="Eliminar">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function loadCoursesTable() {
  const tbody = document.getElementById('courses-table-body');
  tbody.innerHTML = '<tr><td colspan="4">Cargando cursos...</td></tr>';

  try {
    const courses = await getCourses();
    window.__adminCourses = courses || [];
    renderCoursesTable(window.__adminCourses);
    document.getElementById('stat-total-courses').textContent = window.__adminCourses.length;
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="form-error">${err.message}</td></tr>`;
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '';

  if (!users || users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">No hay usuarios para mostrar.</td></tr>';
    return;
  }

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name || ''}</td>
      <td>${user.email || ''}</td>
      <td>${user.role || 'user'}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadUsersTable() {
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '<tr><td colspan="3">Cargando usuarios...</td></tr>';

  try {
    const users = await getAdminUsers();
    renderUsersTable(users);
    document.getElementById('stat-total-users').textContent = users ? users.length : 0;
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="3" class="form-error">${err.message}</td></tr>`;
  }
}

function initCourseForm() {
  const form = document.getElementById('course-form');
  const cancelBtn = document.getElementById('course-form-cancel');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAdminMessage('course-form-message');

    const course = {
      name: form.name.value.trim(),
      category: form.category.value,
      professor: form.professor.value.trim(),
      image_path: form.image_path.value.trim(),
      description: form.description.value.trim(),
    };

    if (!course.name || !course.professor || !course.description) {
      showAdminMessage('course-form-message', 'Completá nombre, profesor y descripción.');
      return;
    }

    const submitBtn = document.getElementById('course-form-submit');
    submitBtn.disabled = true;

    try {
      if (editingCourseId) {
        // El back solo permite actualizar un campo a la vez (PUT /admin/courses/:id/:field/:value),
        // así que mandamos un request por cada campo que haya cambiado.
        const changedFields = Object.keys(course).filter(
          (field) => course[field] !== (editingCourseOriginal?.[field] || '')
        );

        for (const field of changedFields) {
          await updateCourseField(editingCourseId, field, course[field]);
        }
        showAdminMessage('course-form-message', 'Curso actualizado con éxito.', false);
      } else {
        await createCourse(course);
        showAdminMessage('course-form-message', 'Curso creado con éxito.', false);
      }
      resetCourseForm();
      loadCoursesTable();
    } catch (err) {
      showAdminMessage('course-form-message', err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });

  cancelBtn.addEventListener('click', resetCourseForm);

  document.getElementById('new-course-btn').addEventListener('click', () => {
    resetCourseForm();
    showCourseFormSection();
    document.getElementById('course-form-section').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('courses-table-body').addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.action === 'edit') {
      const course = (window.__adminCourses || []).find((c) => String(c.id) === String(id));
      if (course) {
        fillCourseForm(course);
        document.getElementById('course-form-section').scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (button.dataset.action === 'delete') {
      if (!confirm('¿Seguro que querés eliminar este curso?')) return;
      button.disabled = true;
      try {
        await deleteCourse(id);
        loadCoursesTable();
      } catch (err) {
        alert(err.message);
        button.disabled = false;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;

  initCourseForm();
  loadCoursesTable();
  loadUsersTable();
});
