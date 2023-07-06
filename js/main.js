let productos = [];
fetch("./js/productos.json")
  .then(response => response.json())
  .then(data => {
  productos = data;
  cargarProductos(productos);
})

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

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
  actualizarBotones();
}


botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");
    if (e.currentTarget.id != "todos") {
      const productosBoton = productos.filter(
        (producto) => producto.categoria.cantidad === e.currentTarget.id
      );
      const productosCategoria = productos.find(producto => producto.categoria.cantidad === e.currentTarget.id);
      console.log(productosCategoria)
      tituloPrincipal.innerText = `Productos de : ${productosCategoria.categoria.cantidad}`
      cargarProductos(productosBoton);
    } else {
      cargarProductos(productos);
      tituloPrincipal.innerText = "Todos Los Productos";
    }
  });
});

function actualizarBotones(){
    botonesAgregar = document.querySelectorAll(".producto-agregar")

    botonesAgregar.forEach(boton => {
      boton.addEventListener("click", agregarAlCarrito);
      
    });
      
    
}

const productosEnCarritoLS = JSON.parse(localStorage.getItem("productos-en-carrito"));

let productosEnCarrito;
if(productosEnCarritoLS){
  productosEnCarrito = productosEnCarritoLS
  actualizarNumerito()
}else{
  productosEnCarrito = [];
}


function agregarAlCarrito(e){

  Toastify({
    text: "Se Agrego Un Producto.",
    duration: 3000,
    close: true,
    newWindow: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      dysplay:"flex",
      background: "linear-gradient(to right, #000000, #000000)",
      borderRadius: "1rem"
    }
  }).showToast();

  const idBoton = e.currentTarget.id;
  const productoAgregado = productos.find(producto => producto.id === idBoton);
  if(productosEnCarrito.some(producto => producto.id === idBoton)){
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito[index].cantidadEnCarrito++;
  }else{
    productoAgregado.cantidadEnCarrito = 1;
    productosEnCarrito.push(productoAgregado);
  }
  actualizarNumerito();
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
};


function actualizarNumerito(){
  let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidadEnCarrito, 0);
  numerito.innerText = nuevoNumerito
}