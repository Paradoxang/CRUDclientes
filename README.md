# CRUD de Clientes

Aplicación web para la administración de clientes, que permite crearlos, listarlos, editarlos, eliminarlos y consultar su detalle. Fue desarrollada como prueba técnica para el puesto de Desarrollador Web.

La solución se compone de una **API REST en .NET 8** y una **aplicación frontend en Angular**, con persistencia de datos en **SQL Server**. Cada capa cumple una responsabilidad bien definida y se comunica con la otra a través de peticiones HTTP.

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

- Creación, listado, edición, eliminación y detalle de un cliente.
- Validaciones aplicadas tanto en el frontend como en el backend.
- Persistencia de la información en una base de datos SQL Server.
- Pantallas de listado, formulario de creación, formulario de edición, detalle y confirmación previa a la eliminación.

**Bonus**

-  Búsqueda por nombre, apellido o correo.
-  Paginación del listado.
-  Filtro por estado (activo / inactivo).
-  Manejo centralizado de errores en la API.

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

Para ejecutar el proyecto es necesario contar con las siguientes herramientas instaladas:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (versión LTS)](https://nodejs.org/) junto con Angular CLI (`npm install -g @angular/cli`)
- [SQL Server](https://www.microsoft.com/sql-server) (edición Express o superior)

---

## Configuración de la base de datos

La cadena de conexión se encuentra en el archivo `ClintesApi/appsettings.json`. Dentro de la sección `ConnectionStrings`, el valor de `Server` debe corresponder a la instancia local de SQL Server:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=TU_SERVIDOR\\SQLEXPRESS;Database=ClientesDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

El valor `TU_SERVIDOR\\SQLEXPRESS` se reemplaza por el nombre del servidor correspondiente (por ejemplo, `localhost\\SQLEXPRESS` o `.\\SQLEXPRESS`).

Una vez configurada la conexión, la base de datos puede crearse mediante **una** de las dos opciones siguientes:

**Opción A — Migraciones de EF Core**

Desde la carpeta del backend se aplican las migraciones, lo que crea la base de datos y la tabla de forma automática:

```bash
cd ClintesApi
dotnet ef database update
```

**Opción B — Script SQL**

1. En SQL Server Management Studio se crea una base de datos vacía con el nombre `ClientesDb`.
2. Se abre el archivo `script.sql`, se selecciona dicha base de datos y se ejecuta.

---

## Cómo ejecutar el proyecto

El backend y el frontend se ejecutan de forma simultánea, en terminales independientes.

### 1. Backend (API)

```bash
cd ClintesApi
dotnet run
```

La API queda disponible en `https://localhost:7021`, y su documentación interactiva (Swagger) puede consultarse en `https://localhost:7021/swagger`.

### 2. Frontend (Angular)

```bash
cd clientes-app
npm install
ng serve
```

La aplicación queda disponible en `http://localhost:4200`.

> **Nota sobre el certificado HTTPS:** si el navegador bloquea las llamadas a la API a causa del certificado de desarrollo, basta con ejecutar una vez `dotnet dev-certs https --trust` y aceptar el cuadro de diálogo correspondiente.

---

## Endpoints de la API

Todos los endpoints se encuentran bajo la ruta base `/api/Clientes`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Clientes` | Lista los clientes (con búsqueda, filtro y paginación) |
| `GET` | `/api/Clientes/{id}` | Obtiene el detalle de un cliente |
| `POST` | `/api/Clientes` | Crea un nuevo cliente |
| `PUT` | `/api/Clientes/{id}` | Actualiza un cliente existente |
| `DELETE` | `/api/Clientes/{id}` | Elimina un cliente |

El listado (`GET /api/Clientes`) admite los siguientes parámetros de consulta:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `buscar` | string | Filtra por nombre, apellido o correo |
| `activo` | bool | Filtra por estado (`true` / `false`) |
| `pagina` | int | Número de página (por defecto 1) |
| `tamanoPagina` | int | Registros por página (por defecto 10) |

---

## Reglas de validación

Las validaciones se aplican en el **frontend**, para ofrecer una mejor experiencia de usuario, y en el **backend**, donde residen como fuente de verdad:

- El nombre, el apellido, el teléfono y el correo son campos obligatorios.
- El correo debe tener un formato válido.
- No se admiten dos clientes con el mismo correo, restricción que además se refuerza con un índice único en la base de datos.

---

## Decisiones de diseño y buenas prácticas

- **Separación mediante DTOs:** la entidad de base de datos (`Cliente`) se mantiene separada de los objetos de entrada y salida de la API (`ClienteInputDto`, `ClienteDto`), lo que evita exponer el modelo interno y permite validar la entrada de forma controlada.
- **Validación en doble capa:** las reglas se verifican tanto en el cliente como en el servidor, garantizando la integridad de los datos sin importar el origen de la petición.
- **Integridad a nivel de base de datos:** la unicidad del correo se asegura con un índice único, y no únicamente mediante lógica de aplicación.
- **Manejo centralizado de errores:** un middleware captura las excepciones no controladas y devuelve respuestas JSON consistentes en lugar de exponer errores internos.
- **Operaciones asíncronas:** el acceso a datos emplea `async/await` para no bloquear los hilos de ejecución.
- **CORS configurado** de forma explícita para permitir el consumo desde la aplicación Angular.
- **Frontend moderno:** la aplicación utiliza componentes standalone, signals para el manejo de estado y formularios reactivos con validaciones.
- **Esquema versionado:** la base de datos se gestiona mediante migraciones de EF Core, e incluye además un script SQL para mayor flexibilidad.

---

## Autor

**SANTIAGO MIRANDA**