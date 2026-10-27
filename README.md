# Eventos Deportivos API

API REST para una plataforma de eventos deportivos e inscripciones.

Proyecto desarrollado como primera pre-entrega del curso Desarrollo Avanzado de Backend II.

## Temática

La plataforma estará orientada a la publicación de eventos deportivos, como torneos de vóley, encuentros y clínicas, y a la gestión de sus inscripciones.

## Alcance de esta entrega

Esta etapa implementa la base arquitectónica del proyecto:

- Servidor Express separado de la configuración de la aplicación.
- Variables de entorno mediante dotenv.
- Rutas y controladores para health, events y sessions.
- Modelos base User y Event.
- Carpetas preparadas para servicios, repositorios, DAO, middlewares y utilidades.

Todavía no se implementan persistencia, autenticación, roles, inscripciones ni control de cupos.

## Tecnologías

- Node.js 22 o superior.
- Express.
- dotenv.
- JavaScript con módulos ESM (`import` y `export`).
- Git y GitHub.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/dabouzajm-lang/eventos-deportivos-api.git
```

Ingresar a la carpeta:

```bash
cd eventos-deportivos-api
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz a partir de `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En Git Bash, Linux o macOS:

```bash
cp .env.example .env
```

Configurar las variables:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/eventos_deportivos
JWT_SECRET=reemplazar_por_un_secreto_propio
```

| Variable | Descripción |
| --- | --- |
| PORT | Puerto del servidor. Si no está definido, se utiliza 8080. |
| NODE_ENV | Entorno de ejecución. Por defecto, development. |
| MONGO_URL | URL reservada para la futura conexión a MongoDB. |
| JWT_SECRET | Secreto reservado para la futura autenticación con JWT. |

En esta entrega no se utiliza MongoDB ni JWT, por lo que no es necesario tener una base de datos funcionando.

El valor de JWT_SECRET es un marcador que deberá reemplazarse al implementar autenticación.

El archivo `.env` y la carpeta `node_modules` están excluidos del repositorio mediante `.gitignore`.

## Ejecución

Modo desarrollo, con reinicio automático al guardar cambios:

```bash
npm run dev
```

Ejecución normal:

```bash
npm start
```

Con la configuración de ejemplo, el servidor estará disponible en:

```text
http://localhost:8080
```

Los comandos deben ejecutarse desde la raíz del proyecto.

## Estructura del proyecto

```text
eventos-deportivos-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── env.config.js
│   ├── routes/
│   │   ├── health.router.js
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   │   └── .gitkeep
│   ├── repositories/
│   │   └── .gitkeep
│   ├── dao/
│   │   └── .gitkeep
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   │   └── .gitkeep
│   └── utils/
│       └── .gitkeep
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

El archivo `.env` se crea localmente y no se incluye en GitHub.

Los archivos `.gitkeep` permiten conservar las carpetas que todavía no contienen código.

### Responsabilidades

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| app.js | Configura Express, express.json() y los routers. |
| server.js | Inicia el servidor en el puerto configurado. |
| config/ | Centraliza las variables de entorno. |
| routes/ | Define las rutas y sus controladores. |
| controllers/ | Recibe las peticiones y genera las respuestas HTTP. |
| services/ | Reservada para las reglas de negocio. |
| repositories/ | Reservada para abstraer el acceso a los datos. |
| dao/ | Reservada para las operaciones de persistencia. |
| models/ | Define los campos base de usuarios y eventos. |
| middlewares/ | Reservada para funciones intermedias, como validaciones y autenticación. |
| utils/ | Reservada para funciones auxiliares. |

En esta etapa, las peticiones pasan por el router y el controlador. Las demás capas se incorporarán al flujo en las siguientes entregas.

## Modelos base

Los modelos son clases de JavaScript, sin persistencia ni validaciones por el momento.

### User

- firstName
- lastName
- email
- password

Al implementar registro y persistencia, password deberá contener un hash, nunca la contraseña original.

### Event

- title
- description
- date
- location
- capacity

## Rutas disponibles

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | /api/health | Comprueba que el servidor está activo. |
| GET | /api/events | Devuelve una lista inicial vacía. |
| GET | /api/sessions | Informa el estado inicial del recurso sessions. |

### GET /api/health

Código de respuesta: `200 OK`.

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### GET /api/events

Código de respuesta: `200 OK`.

```json
{
  "status": "success",
  "payload": []
}
```

### GET /api/sessions

Código de respuesta: `200 OK`.

```json
{
  "status": "success",
  "message": "Recurso sessions preparado. Autenticación pendiente de implementar."
}
```

Esta ruta no inicia sesiones ni genera tokens.

## Pruebas manuales

Con el servidor iniciado, realizar estas peticiones desde Thunder Client o Postman:

```text
GET http://localhost:8080/api/health
GET http://localhost:8080/api/events
GET http://localhost:8080/api/sessions
```

Verificar que las tres respondan con estado 200 y los cuerpos JSON documentados.

Si se modifica PORT en `.env`, reiniciar el servidor y utilizar el nuevo puerto en las peticiones.

## Autor

Juan Manuel da Bouza.