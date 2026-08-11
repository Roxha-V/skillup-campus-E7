# Tarea 1.2 — Listado de páginas y vistas del Frontend

Proyecto: SkillUp Campus (MVP) · Equipo 7 · Rol Frontend

## 1. Home
- Header (logo, nav, botones Login/Registro)
- Hero / banner principal
- Sección destacada de cursos (cards)
- Footer

**Datos que consume:** listado corto de cursos destacados (público, sin login).

## 2. Login
- Header simple (logo + link a Registro)
- Formulario: email, contraseña
- Botón "Iniciar sesión"
- Mensajes de error de validación
- Link "¿Olvidaste tu contraseña?" (si aplica al MVP)

**Datos que consume:** envía credenciales → recibe token/sesión de usuario.

## 3. Register
- Header simple (logo + link a Login)
- Formulario: nombre, email, contraseña, confirmar contraseña
- Validaciones (campos requeridos, formato email, coincidencia de contraseñas)
- Botón "Registrarse"

**Datos que consume:** envía datos de registro → recibe confirmación/usuario creado.

## 4. Catálogo de cursos
- Header (con estado logueado/no logueado)
- Buscador y/o filtros (categoría, nivel)
- Grid de cards de curso (imagen, título, descripción corta, nivel)
- Paginación o scroll infinito
- Footer

**Datos que consume:** listado de cursos públicos (GET /courses).

## 5. Detalle de curso
- Header
- Información del curso: título, descripción completa, nivel, contenido/temario
- Botón "Inscribirme" (o "Iniciá sesión para inscribirte" si no está logueado)
- Estado de inscripción si ya está inscripto

**Datos que consume:** detalle del curso por ID (GET /courses/:id) + estado de inscripción del usuario si aplica.

## 6. Dashboard del usuario
- Header (usuario logueado)
- Listado de "Mis cursos" (cards con progreso o estado, si aplica)
- Estado vacío si no tiene cursos inscriptos
- Acceso rápido al catálogo

**Datos que consume:** cursos inscriptos del usuario logueado (GET /users/:id/courses).

## 7. Panel Admin
- Header/sidebar de administración
- Listado de cursos (tabla) con acciones: crear, editar, eliminar
- Formulario de curso (crear/editar): título, descripción, categoría, nivel, imagen
- Listado básico de usuarios (ver/gestionar)

**Datos que consume:** CRUD de cursos (GET/POST/PUT/DELETE /courses) y gestión de usuarios (GET/PUT/DELETE /users), protegido por rol admin.

## Resumen de vistas (para Kanban)

| # | Vista | Prioridad | Requiere login | Requiere rol admin |
|---|---|---|---|---|
| 1 | Home | Alta | No | No |
| 2 | Login | Alta | No | No |
| 3 | Register | Alta | No | No |
| 4 | Catálogo de cursos | Alta | No | No |
| 5 | Detalle de curso | Alta | No (ver) / Sí (inscribirse) | No |
| 6 | Dashboard usuario | Media | Sí | No |
| 7 | Panel Admin | Alta | Sí | Sí |

## Pendiente (acción manual)
- Crear una tarjeta en el Kanban de frontend por cada una de las 7 vistas de la tabla, con sus elementos y prioridad como checklist.
