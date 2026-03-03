# Tienda de ropa

Vamos a montar una tienda de ropa con un catálogo de productos y un dashboard para el administrador. Los productos se guardarán en una base de datos de mongo en Atlas. Podemos usar como referencia el pdf [web_ejemplo.pdf](web_ejemplo.pdf) que contiene un ejemplo de cómo podría ser la interfaz de la tienda y el dashboard.

## Índice

  - [Estructura de archivos](#estructura-de-archivos)
  - [Creación de base de datos](#creación-de-base-de-datos)
  - [Creación del servidor](#creación-del-servidor)
  - [Creación de modelos](#creación-de-modelos)
  - [Creación de rutas](#creación-de-rutas)
  - [Creación de controladores](#creación-de-controladores)
  - [Despliegue](#despliegue)
  - [Documentación](#documentación)
  - [Bonus](#bonus)
  - [Recursos](#recursos)

## Estructura de archivos

Vamos a crear la estructura de archivos que vamos a necesitar para el proyecto. 

```
.
├── config
│   ├── db.js
├── controllers
│   ├── productController.js
│   └── authController.js (BONUS)
├── models
│   └── Product.js
├── routes
│   └── productRoutes.js
│   └── authRoutes.js (BONUS)
├── middlewares (BONUS)
│   └── authMiddleware.js
├── helpers
│   └── template.js
│   └── getNavBar.js
│   └── baseHtml.js
└── index.js
├── test (BONUS)
│   └── productController.test.js
├── .env
└── package.json

```

### Características de los archivos

- `config/db.js`: Archivo que contendrá la configuración de la base de datos. Deberá conectarse a la base de datos de mongo en Atlas.
- `controllers/productController.js`: Archivo que contendrá la lógica para manejar las solicitudes CRUD de los productos. Devolverá las respuestas en formato HTML.
- `models/Product.js`: Archivo que contendrá la definición del esquema del producto utilizando Mongoose.
- `routes/productRoutes.js`: Archivo que contendrá la definición de las rutas CRUD para los productos. Este llama a los métodos del controlador.
- `index.js`: Archivo principal que iniciará el servidor Express. Importa las rutas y las usa. También tiene que estar configurado para servir archivos estáticos y para leer el body de las peticiones de formularios.
- `.env`: Archivo que contendrá las variables de entorno. En este caso, la uri de la base de datos de Atlas o el puerto de la aplicación. Más adelante añadiremos más variables de entorno, como la palabra secreta para la sesión.
- `package.json`: Archivo que contendrá las dependencias del proyecto. Crearemos un script para iniciar el servidor con node ("start": "node --watch index.js") o si lo preferís con nodemon ("dev": "nodemon index.js"). Si elegís esta última opción tendréis que instalar la dependencia como dependencia de desarrollo.

**BONUS**
- `controllers/authController.js`: Archivo que contendrá la lógica para manejar las solicitudes de autenticación.
- `routes/authRoutes.js`: Archivo que contendrá la definición de las rutas para la autenticación. Este llama a los métodos del controlador.
- `middlewares/authMiddleware.js`: Archivo que contendrá el middleware para comprobar si el usuario está autenticado. Este buscará la sesión del usuario y, si no la encuentra, redirigirá al formulario de login.

## Creacíon de base de datos

Vamos a crear la base de datos en Atlas. Una vez creada la base de datos, copiamos la uri y la guardamos en el archivo .env 
```
MONGO_URI=<uri_bd_atlas>
```

## Creación del servidor

Vamos a crear el servidor con express. 
El servidor devolverá las vistas usando template literals. También necesitaremos leer el body de las peticiones tipo post. Como trabajaremos con formularios html, necesitaremos los middlewares `express.urlencoded`, `express.json` para leer el body de las peticiones.

El puerto en el que escuchará el servidor lo cargaremos desde el archivo .env usando `dotenv`.

Creamos el archivo `index.js` y añadimos el código necesario para crear el servidor. Es el punto de inicio de nuestra API. 

## Creación de modelo

Vamos a crear el modelo de producto. El modelo de producto tendrá los siguientes campos:

- Nombre
- Descripción
- Imagen
- Categoría
- Talla
- Precio

La categoría será un string que podrá ser "Camisetas", "Pantalones", "Zapatos", "Accesorios".

La talla será un string que podrá ser "XS", "S", "M", "L", "XL".

[Modelo y vista con enum](enum.md)


## Subida de imagenes
- Puedes utilizar Cloudinary como proveedor externo de almacenamiento.
- Sube la imagen al panel de Cloudinary o mediante su API.
- Copia la URL que te devuelve la plataforma.
- Pega esa URL en el campo image del formulario o en el documento que guardes en la BBDD.

Una vez guardada, esa ruta servirá como referencia cuando renderices la imagen en el navegador, sin necesidad de almacenar archivos en tu propio servidor.


***RETO:***
Si tienes tiempo y te apetece probar, puedes hacer la subida directamente a `cloudinary` con `multer`desde el backend. De esta manera se gestionará la subida desde la aplicación.
[ejemplo de subida con multer a cloudinary](multerycloudinary.md)

## Creación de rutas

Vamos a crear las rutas CRUD para los productos.
Las rutas deberían tener una estructura similar a esta:

- GET /products: Devuelve todos los productos. Cada producto tendrá un enlace a su página de detalle.
- GET /products/:productId: Devuelve el detalle de un producto.
- GET /dashboard: Devuelve el dashboard del administrador. En el dashboard aparecerán todos los artículos que se hayan subido. Si clickamos en uno de ellos nos llevará a su página para poder actualizarlo o eliminarlo.
- GET /dashboard/new: Devuelve el formulario para subir un artículo nuevo.
- POST /dashboard: Crea un nuevo producto.
- GET /dashboard/:productId: Devuelve el detalle de un producto en el dashboard.
- GET /dashboard/:productId/edit: Devuelve el formulario para editar un producto.
- PUT /dashboard/:productId: Actualiza un producto.
- DELETE /dashboard/:productId/delete: Elimina un producto.

## Creación de controladores

A continuación crearemos el controlador de productos. Este controlador se dedicará a manejar las solicitudes CRUD de los productos. Devolverá las respuestas en formato HTML.
Para ello, crearemos algunas funciones auxiliares que nos ayudarán a devolver las vistas con SSR.

Las funciones principales del controlador serán:

- showProducts: Devuelve la vista con todos los productos.
- showProductById: Devuelve la vista con el detalle de un producto.
- showNewProduct: Devuelve la vista con el formulario para subir un artículo nuevo.
- createProduct: Crea un nuevo producto. Una vez creado, redirige a la vista de detalle del producto o a la vista de todos los productos del dashboard.
- showEditProduct: Devuelve la vista con el formulario para editar un producto.
- updateProduct: Actualiza un producto. Una vez actualizado, redirige a la vista de detalle del producto o a la vista de todos los productos del dashboard.
- deleteProduct: Elimina un producto. Una vez eliminado, redirige a la vista de todos los productos del dashboard.

Las funciones showProducts y showProductById pueden devolver respuestas ligeramente distintas si se llega desde el dashboard o desde la vista principal. Por ejemplo, si se llega desde el dashboard, se mostrará un enlace para editar o eliminar el producto. ***PISTA:*** Para ello podemos utilizar la url de la petición o pasar al controlador un parámetro extra que indique si se llega desde el dashboard o no.

Para generar el html de forma más eficiente y sacarlo de la lógica, podemos crear funciones y variables auxiliares que generen el html de los productos y del formulario. Estas funciones se pueden meter en una carpeta llamada ***helpers***.
Por ejemplo:
- baseHtml: html común a todas las páginas. Puede contener elementos como la importación de estilos, etc.
- getNavBar: Genera la barra de navegación con las categorías. En caso de estar en el dashboard, también generará un enlace para subir un nuevo producto.
- getProductCards: Genera el html de los productos. Recibe un array de productos y devuelve el html de las tarjetas de los productos.
- ...

Un ejemplo de una función para generar el html de los productos podría ser:

```javascript
function getProductCards(products) {
  let html = '';
  for (let product of products) {
    html += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>${product.price}€</p>
        <a href="/products/${product._id}">Ver detalle</a>
      </div>
    `;
  }
  return html;
}
```

Con estas funciones auxiliares, el controlador será más limpio y fácil de entender.
Ejemplo:

```javascript

const showProducts = async (req, res) => {
  const products = await Product.find();
  const productCards = getProductCards(products);
  const html = baseHtml + getNavBar() + productCards;
  res.send(html);
};
    
```

## Despliegue

Creamos un nuevo proyecto en render y desplegamos el proyecto desde github. Recordad añadir las variables de entorno en render. Si no aparece el repositorio en render, tendremos que modificar los permisos de render para que pueda acceder al repositorio.

## Documentación

Crearemos un archivo `README.md` que contenga la documentación del proyecto. En este readme explicaremos cómo poner en marcha la aplicación, las tecnologías que hemos usado, endpoints, etc. En definitiva, una documentación de nuestra API.

## PISTA
Los formularios solo permiten metodos GET y POST. Sieres hacer otra petición de envío (DELETE, PUT...) tendrás que usar [Method Override](https://www.npmjs.com/package/method-override)

```js
const methodOverride = require('method-override');
app.use(methodOverride('_method')); // leerá ?_method=PUT/DELETE
```
Para hacer que el form sepa que no vamos a usar el POST sino el DELETE, se hará de la siguiente manera

```js
<form action="/products/<ID a eliminar>?_method=DELETE" method="POST"> // vemos que el metodo POST pero con ?_method=DELETE lo cambia y podemos acceder a la ruta DELETE. Puedes hacer lo mismo con PUT. 
  <button type="submit">Eliminar</button>
</form>
```
La ruta recibirá el ID en params

```js
// DELETE /products/:id
router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products');                      // vuelve a la lista
});
```

## BONUS
## Bonus 1 - API (OBLIGATORIO)

Para poder usar la aplicación con un frontend en React, vamos a crear una API que haga las mismas operaciones que el controlador de productos, pero que devuelva los datos en formato JSON. Piensa como deberían ser esas rutas y controladores.

## Bonus 2 - Tests

Para poder comprobar que el controlador de productos funciona correctamente, vamos a crear tests para las funciones. Para ello, necesitaremos instalar el paquete `jest` y crear el archivo `productController.test.js` en la carpeta `test`. En este archivo, importaremos el controlador y crearemos los tests. Podemos hacer tests tanto para las funciones que devuelven html como para las funciones que crean, actualizan o eliminan productos...

Para funciones normales con jest será suficiente, pero para los controladores necesitaremos `Supertest`. Supertest lo que hace es simular una conexión con BBDD si que llegue a añadir nada.
[Jest + Supertest](jestsupertest.md)

## Bonus 3 - Documentación con Swagger

Crearemos un usuario administrador para que pueda subir desde el dashboard más productos. Esas rutas deberán estar protegidas para que solo pueda entrar quien esté logado y pueda acceder a esos elementos para crearlos, verlos, actualizarlos y borrarlos. 

## Bonus 4 - Interpretación de login + middleware. Rutas protegidas

Crea un middleware para las rutas protegidas (dashboard), crearemos un usuario y clave única que irá en .env. 
- Si se valida podrá entrar sino redireccionará de nuevo al login diciendo que no tiene acceso. 
- Si intenta entrar en una ruta protegida también le devolverá al login.

Recuerda subir en producción en el paratado de variables de entorno estas también para que pueda funcionar.

## Recursos

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Atlas](https://www.mongodb.com/cloud/atlas)
- [Render](https://render.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express.urlencoded](https://expressjs.com/en/api.html#express.urlencoded)
- [multer](https://www.npmjs.com/package/multer)
- [cloudinary](https://cloudinary.com/)
- [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [Guía de git en equipos](./git.md)

## La entrega del proyecto tenéis que mandarnos los siguiente:
- URL del repositorio
- URL de producción
- MONGO_URI y resto de variables de entorno si fueran necesarias (user, password, PORT,...)

Recuerda tener la IP abierta: Atlas -> network access -> IP Address 0.0.0.0/0 
 
---------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------AQUI VA MI README SUPERPROFESIONAL---------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------



# Backend Tienda de Ropa

Proyecto backend para una tienda online de ropa con catálogo público y panel de administración completo (CRUD).  
Desarrollado como práctica para el módulo de backend.

## Tecnologías utilizadas

- **Node.js** + **Express**  
- **MongoDB Atlas** + **Mongoose**  
- **dotenv** — variables de entorno  
- **method-override** — soporte PUT/DELETE desde formularios HTML  
- **Template literals** (SSR) — renderizado HTML en servidor sin motor externo  

## Requisitos

- Node.js ≥ 18  
- Cuenta en MongoDB Atlas (cluster ya creado)  
- Archivo `.env` configurado  

## Puesta en marcha

1. Entra en la carpeta del proyecto:
   ```bash
   cd backend-project-break

2. Instala dependencias (solo la primera vez o si cambias package.json)
   ```bash
   npm install

3. Verifica que el archivo .env existe y contiene: 
- PORT=8080
- MONGO_URI=mongodb+srv://<tu-usuario>:<tu-contraseña>@cluster0.8eceink.mongodb.net/tiendaRopa?retryWrites=true&w=majority

4. Levanta el servidor  
   ```bash
   npm run dev

# Endpoints principales

## Catálogo público
Método,| Ruta,                | Descripción
GET,   | /,                   | Página de bienvenida
GET,   | /products,           | Lista de todos los productos (catálogo)
GET,   | /products/:productId,| Detalle de un producto

## Dashboard administrador (CRUD)

Método,| Ruta,                      | Descripción
GET,   | /dashboard,                | Lista todos los productos + acciones CRUD
GET,   | /dashboard/new,            | Formulario para crear nuevo producto
POST,  | /dashboard,                | Crea producto → redirige a dashboard
GET,   | /dashboard/:productId,     | Detalle del producto (vista admin)
GET,   | /dashboard/:productId/edit,| Formulario para editar producto
PUT,   | /dashboard/:productId,     | Actualiza producto → redirige a dashboard
DELETE,| /dashboard/:productId,     | Elimina producto → redirige a dashboard

# Estructura del proyecto (resumida)

backend-project-break/
├── config/             → conexión a MongoDB
├── helpers/            → baseHtml.js, getNavBar.js, etc.
├── models/             → Product.js (esquema Mongoose)
├── routes/             → productRoutes.js, dashboardRoutes.js
├── .env                → (no subido a Git)
├── index.js            → servidor principal
├── package.json
└── README.md

# Características implementadas

Catálogo público con tarjetas clicables → detalle individual
Dashboard admin completo (CRUD: crear, leer, actualizar, eliminar)
Formularios con validación en backend (Mongoose)
Imágenes con placeholder automático si falla la URL
Navegación consistente (navbar en todas las páginas)
Helpers para mantener vistas limpias y reutilizables

