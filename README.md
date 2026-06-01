# SIS315 - Prototipo Microsoft Dynamics 365

## Introducción

Microsoft Dynamics 365 es una suite de aplicaciones empresariales que combina funcionalidades de **ERP (Planificación de Recursos Empresariales)** y **CRM (Gestión de Relaciones con Clientes)**. Los módulos ERP se centran en la gestión integrada de procesos clave como finanzas, cadena de suministro, operaciones de proyectos, recursos humanos, comercio y fabricación.

Este prototipo implementa exclusivamente los **módulos orientados a ERP** de Dynamics 365. Cada uno de estos módulos incluye, a su vez, **submódulos propios del ámbito ERP** (por ejemplo, dentro de Finanzas se encuentran el libro mayor, cuentas por pagar, gestión de efectivo, etc.). Por lo tanto, el proyecto cubre un amplio espectro de funcionalidades empresariales típicas de un sistema ERP.

## Descripción del Proyecto

Prototipo de una aplicación web basada en los módulos ERP de Microsoft Dynamics 365.

## Estructura del Proyecto

- **Backend/** - Servidor con Node.js/Express y MongoDB
- **Frontend/** - Aplicación React con Vite

## Características

Este prototipo incluye clones de los siguientes módulos ERP de Dynamics 365:

- **Finanzas Dynamics 365** - Libro mayor, cuentas por pagar y cobrar, presupuestos, flujo de caja, activos fijos, conciliación bancaria, soporte multimoneda.
- **Gestión de la Cadena de Suministro** - Gestión de almacenes, control de inventarios, MRP (Planificación de Necesidades de Materiales), compras, control de calidad, mantenimiento de activos, previsión de demanda.
- **Comercio** - Punto de venta (POS), catálogo de productos, precios y promociones, sincronización de inventario, compra online y recogida en tienda (BOPIS), programas de fidelización, integración con pasarelas de pago.
- **Operaciones de Proyectos** - Planificación de proyectos con diagramas de Gantt, asignación de recursos, hojas de tiempos, presupuestación de proyectos, facturación, gestión de contratos, seguimiento de rentabilidad.
- **Recursos Humanos** - Registros de empleados, compensaciones y beneficios, vacaciones y asistencia, portal de autoservicio, estructura organizativa, reclutamiento e incorporación, evaluaciones de desempeño.
- **Business Central** - Gestión financiera avanzada, CRM, gestión de la cadena de suministro, gestión de proyectos y servicios, planificación de producción y fabricación.

## Instrucciones de Configuración

### Backend

1. Navega al directorio `backend`:  
   `cd backend`
2. Instala las dependencias:  
   `npm install`
3. Inicia el servidor:  
   `npm start`

### Frontend

1. Navega al directorio `frontend`:  
   `cd frontend`
2. Instala las dependencias:  
   `npm install`
3. Inicia el servidor de desarrollo:  
   `npm run dev`

## Despliegue en Render

Esta aplicación está configurada para desplegarse en **Render** usando el plan gratuito:

1. Simplemente importar como blueprint en render.

## Tecnologías Utilizadas

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, React Router, Vite
- **Estilos:** CSS
- **Base de datos:** MongoDB (reemplazable por cualquier base de datos compatible)

## Endpoints de la API

La API sigue las convenciones REST con las siguientes rutas base:

- `/api/finance` - Endpoints del módulo de Finanzas
- `/api/supplychain` - Endpoints de Gestión de la Cadena de Suministro
- `/api/commerce` - Endpoints del módulo de Comercio
- `/api/project` - Endpoints de Operaciones de Proyectos
- `/api/hr` - Endpoints de Recursos Humanos
- `/api/businesscentral` - Endpoints de Business Central

Cada módulo dispone de endpoints CRUD para sus respectivas entidades.
