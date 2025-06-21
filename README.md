# 🛍️ API RESTful - Gestión de Productos

Este proyecto es una API básica construida con **Node.js** y **Express**, diseñada para gestionar un listado de productos en una tienda. En lugar de usar una base de datos, la información se guarda en un archivo `.json`, lo que permite su uso como ejercicio práctico sin requerir configuración de bases de datos.

---

## 🎯 Objetivo

Desarrollar una API RESTful que permita realizar operaciones CRUD (crear, leer, actualizar y eliminar) sobre productos de una tienda, con almacenamiento en un archivo `productos.json` y validaciones básicas de datos.

---

## ⚙️ Tecnologías utilizadas

- Node.js
- Express.js

---

## 🚀 Instalación y ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/EvelynSabillon/DisenoDigitalTarea2.git
   cd DisenoDigitalTarea2
   ```

2. **Instalar Node.js**  
   Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/).

3. **Instalar las dependencias**
   ```bash
   npm install
   ```

4. **Instalar Express (si es necesario)**
   ```bash
   npm install express
   ```

5. **Ejecutar la API**
   ```bash
   npm run dev
   ```
   Esto iniciará el servidor en: [http://localhost:3000](http://localhost:3000)

---

## 📚 Rutas disponibles y funcionalidad

- **GET /productos**  
  Devuelve todos los productos.  
  Incluye un contador de cuántos productos existen.

- **GET /productos/disponibles**  
  Devuelve solo los productos disponibles (`disponible: true`).  
  Muestra el total y cuántos están disponibles.

- **GET /productos/:id**  
  Retorna un producto específico según su ID.

- **POST /productos**  
  Crea un nuevo producto.  
  Requiere: `nombre`, `precio`, `descripcion`, `disponible`.

- **PUT /productos/:id**  
  Actualiza un producto existente según su ID.  
  Requiere los mismos campos que el POST.

- **DELETE /productos/:id**  
  Elimina un producto según su ID.

---

## 📂 Estructura del proyecto

```bash
📁 local_db/
  └── productos.json     # Archivo donde se almacenan los productos
📄 api.http              # Pruebas de la API 
📄 index.js              # Código principal del servidor
📄 package.json          # Dependencias y scripts
📄 package-lock.json     # Control de versiones de dependencias
📄 README.md             # Documentación del proyecto
```

---

## 📝 Notas adicionales

- El ID de los productos se genera automáticamente con base en el valor más alto actual.
- El campo `fecha_ingreso` se asigna automáticamente al momento de la creación.
- Se recomienda usar la extensión **REST Client** en VSCode para probar la API desde el archivo `api.http`.