const toggleBtn = document.getElementById("boton");
const sidebar = document.getElementById("navegacion");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});
