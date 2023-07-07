//Aca va el codigo que tiene que ver con carrito.html

//Traigo la informacion cargada en el LS para poder usarla.
const productosEnCarrito = JSON.parse(
    localStorage.getItem("productos-en-carrito")
);
console.log(productosEnCarrito);

//asigno las Variables que se usan para el DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

//Esta funcion se encarga de renderizar en pantalla los objetos del carrito
function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        //un condicionar que verifica si hay algo en el carrito.
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        actualizarTotal(); //llamo a la funcion para Mostrar la suma del costo de todos los productos.

        productosEnCarrito.forEach((producto) => {
            //se hace un forEach para crear los DIVs para mostrar en pantalla los productos.

            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen
                }" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Producto:</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidadEnCarrito}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>$${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>$${producto.precio * producto.cantidadEnCarrito}</p>
            </div>
            <button class="carrito-producto-eliminar" id="${producto.id
                }"><i class="bi bi-trash-fill"></i></button>
        `;

            contenedorCarritoProductos.append(div);
        });
    } else {
        // Y si no hay nada en el carrito se cambian estas class para mostrar que el carrito esta vacio con un mensajito
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
    //llamo a la funcion que actualiza los botones para eliminar ya que se generan de forma dinamica
    //lo mismo que los botones de agregar
    actualizarBotonesEliminar();
}

cargarProductosCarrito(); // llamo a la funcion para Renderizar el carrito

//esta funcion se encarga de asignar el evento de click a los botones de eliminar producto
//ya que como se generan de forma dinamica hay que asignarlos de forma dinamica igual que con los de agregar
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

//Esta funcion se encarga de eliminar un producto especifico del carrito cuando le hacemos click
//Uso de libreria (Toastify) basicamente la misma que Agregar pero con el mensaje que se elimino un producto.
function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto Eliminado.",
        duration: 3000,
        newWindow: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #000000, #000000)",
            borderRadius: "1rem",
        },
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(
        (producto) => producto.id === idBoton
    );
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito(); // Vuelvo a renderizar la pagina para que se vean los cambios.
    localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
    );
}

//Aca le asigno el evento click al boton de vaciar carrito para que ejecute la funcion vaciarCarrito().
botonVaciar.addEventListener("click", vaciarCarrito);
//Esta funcion se encarga de vaciar TODO el carrito
//Uso de libreria (SweetAlert2) con un cartelito para preguntar si esta seguro.
function vaciarCarrito() {
    Swal.fire({
        title: "Seguro quiere borrar el carrito?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Borrar",
        denyButtonText: `Cancelar`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire("Se Eliminaron los Articulos! ", "", "success");
            productosEnCarrito.length = 0;
            localStorage.setItem(
                "productos-en-carrito",
                JSON.stringify(productosEnCarrito)
            );
            cargarProductosCarrito(); // Vuelvo a renderizar la pagina para que se vean los cambios.
        } else if (result.isDenied) {
            Swal.fire(" No se Eliminaron los Articulos!", "", "error");
        }
    });
}

//Esta funcion se encarga de contabilizar el Total del costo de todos los productos cargados en el carrito.
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce(
        (acc, producto) => acc + producto.precio * producto.cantidadEnCarrito,
        0
    );
    contenedorTotal.innerText = `$${totalCalculado}`;
    console.log(totalCalculado);
}

function carritoComprado() {
    productosEnCarrito.length = 0;
    localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
    );

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}


//Esta funcion simula una compra borrando todo lo guardado en LS y mostrando un mensaje de "gracias".
const comprar = async () => {
    try {
        const result = await Swal.fire({
            title: "Seguro quiere confirmar esta compra?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Confirmar",
            denyButtonText: `Cancelar`,
        });

        if (result.isConfirmed) {
            
            const loadingMessage = Swal.fire({
                title: "Espere un momento...",
                showConfirmButton: false,
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            await new Promise((resolve) => setTimeout(resolve, 3000));

            Swal.close();
            Swal.fire("Operacion Exitosa! ", "", "success");
            carritoComprado()
            cargarProductosCarrito();
        } else if (result.isDenied) {
            Swal.fire("Operacion Cancelada", "", "error");
        }
    } catch (error) {
        console.log("Error:", error);
    }
};











//Aca le asigno el evento click al boton de vaciar carrito para que ejecute la funcion comprarCarrito().
botonComprar.addEventListener("click", comprar);




