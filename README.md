# Disagro Promociones — Backend

API REST para la plataforma de confirmación de asistencia y selección de productos/servicios de interés del evento anual de promociones de Disagro.

## Demo desplegada

- **API en producción:** https://disagro-promociones-backend.onrender.com
- **Documentación interactiva (Swagger):** https://disagro-promociones-backend.onrender.com/docs

> El servicio está en el plan free de Render: si nadie lo usa por un rato, "duerme" y la primera petición puede tardar unos segundos en responder mientras despierta.

### Credenciales de prueba (admin)

```
usuario:    admin
contraseña: Disagro2026!
```

## Stack

- Node.js + TypeScript
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL ([Neon](https://neon.tech))
- JWT (`@nestjs/jwt`) para sesión de cliente invitado y de administrador
- `class-validator` / `class-transformer` para validación de DTOs
- Swagger (`@nestjs/swagger`) para documentación de la API

## Modelo de datos

- **Cliente** — datos de quien confirma asistencia (nombre, apellidos, email, número de documento)
- **Item** — catálogo de servicios y productos (`tipo`: `SERVICIO` o `PRODUCTO`), con estado `activo` para ocultarlos del catálogo sin borrar historial
- **Evento** — fechas/horas disponibles para asistir, gestionadas por el admin
- **Confirmacion** — el registro de que un cliente confirmó asistencia a un evento, con los % de descuento otorgados
- **ConfirmacionItem** — detalle de los ítems seleccionados en cada confirmación (con el precio congelado al momento)
- **User** — cuentas de administrador (acceso interno, sin registro público)

## Reglas de descuento

- **Servicios:** 2 o más seleccionados → 3%. Si además la suma de sus precios supera Q1,500 → 5%.
- **Productos:** 3 o más seleccionados → 3%. 5 o más → 5%.

El cálculo se hace siempre en el backend al momento de confirmar (nunca se confía en un valor enviado desde el cliente).

## Requisitos previos

- Node.js `20.19+`
- Una base de datos PostgreSQL (se usó [Neon](https://neon.tech), free tier)

## Configuración local

1. Clonar el repo e instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz con:

   ```
   DATABASE_URL="postgresql://usuario:password@host/basededatos?sslmode=require"
   JWT_SECRET="una-clave-larga-y-aleatoria"
   ```

3. Generar el cliente de Prisma y aplicar las migraciones:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. (Opcional) Poblar datos de prueba — catálogo de ítems y usuario admin:

   ```bash
   npx prisma db execute --file prisma/seed.sql --schema prisma/schema.prisma
   npx prisma db execute --file prisma/seed-admin.sql --schema prisma/schema.prisma
   ```

   El usuario admin del seed es `admin` / `Disagro2026!`.

## Scripts disponibles

```bash
npm run start:dev   # desarrollo, con recompilación y reinicio automático
npm run build        # compila TypeScript a dist/
npm run start        # corre la build compilada (dist/main.js)
```

La API queda disponible en `http://localhost:3000`, y la documentación en `http://localhost:3000/docs`.

## Docker

```bash
docker build -t disagro-backend .
docker run -d -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  disagro-backend
```

## Endpoints principales

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/clientes` | Busca o crea un cliente | Público |
| POST | `/confirmaciones` | Confirma asistencia (crea cliente si no existe, calcula descuentos) | Público |
| GET | `/confirmaciones/me` | Confirmaciones del cliente autenticado | Cliente (JWT) |
| GET | `/confirmaciones` | Lista todas las confirmaciones, con filtros y paginación | Admin |
| GET | `/items` | Catálogo de servicios/productos activos, con búsqueda | Público |
| GET | `/items/populares` | Ranking de ítems más seleccionados | Admin |
| POST/PATCH | `/items` | Crear, editar, activar/desactivar ítems | Admin |
| GET | `/eventos` | Fechas disponibles (activas y futuras) | Público |
| POST/PATCH | `/eventos` | Crear, editar, activar/desactivar eventos | Admin |
| POST | `/auth/login` | Login de administrador | Público |

Ver el detalle completo (parámetros, cuerpos de petición, respuestas) en `/docs`.

## Proyecto relacionado

Frontend: [disagro-promociones-frontend](https://github.com/garbizudev/disagro-promociones-frontend)
