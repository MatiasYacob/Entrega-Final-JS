//esto es para la version movile. abre y cierra el menu 


const openMenu = document.querySelector("#open-menu");
const closeMenu = document.querySelector("#close-menu");
const aside = document.querySelector("aside");

openMenu.addEventListener("click", () => {
    aside.classList.add("aside-visible");
});

closeMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
});

function asignarEvento(){
if (typeof botonesCategorias !== "undefined") {
    botonesCategorias.forEach((boton) => {
      boton.addEventListener("click", () => {
        aside.classList.remove("aside-visible");
      });
    });
  }
}
asignarEvento();


