# Skillup Campus

Plataforma de educación en línea para el aprendizaje de habilidades técnicas.

## Integrantes

-Rocio Valverde
-Consuelo Vigo Cipriani
-Samanta Bravo
-Fabricio Rivarola

## Estructura del Proyecto

```
skillup-campus/
├── backend/          # API REST (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   ├── .env.example
│   └── package.json
├── frontend/         # SPA (HTML/CSS/JS)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── styles/
│   │   └── js/
│   └── index.html
├── docs/             # Documentación
│   ├── ux/           # Wireframes
│   └── api/          # Colección Postman
└── README.md
```

## Instalación

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
# Servir con un servidor local (python, http-server, etc.)
```

## Tecnologías

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Documentación**: 


## Licencia

MIT
