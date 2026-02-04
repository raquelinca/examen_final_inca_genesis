# Examen Final - Task Manager CRUD Full-Stack

GENESIS RAQUEL INCA VILLACRES  
**Curso:** Desarrollo Web  
**Fecha:** Febrero 2026

---

## 📋 Descripción del Proyecto

Sistema completo de gestión de tareas (Task Manager) desarrollado con:
- **Backend:** Node.js + Express + Sequelize + PostgreSQL
- **Frontend:** React + Tailwind CSS
- **Base de datos:** PostgreSQL con Docker Compose

### Funcionalidades Implementadas

✅ CRUD completo de tareas (Create, Read, Update, Delete)  
✅ Validación: No se permite marcar como DONE sin descripción mínima de 10 caracteres  
✅ Arquitectura en capas: Routes → Services → Repositories  
✅ Componentes reutilizables: Button (usado 4 veces), Input (usado 2 veces)  
✅ Manejo de errores 400 y 404 con mensajes descriptivos  
✅ Confirmación al eliminar tareas  
✅ Interfaz responsive con Tailwind CSS

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** v16 o superior
- **Docker** y **Docker Compose**
- **npm** o **yarn**

---



### 1 Levantar PostgreSQL con Docker Compose

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Este comando:
- Descarga la imagen de PostgreSQL 15
- Crea un contenedor llamado `tasks_db`
- Configura la base de datos `tasksdb`
- Expone el puerto `5433`

**Verificar que el contenedor está corriendo:**

```bash
docker ps
```

Deberías ver `tasks_db` en la lista.

**Para ver los logs del contenedor:**

```bash
docker logs tasks_db
```

**Credenciales de la base de datos:**
- Usuario: `admin`
- Contraseña: `admin123`
- Base de datos: `tasksdb`
- Puerto: `5433`

---

### 2 Configurar y ejecutar el Backend

#### 3.1 Instalar dependencias

```bash
cd backend
npm install
```

#### 3.2 Verificar el archivo .env

El archivo `.env` debe contener:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=tasksdb
DB_USER=admin
DB_PASSWORD=admin123
```

#### 3.3 Iniciar el servidor

**Modo desarrollo (con nodemon):**

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

El backend estará disponible en: **http://localhost:3000**

**Mensaje de éxito:**
```
✅ Database synced
🚀 Server running on http://localhost:3000
```

#### 3.4 Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Listar todas las tareas |
| GET | `/api/tasks/:id` | Obtener una tarea por ID |
| POST | `/api/tasks` | Crear nueva tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea existente |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

**Respuestas de error:**
- `400 Bad Request` - Validaciones fallidas
- `404 Not Found` - Tarea no encontrada
- `500 Internal Server Error` - Error del servidor

---

### 3 Configurar y ejecutar el Frontend

Abre una **nueva terminal** (deja el backend corriendo) y desde la raíz del proyecto:

#### 4.1 Instalar dependencias

```bash
cd frontend
npm install
```

#### 4.2 Iniciar la aplicación

```bash
npm start
```

El frontend se abrirá automáticamente en tu navegador en: **http://localhost:3000** (o 3001 si el 3000 está ocupado)

---

## 🧪 Probar el CRUD

### Desde la interfaz web

#### 1. **Crear una tarea**
   - Ingresa un título (mínimo 3 caracteres)
   - Opcionalmente añade una descripción
   - Selecciona el estado: PENDING, IN_PROGRESS o DONE
   - Click en "➕ Crear Tarea"

#### 2. **Probar validación especial**
   - Intenta crear una tarea con estado DONE sin descripción
   - Verás el error: *"Cannot set status to DONE: description must have at least 10 characters"*
   - Añade una descripción de al menos 10 caracteres y vuelve a intentar

#### 3. **Editar una tarea**
   - Click en "✏️ Editar" en cualquier tarea
   - Modifica los campos que desees
   - Click en "💾 Guardar Cambios"
   - O click en "❌ Cancelar" para descartar cambios

#### 4. **Eliminar una tarea**
   - Click en "🗑️ Eliminar"
   - Confirma en el popup
   - La tarea será eliminada

---

### Desde Postman o curl

#### Crear tarea

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Esta es una descripción de ejemplo con más de 10 caracteres",
    "status": "PENDING"
  }'
```

#### Listar todas las tareas

```bash
curl http://localhost:3000/api/tasks
```

#### Obtener una tarea por ID

```bash
curl http://localhost:3000/api/tasks/1
```

#### Actualizar tarea

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea actualizada",
    "description": "Descripción actualizada con más de 10 caracteres",
    "status": "DONE"
  }'
```

#### Eliminar tarea

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

#### Probar validación (debería fallar con 400)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task sin descripción",
    "description": "",
    "status": "DONE"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Cannot set status to DONE: description must have at least 10 characters"
}
```

---

## 🏗️ Estructura del Proyecto

```
examen_final_inca_genesis/
│
├── backend/                      # Backend Node.js + Express
│   ├── config/
│   │   ├── database.js          # Configuración de Sequelize
│   │   └── models.js            # Modelo Task con validaciones
│   ├── repositories/
│   │   └── taskRepository.js    # Capa de acceso a datos (CRUD)
│   ├── services/
│   │   └── taskService.js       # Lógica de negocio y validaciones
│   ├── routes/
│   │   └── taskRoutes.js        # Definición de endpoints
│   ├── .env                      # Variables de entorno
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Punto de entrada del servidor
│
├── frontend/                     # Frontend React + Tailwind
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx       # Componente reutilizable (usado 4 veces)
│   │   │   └── Input.jsx        # Componente reutilizable (usado 2 veces)
│   │   ├── App.js                # Componente principal con CRUD
│   │   ├── index.js
│   │   └── index.css             # Estilos con Tailwind
│   ├── .gitignore
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── docker-compose.yml            # Configuración de PostgreSQL
└── README.md                     # Este archivo
```

---

## 🔧 Detener los Servicios

### Detener el backend y frontend
Presiona `Ctrl + C` en cada terminal donde están corriendo

### Detener y eliminar el contenedor de PostgreSQL

```bash
docker-compose down
```

### Eliminar también los datos (volumen)

```bash
docker-compose down -v
```

⚠️ **Advertencia:** Esto borrará todas las tareas almacenadas en la base de datos.

---

## 📝 Detalles de Implementación

### Backend

#### Arquitectura en 3 capas

1. **Routes** (`routes/taskRoutes.js`)
   - Define los endpoints de la API
   - Maneja las peticiones HTTP
   - Delega la lógica al Service

2. **Services** (`services/taskService.js`)
   - Contiene la lógica de negocio
   - Implementa la validación especial: DONE requiere descripción ≥ 10 caracteres
   - Maneja errores con códigos de estado apropiados

3. **Repositories** (`repositories/taskRepository.js`)
   - Capa de acceso a datos
   - Interactúa directamente con Sequelize
   - Métodos CRUD puros

#### Validaciones implementadas

- **Title:** Requerido, mínimo 3 caracteres
- **Description:** Opcional, pero obligatorio con ≥10 caracteres si status = DONE
- **Status:** Solo acepta: PENDING, IN_PROGRESS, DONE

#### Manejo de errores

- `400` - Errores de validación
- `404` - Recurso no encontrado
- `500` - Errores internos del servidor

Todos los errores retornan: `{ "message": "..." }`

---

### Frontend

#### Componentes reutilizables

**Button.jsx** - Usado 4 veces:
1. Crear Tarea
2. Guardar Cambios
3. Cancelar
4. Editar
5. Eliminar

Variantes: `primary`, `secondary`, `danger`

**Input.jsx** - Usado 2 veces:
1. Campo "Título"
2. Campo "Descripción"

Soporta: text, textarea, required, placeholder

#### Características de la UI

- ✨ Diseño moderno con Tailwind CSS
- 📱 Responsive (funciona en móvil y escritorio)
- 🎨 Badges de colores por estado
- ⚠️ Mensajes de error destacados
- ✅ Confirmación al eliminar
- 🔄 Indicadores de carga
- 📅 Fechas formateadas
- 🎯 Scroll automático al editar

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Causa:** PostgreSQL no está corriendo

**Solución:**
```bash
docker-compose up -d
docker ps  # Verificar que tasks_db esté corriendo
```

---

### Error: "la autentificación password falló"

**Causa:** Credenciales incorrectas o volumen con datos antiguos

**Solución:**
```bash
docker-compose down -v  # Eliminar volúmenes
docker-compose up -d    # Recrear contenedor
```

---

### Error: "Port 3000 already in use"

**Causa:** Otro servicio está usando el puerto 3000

**Solución:** Cambiar el puerto en `.env`:
```env
PORT=3001
```

O detener el proceso que usa el puerto 3000

---

### Error: "react-scripts not found"

**Causa:** Dependencias no instaladas correctamente

**Solución:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### Frontend no conecta con Backend

**Verificar que:**
1. El backend esté corriendo en http://localhost:3000
2. CORS esté habilitado (ya está configurado)
3. La URL en `App.js` sea correcta: `const API_URL = 'http://localhost:3000/api/tasks';`

---

## ✅ Checklist de Entrega

- [x] Backend con estructura Routes/Services/Repositories
- [x] Modelo Task con todos los campos requeridos
- [x] 5 endpoints implementados (GET, GET/:id, POST, PUT, DELETE)
- [x] Validación: DONE requiere descripción ≥10 caracteres
- [x] Respuestas 400 y 404 con `{ "message": "..." }`
- [x] Frontend React con Tailwind
- [x] Componente Button reutilizable (usado ≥3 veces)
- [x] Componente Input reutilizable (usado ≥2 veces)
- [x] CRUD completo funcional
- [x] Eliminación con confirmación
- [x] Errores del backend mostrados en pantalla
- [x] PostgreSQL con Docker Compose
- [x] README.md con instrucciones completas

---

## 👤 Autor

**Nombre:** Genesis Inca 
**Carrera:** Desarrollo 
**Universidad:** PUCE 
**Fecha:** Febrero 2026

---

## 📄 Licencia

Este proyecto fue creado como examen final del curso de Desarrollo Web.

---

## 🙏 Agradecimientos

Gracias por revisar este proyecto. Cualquier feedback es bienvenido para seguir mejorando.
