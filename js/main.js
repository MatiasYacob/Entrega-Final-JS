//Notas sobre el codigo: estoy usando la extencion Prettier para dar formato al documento.

//Aca va a ir todo el codigo que tiene que ver con el index.html 

let productos; // Declarar la variable productos fuera de la función

// Uso de Fetch para traer el array de productos.
const obtenerProductos = () => {
  return new Promise((resolve, reject) => {
    fetch("./js/productos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("Error en la solicitud: " + respuesta.status);
        }
        return respuesta.json();
      })
      .then((data) => {
        productos = data; // Asignar el valor a la variable productos
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Resto del código...


obtenerProductos()
  .then((productos) => {
    cargarProductos(productos);
  })
  .catch((error) => {
    console.log("Error al obtener los productos:", error);
  })


  // Aca declaro las variables que voy a usar para el DOM.
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


//Esta funcion se encarga de crear los DIVs para mostrar los productos en pantalla.

function cargarProductos(productosElegidos) {     
  contenedorProductos.innerHTML = "";  
  productosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = ` <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
    <div class="producto-detalles">
    
        <h3 class="producto-titulo">${producto.titulo}</h3>
        <p class="producto-descripcion" >${producto.descripcion} </p>
        <p class="producto-precio">Marca: ${producto.categoria.marca}</p>
        <p class="producto-precio">$${producto.precio}</p>
        <button class="producto-agregar" id="${producto.id}">Agregar</button>
    </div>
    `;
    contenedorProductos.append(div);
  });
  actualizarBotones(); // Aca llamo a la funcion para actualizar los botones de Agregar que se generan dinamicamente
}
//Esta funcion los botones categorias que van a ir filtrando las pestañas entre distincas categorias de los productos
//las cuales son TODOS los productos, productos de 5lts y productos de 20lts 
//(nos manejamos asi en mi trabajo por eso use estas categorias).
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");
    if (e.currentTarget.id != "todos") {   // Hay 3 pestañas con ID si NO tiene la ID "todos" se filtran los productos segun su cantidad.
      const productosBoton = productos.filter(
        (producto) => producto.categoria.cantidad === e.currentTarget.id
      );
      const productosCategoria = productos.find(
        (producto) => producto.categoria.cantidad === e.currentTarget.id
      );
      console.log(productosCategoria);
      tituloPrincipal.innerText = `Productos de : ${productosCategoria.categoria.cantidad}`;
      cargarProductos(productosBoton);
    } else { // sino se cargan todos los productos 
      cargarProductos(productos);
      tituloPrincipal.innerText = "Todos Los Productos";
    }
  });
});


//Esta funcion actualiza los botones de agregar al carrito ya que al ser generados de forma dinamica
//hay que volver a asignarles el evento de click  esta funcion se va a estar llamando cada vez que se rendericen los productos.
function actualizarBotones() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}
//Aca creo una variable con los productos cargados en el LS 
//esto es para que el numerito del carrito se mantenga aunque estemos cambiando de pagina
const productosEnCarritoLS = JSON.parse(
  localStorage.getItem("productos-en-carrito")
);
//esta variable es para el numero del carrito.
let productosEnCarrito;

//este condicional busca si hay productos cargados en el carrito para asigarle ese valora la variable que voy a usar para 
//contar cuantos productos hay en el carrito, en caso contrario le asigna un array vacio.
if (productosEnCarritoLS) {
  productosEnCarrito = productosEnCarritoLS;
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

//Uso de LocalStorage y Librerias (Toastify)

//Esta funcion va a agregar productos al carrito y muestra un "toast" como alerta visual para el usuario.
function agregarAlCarrito(e) {
  Toastify({
    text: "Se Agrego Un Producto.",
    duration: 3000,
    close: true,
    newWindow: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      dysplay: "flex",
      background: "linear-gradient(to right, #000000, #000000)",
      borderRadius: "1rem",
    },
  }).showToast();

  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(
    (producto) => producto.id === idBoton
  );
  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id === idBoton
    );
    productosEnCarrito[index].cantidadEnCarrito++;
  } else {
    productoAgregado.cantidadEnCarrito = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();  //llamo a la funcion del numero del carrito para que se actualize al mismo tiempo.
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

//Esta funcion se encarga de cambiar el numerito del carrito 
function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidadEnCarrito,
    0
  );
  numerito.innerText = nuevoNumerito;
}
