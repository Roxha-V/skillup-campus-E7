# Documentación de rutas API

Resumen breve de las rutas disponibles en el backend.

## Prefijos de ruta (montadas en `src/index.js`)
- `/api/auth` → rutas de autenticación
- `/api/courses` → rutas públicas de cursos
- `/api/admin/courses` → rutas administrativas de cursos (requieren autenticación y rol admin)

---

## Rutas de autenticación (`/api/auth`)
- **POST** `/api/auth/register` : Registrar un usuario.
  - Controller: `authController.register`
  - Middleware: ninguno

- **POST** `/api/auth/login` : Iniciar sesión y obtener token.
  - Controller: `authController.login`
  - Middleware: ninguno

- **GET** `/api/auth/profile` : Obtener perfil del usuario autenticado.
  - Controller: (ruta protegida, manejada por `authMiddleware`)
  - Middleware: `authMiddleware` (ver `src/middlewares/authmiddle.js`) — verifica JWT y crea `req.user`.

---

## Rutas públicas de cursos (`/api/courses`)
- **GET** `/api/courses/` : Obtener todos los cursos.
  - Controller: `coursePublicController.getAllCourses`
  - Middleware: ninguno

- **GET** `/api/courses/:id` : Obtener curso por su ID.
  - Controller: `coursePublicController.getCourseById`
  - Middleware: ninguno

---

## Rutas administrativas de cursos (`/api/admin/courses`)
Estas rutas usan el arreglo `adminAuth = [authenticate, isAdmin]` definido en `src/routes/courseAdminRoutes.js`.
- `authenticate` — extrae y verifica JWT, crea `req.user` (`src/middlewares/adminmiddle.js`).
- `isAdmin` — comprueba `req.user.role === 'admin'`.

- **POST** `/api/admin/courses/create` : Crear un nuevo curso.
  - Controller: `courseAdminController.createCourse`
  - Middleware: `authenticate`, `isAdmin`

- **PUT** `/api/admin/courses/:id/:field/:value` : Actualizar un campo específico de un curso.
  - Controller: `courseAdminController.updateCourse`
  - Middleware: `authenticate`, `isAdmin`

- **DELETE** `/api/admin/courses/:id` : Eliminar un curso por ID.
  - Controller: `courseAdminController.deleteCourse`
  - Middleware: `authenticate`, `isAdmin`

---

## Notas rápidas
- La autenticación usa JWT; las claves se verifican con `process.env.JWT_SECRET`.
- Los controladores están en `src/controllers/`.
- Para más detalles de implementación revisar:
  - [src/routes/auth.js](src/routes/auth.js)
  - [src/routes/coursePublicRoutes.js](src/routes/coursePublicRoutes.js)
  - [src/routes/courseAdminRoutes.js](src/routes/courseAdminRoutes.js)
  - [src/middlewares/authmiddle.js](src/middlewares/authmiddle.js)
  - [src/middlewares/adminmiddle.js](src/middlewares/adminmiddle.js)
