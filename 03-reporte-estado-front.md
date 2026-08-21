# Reporte de estado — SOLO FRONT (skillup-campus-E7-front)

Revisé todo lo que hay en `skillup-campus/frontend/` contra la lista de tareas que pasaste. Esto es control nomás, no toqué nada.

## ✅ Lo que YA está hecho

**Login y Register (pages/login.html, pages/register.html)**
- Los dos formularios están maquetados, centrados, con inputs consistentes y botón primario.
- Validación HTML básica: `required`, `type="email"`, `minlength="8"` en passwords, checkbox de términos required.
- Conectados a la API real vía `src/js/auth.js`: login guarda el JWT en `localStorage`, redirige a dashboard (o a la página que pedías con `?redirect=`), y register valida que las contraseñas coincidan antes de mandar.
- Mensajes de error amigables (`showFormError`) cuando la API responde mal.

**Catálogo (pages/catalog.html)**
- Ya NO tiene datos hardcodeados — está conectado a `GET /api/courses` a través de `src/js/catalog.js`.
- Existe `renderCourseCard(course)` como pedía la consigna, con imagen, categoría, título, autor, rating y botón "Ver más".
- Layout con grid de cards, navbar y footer reutilizados en todas las páginas.

**Detalle de curso (pages/course-detail.html)**
- Trae el curso por id desde la API.
- Botón "Inscribirme" que llama a `POST /api/enrollments`, y si no estás logueado te manda al login con redirect de vuelta.

**Dashboard (pages/dashboard.html)**
- Protegida con `guard.js` (`requireAuth()` — si no hay token, redirige a login).
- Muestra `GET /api/enrollments/me` con las cards de los cursos inscriptos.
- Botón de logout que borra el token.

**src/js/api.js**
- Todas las funciones reutilizables están: `login`, `register`, `getCourses`, `getCourseById`, `enrollInCourse`, `getMyEnrollments`. Manejo centralizado de errores en `apiRequest`.

En resumen: **todo lo de la Semana 3 de front (3.1 y 3.2) y todo lo de conectar formularios/catálogo/inscripciones con la API ya está hecho y andando.**

## ✅ ACTUALIZACIÓN — Panel de Administración (ya armado)

Ya creé lo que faltaba:

- `pages/admin.html` — protegida con `requireAdmin()` (nueva función en `guard.js` que decodifica el payload del JWT y chequea `role === 'admin'`; si no sos admin te manda al dashboard, si no estás logueada te manda al login).
- Listado de cursos en tabla con botones **Editar** / **Eliminar** (`src/js/admin.js`).
- Formulario de creación/edición de curso (mismo form sirve para las dos cosas, cambia el texto y el modo según si estás editando o creando).
- Listado de usuarios en tabla, con nombre/email/rol.
- Sumé a `src/js/api.js`: `createCourse`, `updateCourse`, `deleteCourse`, `getAdminUsers`.
- Sumé `src/styles/admin.css` para las tablas y el form (reutiliza las variables de `variables.css`, no inventé colores nuevos).
- En el dashboard aparece un botón "Panel admin" si el usuario logueado tiene `role: admin`.

### ⚠️ Importante: esto necesita que el BACK tenga los endpoints

Revisé `skillup-campus/backend/src/routes/` y **por ahora el back solo tiene las rutas de auth** (`/register`, `/login`, `/profile`). No existen todavía:
- `GET/POST/PUT/DELETE /api/courses`
- `POST /api/enrollments`, `GET /api/enrollments/me`
- `GET /api/admin/users`

O sea: el admin panel (y el catálogo, y el dashboard) están listos del lado front, pero **no vas a poder probarlos de punta a punta hasta que el back implemente esas rutas**. Esto no es algo que tengas que resolver vos — avisale a la persona de back que el front ya está esperando esos endpoints con esa forma exacta (mirá `src/js/api.js` para ver los paths y body que mando).

## Cómo probarlo vos (front)

Para poder probar lo que ya está hecho necesitás el backend corriendo en `http://localhost:3001` (así está hardcodeado en `api.js`):

```bash
cd skillup-campus/backend
npm install   # si no lo hiciste
npm run dev
```

Y para el front, como son archivos HTML sueltos con `fetch`, necesitás servirlos con un server local (no abrirlos con doble click porque puede haber problemas de CORS/paths). Por ejemplo:

```bash
cd skillup-campus/frontend
npx serve .
# o la extensión Live Server de VSCode
```

Flujo para probar (una vez que el back tenga las rutas de cursos/enrollments/admin):
1. Abrí `pages/register.html`, creá un usuario.
2. Te loguea automático y te manda a `dashboard.html`.
3. Andá a `pages/catalog.html`, entrá a un curso, dale "Inscribirme".
4. Volvé a `dashboard.html` y fijate que aparezca el curso.
5. Si tu usuario tiene `role: admin` en la base (esto lo tiene que setear el back, el registro normal crea usuarios con rol común), vas a ver el botón "Panel admin" en el dashboard. Ahí podés crear/editar/eliminar cursos y ver el listado de usuarios.

Por ahora, como el back solo tiene auth, lo único que podés probar de punta a punta es registro y login. El resto (catálogo, inscripciones, admin) está listo pero va a tirar error de conexión hasta que el back sume las rutas que faltan.
