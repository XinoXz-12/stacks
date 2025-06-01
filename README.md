# Stacks - Jaime Lozano Lozano

Este proyecto está dockerizado y separa sus servicios en distintos contenedores:

- `frontend`: cliente (React)
- `backend`: API REST (Node.js y Express)
- `mongo`: Base de datos (MongoDB)
- `mongo-express`: interfaz web para la base de datos
- `web`: servidor NGINX (proxy inverso)
- `certbot`: cliente de Let's Encrypt para certificados SSL válidos

---

## Requisitos previos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Puertos `80`, `443`, `3000`, `8081` y `27017` disponibles

---

## Esquemas de la Base de datos

### Diagrama Entidad/Relación

![Vista previa](./frontend/src/assets/images/diagrama_er.png)

### Esquema lógico

```text
users(_id, username, email, password, age, gender, image, role)

profiles(_id, user_id fk:users, game, user_game, rank, subrank, style, server)

teams(_id, name, game, gender, capacity, members[] fk:profiles)

requests(_id, profile_id fk:profiles, team_id fk:teams, status, date_joined)

messages(_id, senderId fk:profiles, teamId fk:teams, content, date)

```

---

## Estructura del proyecto

```text
stacks/
│
├── frontend/               # Código del cliente
├── backend/                # API REST
│   └── data/
│       └── fakeData.js     # Script de datos para Mongo
├── web/                    # Configuración de NGINX
├── docker-compose.yml
└── README.md
```

---

## Pasos para levantar el proyecto

1. Clona el repositorio:

Puedes clonar este repositorio con HTTPS o SSH:

```bash
# HTTPS
git clone https://github.com/XinoXz-12/stacks.git

# SSH
git clone git@github.com:XinoXz-12/stacks.git

# Entra al proyecto
cd stacks/
```

2. Ejecuta Docker Compose:

```bash
docker-compose up --build
```

Esto levanta:

- `mongo`: contenedor con base de datos
- `mongo-express`: interfaz para Mongo en [`https://stacks-gg.duckdns.org/mongo/`](https://stacks-gg.duckdns.org/mongo/)
- `backend`: API (Node.js) en [`https://stacks-gg.duckdns.org/api/`](https://stacks-gg.duckdns.org/api/)
- `frontend`: App cliente (servido por NGINX)
- `web`: contenedor NGINX que expone el frontend en [`https://stacks-gg.duckdns.org`](https://stacks-gg.duckdns.org)
- Todo el tráfico es redirigido automáticamente a HTTPS usando certificados válidos de Let's Encrypt

---

## Certificados SSL (Let's Encrypt)

El entorno incluye `certbot` que:

- Genera automáticamente certificados válidos al iniciar

- Los guarda en volúmenes persistentes (certbot-etc)

- Puedes renovar manualmente con:

```bash
Copiar código
docker compose run --rm certbot-init
docker compose restart web
```

---

## Datos automáticos de la base de datos

El backend incluye un archivo `data/fakeData.js` que se ejecuta automáticamente al iniciar el servidor **si la base de datos está vacía**. Este script inserta usuarios, perfiles, equipos y mensajes de ejemplo.

Puedes iniciar sesión con cualquiera de estos usuarios de prueba:

```text
[Usuario]     User0
[Correo]      user0@mail.com
[Contraseña]  123456

[Usuario]     User1
[Correo]      user1@mail.com
[Contraseña]  123456

[Usuario]     User2
[Correo]      user2@mail.com
[Contraseña]  123456
```

Estas cuentas están creadas automáticamente por el sistema cuando se levanta por primera vez.

---

## Variables de entorno

Para que el proyecto funcione correctamente, crea un archivo `.env` en el **frontend** y otro en el **backend** con el siguiente contenido:

---

### Frontend (`/frontend/.env`)

```env
# Ruta base para llamadas a la API
VITE_BASE_URL=/api

# Ruta para las conexiones de WebSocket
VITE_BASE_URL_SOCKET=/socket.io

# Solución para entornos Docker en desarrollo (hot reload)
CHOKIDAR_USEPOLLING=true
```

---

### Backend (`/backend/.env`)

```env
# Puerto donde se levanta el servidor
PORT=3000

# URI de conexión a MongoDB (usuario: root / password: example)
MONGODB_URI=mongodb://root:example@mongo:27017/stacks

# Dominio permitido para CORS
CORS_ORIGIN=https://stacks-gg.duckdns.org

# Clave secreta para firmar tokens JWT
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODNiNDRhMjIxMjY1Zjc2OTVjNTg1NzQiLCJpYXQiOjE3NDg3MjAyNDksImV4cCI6MTc0ODc2MzQ0OX0.j70Gh-fi5qSQP8mbOxfpzSNdElZAIN3wbr2O_nBhMII

# Clave de API externa (Gemini AI para traducción de noticias)
GEM_API_KEY=AIzaSyDYRTOesTE2QRgaJB2B4Rsp63XKcjaOqCg
```

> **Nota:** Si las traducciones no funcionan probablemente hayan gastado los tokens diarios. Te animo a crearte un token y probarlo tú mismo. [Google AI Studio](https://aistudio.google.com/apikey)

Imagen de cómo se ven con la traducción activa:

![Vista previa](./frontend/src/assets/images/news_example.png)
