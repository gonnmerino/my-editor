# my-editor

App de notas estilo Notion: editor de texto enriquecido, notas fijadas, borrado suave y cuentas de usuario con login. Cada usuario ve solo sus notas.

## Tecnologías

**Frontend** (`frontend/`)
- React 19 + Vite
- Tailwind CSS 4
- Tiptap (editor, con guardado en Markdown)

**Backend** (`backend/`)
- Node/Bun + Express 5
- PostgreSQL (`pg`)
- Autenticación con JWT (access token) y refresh token en cookie `httpOnly`
- `bcryptjs` para las contraseñas

## Requisitos

- [Bun](https://bun.sh) (o Node 20+ con npm)
- PostgreSQL

## Cómo iniciar

### 1. Base de datos

Crear una base vacía, por ejemplo `my_editor`. Las tablas se crean con las migraciones (ver el paso 2).

### 2. Backend

```bash
cd backend
bun install
```

Crear `backend/.env`:

```
PORT=3000
DATABASE_URL=postgresql://USUARIO:CLAVE@localhost:5432/my_editor
JWT_SECRET=un_texto_largo_y_aleatorio
FRONTEND_URL=http://localhost:5173
```

Crear las tablas (se repite cada vez que se agrega una migración nueva):

```bash
bun run migrate
```

Iniciar:

```bash
bun run dev
```

### 3. Frontend

```bash
cd frontend
bun install
```

Crear `frontend/.env`:

```
VITE_API_URL=http://localhost:3000/api/v1
```

Iniciar:

```bash
bun run dev
```

Abrir `http://localhost:5173`, crear una cuenta y empezar a escribir.

## Estructura

```
my-editor/
├── frontend/
│   ├── .env                      URL de la API
│   ├── package.json
│   └── src/
│       ├── main.jsx              punto de entrada
│       ├── App.jsx               estado de las notas y acciones
│       ├── Tiptap.jsx            editor de texto
│       ├── index.css             estilos y tema (Tailwind)
│       ├── auth/
│       │   └── AuthContext.jsx   sesión del usuario (login, registro, logout)
│       ├── components/
│       │   ├── AuthGate.jsx      decide si mostrar el login o la app
│       │   ├── AuthPage.jsx      pantalla de login y registro
│       │   ├── Sidebar.jsx       lista de notas
│       │   ├── NoteView.jsx      título y editor de la nota abierta
│       │   ├── SlashMenu.jsx     menú que se abre con "/"
│       │   └── BubbleToolbar.jsx barra flotante de formato
│       └── utils/
│           ├── client.js         peticiones a la API con token y refresh
│           ├── slashCommand.js   comandos del menú "/"
│           └── menuStyles.js     estilos compartidos de los menús
└── backend/
    ├── .env                      puerto, base de datos, claves
    ├── package.json
    ├── migrations/               esquema de la base (archivos .sql numerados)
    ├── scripts/
    │   └── migrate.js            aplica las migraciones pendientes
    └── src/
        ├── app.js                configura y arranca Express
        ├── db/
        │   └── db.js             conexión a PostgreSQL
        ├── routes/
        │   ├── auth.router.js    registro, login, refresh y logout
        │   └── notes.router.js   CRUD de notas
        ├── repositories/         consultas SQL (users, notes, refresh tokens)
        ├── middlewares/
        │   └── requireAuth.js    valida el access token
        └── utils/
            └── token.js          generación y hash de tokens
```
