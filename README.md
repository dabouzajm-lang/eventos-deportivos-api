# Eventos Deportivos API

API REST para una plataforma de eventos deportivos e inscripciones.

Proyecto del curso Desarrollo Avanzado de Backend II.

## Temática

La plataforma está orientada a publicar eventos deportivos, como torneos de vóley, encuentros y clínicas, y gestionar sus inscripciones.

## Estado actual — Preentrega 2

Se implementó el registro seguro de usuarios con persistencia en MongoDB y arquitectura en capas.

Funcionalidades disponibles:

- Validación de campos obligatorios y tipos de datos.
- Validación del formato de email.
- Normalización del email mediante trim y lowercase.
- Validación de longitud de contraseña.
- Hash de contraseña con bcrypt.
- Prevención de emails duplicados.
- Asignación del rol user en el registro público.
- Respuestas sin contraseña.
- Conexión a MongoDB mediante Mongoose.

Todavía no se implementan login, JWT, cookies, autorización ni inscripciones. El recurso events conserva su respuesta inicial vacía.

## Tecnologías

- Node.js 22 o superior.
- Express.
- MongoDB y Mongoose.
- bcrypt.
- dotenv.
- JavaScript con módulos ESM.
- Git y GitHub.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/dabouzajm-lang/eventos-deportivos-api.git
```

Ingresar al proyecto e instalar dependencias:

```bash
cd eventos-deportivos-api
npm install
```

## Configuración

Crear un archivo .env en la raíz copiando .env.example.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En Git Bash, Linux o macOS:

```bash
cp .env.example .env
```

Configuración de ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/eventos_deportivos
JWT_SECRET=reemplazar_por_un_secreto_propio
```

| Variable | Descripción |
| --- | --- |
| PORT | Puerto HTTP. Por defecto, 8080. |
| NODE_ENV | Entorno de ejecución. Por defecto, development. |
| MONGO_URL | Cadena de conexión a MongoDB. Obligatoria para iniciar. |
| JWT_SECRET | Reservada para la futura autenticación; todavía no se utiliza. |

### MongoDB local

La URL de ejemplo requiere que un servidor MongoDB esté instalado y funcionando en el puerto 27017.

### MongoDB Atlas

Reemplazar MONGO_URL en .env por la cadena de conexión provista por Atlas, con el usuario y contraseña de base de datos correspondientes.

La IP pública del equipo debe estar autorizada en la lista de acceso de red del proyecto de Atlas.

La extensión de MongoDB para VS Code permite explorar los datos, pero no configura automáticamente la conexión de la API.

### Base de datos utilizada

La aplicación selecciona explícitamente la base eventos_deportivos mediante la opción dbName en src/config/database.config.js.

Los usuarios se guardan en la colección users.

Nunca subir .env ni credenciales reales al repositorio. El archivo .env.example contiene únicamente valores de ejemplo.

## Ejecución

Desarrollo con reinicio automático:

```bash
npm run dev
```

Ejecución normal:

```bash
npm start
```

El servidor conecta primero a MongoDB y después comienza a escuchar peticiones.

Con PORT=8080:

```text
http://localhost:8080
```

Si falla la conexión inicial a MongoDB, el servidor no comienza a escuchar.

## Arquitectura

El registro utiliza el flujo:

```text
Ruta → Controller → Service → Repository → DAO → Modelo Mongoose
```

| Capa | Responsabilidad |
| --- | --- |
| routes | Define URLs y métodos HTTP. |
| controllers | Recibe la petición y construye la respuesta HTTP. |
| services | Valida datos, normaliza el email, coordina el hash y fija el rol público. |
| repositories | Ofrece las operaciones de acceso a usuarios al servicio. |
| dao | Ejecuta las consultas y escrituras mediante Mongoose. |
| models | Define los esquemas y restricciones de los documentos. |
| utils | Contiene el helper reutilizable de bcrypt y AppError. |
| config | Centraliza variables de entorno y conexión a MongoDB. |
| middlewares | Carpeta preparada para próximas entregas. |

## Estructura

```text
src/
├── app.js
├── server.js
├── config/
│   ├── env.config.js
│   └── database.config.js
├── routes/
│   ├── health.router.js
│   ├── events.router.js
│   └── sessions.router.js
├── controllers/
│   ├── health.controller.js
│   ├── events.controller.js
│   └── sessions.controller.js
├── services/
│   └── sessions.service.js
├── repositories/
│   └── users.repository.js
├── dao/
│   └── users.dao.js
├── models/
│   ├── User.js
│   └── Event.js
├── middlewares/
│   └── .gitkeep
└── utils/
    ├── hash.js
    └── AppError.js
```

## Modelo User

| Campo | Tipo | Características |
| --- | --- | --- |
| first_name | String | Obligatorio; se eliminan espacios exteriores. |
| last_name | String | Obligatorio; se eliminan espacios exteriores. |
| email | String | Obligatorio, normalizado, con formato validado e índice único. |
| password | String | Obligatorio; se guarda un hash bcrypt y se excluye de las consultas por defecto. |
| role | String | Valores admitidos: user, organizer y admin. Por defecto: user. |

Mongoose agrega createdAt y updatedAt mediante timestamps.

El registro público guarda siempre role: "user", aunque el cliente envíe otro rol.

El modelo Event conserva su estructura base para futuras entregas.

## Rutas disponibles

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | /api/health | Comprueba que el servidor está activo. |
| GET | /api/events | Devuelve la lista inicial vacía. |
| GET | /api/sessions | Informa que el registro está disponible. |
| POST | /api/sessions/register | Registra un usuario en MongoDB. |

### GET /api/health

Respuesta 200:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### GET /api/events

Respuesta 200:

```json
{
  "status": "success",
  "payload": []
}
```

### GET /api/sessions

Respuesta 200:

```json
{
  "status": "success",
  "message": "Recurso sessions preparado. Registro disponible."
}
```

## POST /api/sessions/register

Enviar Content-Type: application/json.

### Campos esperados

first_name, last_name, email y password son obligatorios y deben ser strings.

- Los nombres y el email no pueden quedar vacíos después de quitar espacios exteriores.
- El email se normaliza antes de buscar duplicados y guardar.
- La contraseña debe tener al menos 8 caracteres, sin contar espacios al principio y al final.
- La contraseña no puede superar los 72 bytes en UTF-8.
- La contraseña se hashea tal como se recibió, conservando sus espacios.
- El rol enviado en el body se ignora.

### Ejemplo de petición

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

### Registro exitoso — 201 Created

```json
{
  "status": "success",
  "payload": {
    "id": "ID_GENERADO_POR_MONGODB",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La respuesta no incluye password, ni en texto plano ni hasheada.

### Campos faltantes — 400 Bad Request

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

### Email inválido — 400 Bad Request

```json
{
  "status": "error",
  "message": "El formato del email es inválido"
}
```

### Email duplicado — 409 Conflict

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

La aplicación comprueba duplicados antes de guardar y también maneja el error 11000 del índice único de MongoDB.

### Otros errores

Los tipos de datos o longitudes inválidos devuelven 400 con un mensaje descriptivo.

Los errores inesperados del registro devuelven 500:

```json
{
  "status": "error",
  "message": "Error interno del servidor"
}
```

## Pruebas manuales

Con el servidor iniciado, usar Thunder Client o Postman.

URL del registro:

```text
POST http://localhost:8080/api/sessions/register
```

Seleccionar Body → JSON y enviar los datos correspondientes.

| Caso | Resultado esperado |
| --- | --- |
| Registro con email nuevo | 201; usuario persistido. |
| Email con mayúsculas y espacios exteriores | Se guarda normalizado. |
| Body con role: "admin" | Se guarda role: "user". |
| Campo obligatorio faltante | 400. |
| Email inválido | 400. |
| Contraseña corta | 400. |
| Email ya registrado, incluso con distinta capitalización | 409. |
| Consultar el documento en MongoDB | password contiene un hash bcrypt. |
| Revisar la respuesta exitosa | No incluye password. |

Para repetir el registro exitoso, utilizar un email nuevo. Reenviar uno ya registrado debe devolver 409.

En MongoDB, revisar la colección:

```text
eventos_deportivos → users
```

Las pruebas descritas son manuales; todavía no hay una suite automatizada.

## Autor

Juan Manuel da Bouza.