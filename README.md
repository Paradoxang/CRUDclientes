# CRUD de Clientes

Aplicación web para la administración de clientes (crear, listar, editar, eliminar y ver detalle), desarrollada como prueba técnica para el puesto de Desarrollador Web.

La solución está compuesta por una **API REST en .NET 8** y una **aplicación frontend en Angular**, con persistencia en **SQL Server**.

---

## Tabla de contenido

- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Configuración de la base de datos](#configuración-de-la-base-de-datos)
- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
- [Endpoints de la API](#endpoints-de-la-api)
- [Reglas de validación](#reglas-de-validación)
- [Decisiones de diseño y buenas prácticas](#decisiones-de-diseño-y-buenas-prácticas)
- [Autor](#autor)

---

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Backend | .NET 8 / ASP.NET Core Web API |
| ORM | Entity Framework Core 8 |
| Frontend | Angular (componentes standalone + signals) |
| Base de datos | SQL Server |
| Documentación de API | Swagger / OpenAPI |

---

## Funcionalidades

**Requeridas**

- Crear, listar, editar, eliminar y ver el detalle de un cliente.
- Validaciones tanto en el frontend como en el backend.
- Persistencia en base de datos SQL Server.
- Pantallas: listado, formulario de creación, formulario de edición, detalle y confirmación antes de eliminar.

**Bonus (implementados)**

- 🔍 Búsqueda por nombre, apellido o correo.
- 📄 Paginación del listado.
- 🎛️ Filtro por estado (activo / inactivo).
- ⚠️ Manejo centralizado de errores en la API.

---

## Estructura del proyecto

```
CrudClientes/
├── ClintesApi/        # Backend - API REST en .NET 8
│   ├── Controllers/   # Controlador del CRUD de clientes
│   ├── Data/          # DbContext de Entity Framework Core
│   ├── Dtos/          # Objetos de transferencia de datos (entrada/salida)
│   ├── Middleware/    # Manejo global de errores
│   ├── Migrations/    # Migraciones de EF Core
│   ├── Models/        # Entidad Cliente
│   └── appsettings.json
├── clientes-app/      # Frontend - Aplicación Angular
│   └── src/app/
│       ├── clientes/  # Componentes: listado, formulario y detalle
│       ├── models/    # Interfaces de datos
│       └── services/  # Servicio de comunicación con la API
├── script.sql         # Script SQL para crear el esquema de la base de datos
└── README.md
```

---

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (versión LTS)](https://nodejs.org/) y Angular CLI (`npm install -g @angular/cli`)
- [SQL Server](https://www.microsoft.com/sql-server) (Express o superior)

---

## Configuración de la base de datos

1. Abre el archivo `ClintesApi/appsettings.json`.

2. En la sección `ConnectionStrings`, ajusta el valor de `Server` con el nombre de **tu** instancia de SQL Server:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=TU_SERVIDOR\\SQLEXPRESS;Database=ClientesDb;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

   > Reemplaza `TU_SERVIDOR\\SQLEXPRESS` por el nombre de tu servidor (por ejemplo `localhost\\SQLEXPRESS` o `.\\SQLEXPRESS`).

3. Crea la base de datos eligiendo **una** de estas dos opciones:

   **Opción A — Migraciones de EF Core (recomendada)**

   Desde la carpeta del backend, aplica las migraciones. Esto crea la base de datos y la tabla automáticamente:

   ```bash
   cd ClintesApi
   dotnet ef database update
   ```

   **Opción B — Script SQL**

   1. En SQL Server Management Studio, crea una base de datos vacía llamada `ClientesDb`.
   2. Abre el archivo `script.sql`, selecciona esa base de datos y ejecútalo.

---

## Cómo ejecutar el proyecto

> El backend y el frontend deben ejecutarse **al mismo tiempo**, en terminales separadas.

### 1. Backend (API)

```bash
cd ClintesApi
dotnet run
```

La API quedará disponible en `https://localhost:7021`.
La documentación interactiva (Swagger) se encuentra en `https://localhost:7021/swagger`.

### 2. Frontend (Angular)

```bash
cd clientes-app
npm install
ng serve
```

La aplicación quedará disponible en `http://localhost:4200`.

> **Nota sobre el certificado HTTPS:** si el navegador bloquea las llamadas a la API por el certificado de desarrollo, ejecuta una vez `dotnet dev-certs https --trust` y acepta el cuadro de diálogo.

---

## Endpoints de la API

Todos los endpoints están bajo la ruta base `/api/Clientes`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Clientes` | Lista los clientes (con búsqueda, filtro y paginación) |
| `GET` | `/api/Clientes/{id}` | Obtiene el detalle de un cliente |
| `POST` | `/api/Clientes` | Crea un nuevo cliente |
| `PUT` | `/api/Clientes/{id}` | Actualiza un cliente existente |
| `DELETE` | `/api/Clientes/{id}` | Elimina un cliente |

**Parámetros de consulta para el listado** (`GET /api/Clientes`):

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `buscar` | string | Filtra por nombre, apellido o correo |
| `activo` | bool | Filtra por estado (`true` / `false`) |
| `pagina` | int | Número de página (por defecto 1) |
| `tamanoPagina` | int | Registros por página (por defecto 10) |

---

## Reglas de validación

Se aplican en el **frontend** (para una mejor experiencia de usuario) y en el **backend** (como fuente de verdad):

- El nombre, el apellido, el teléfono y el correo son obligatorios.
- El correo debe tener un formato válido.
- No se permiten dos clientes con el mismo correo (restricción reforzada con un índice único en la base de datos).

---

## Decisiones de diseño y buenas prácticas

- **Separación mediante DTOs:** la entidad de base de datos (`Cliente`) está separada de los objetos de entrada y salida de la API (`ClienteInputDto`, `ClienteDto`), evitando exponer el modelo interno y permitiendo validar la entrada de forma controlada.
- **Validación en doble capa:** las reglas se validan en el cliente y en el servidor, garantizando la integridad de los datos independientemente del origen de la petición.
- **Integridad a nivel de base de datos:** la unicidad del correo se garantiza con un índice único, no solo con lógica de aplicación.
- **Manejo centralizado de errores:** un middleware captura las excepciones no controladas y devuelve respuestas JSON consistentes en lugar de errores internos.
- **Operaciones asíncronas:** el acceso a datos usa `async/await` para no bloquear hilos.
- **CORS configurado** explícitamente para permitir el consumo desde la aplicación Angular.
- **Frontend moderno:** Angular con componentes standalone, signals para el manejo de estado y formularios reactivos con validaciones.
- **Esquema versionado:** la base de datos se gestiona mediante migraciones de EF Core, e incluye además un script SQL para mayor flexibilidad.

---

## Autor

Santiago Miranda