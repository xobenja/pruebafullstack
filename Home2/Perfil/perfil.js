document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  if (!usuario) {
    alert("Debes iniciar sesión primero");
    window.location.href = "../../Login/login.html";
    return;
  }

  // Mostrar en avatar
  document.getElementById("nombre-usuario").textContent = usuario.nombre;
  document.getElementById("correo-usuario").textContent = usuario.correo;

  // Rellenar formulario con datos del usuario
  document.getElementById("input-run").value = usuario.run || '';
  document.getElementById("input-nombre").value = usuario.nombre;
  document.getElementById("input-apellidos").value = usuario.apellidos || '';
  document.getElementById("input-correo").value = usuario.correo;
  document.getElementById("input-fecha-nac").value = usuario.fechaNac || '';
  document.getElementById("input-pass").value = usuario.contraseña;

  // Guardar cambios
  const form = document.getElementById("perfil-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const run = document.getElementById("input-run").value.trim().toUpperCase();
    const nuevoNombre = document.getElementById("input-nombre").value.trim();
    const apellidos = document.getElementById("input-apellidos").value.trim();
    const nuevoCorreo = document.getElementById("input-correo").value.trim();
    const fechaNac = document.getElementById("input-fecha-nac").value;
    const nuevaPass = document.getElementById("input-pass").value.trim();

    const correoOriginal = usuario.correo;

    const patronRun = /^[0-9]{7,8}[0-9K]$/;
    if (!run) {
      alert("El RUN es requerido");
      return;
    }
    if (!patronRun.test(run)) {
      alert("RUN inválido. Ej: 19011022K (sin puntos ni guion)");
      return;
    }

    if (!nuevoNombre || nuevoNombre.length > 50) {
      alert("El nombre es requerido y no puede superar los 50 caracteres");
      return;
    }

    
    if (!apellidos || apellidos.length > 100) {
      alert("Los apellidos son requeridos y no pueden superar los 100 caracteres");
      return;
    }

   
    const patronCorreo = /^[\w\.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!nuevoCorreo || nuevoCorreo.length > 100 || !patronCorreo.test(nuevoCorreo)) {
      alert("Correo inválido. Debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return;
    }

    if (!fechaNac) {
      alert("La fecha de nacimiento es requerida");
      return;
    }

    if (!nuevaPass || nuevaPass.length < 4 || nuevaPass.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres");
      return;
    }

   
    usuario.run = run;
    usuario.nombre = nuevoNombre;
    usuario.apellidos = apellidos;
    usuario.correo = nuevoCorreo;
    usuario.fechaNac = fechaNac;
    usuario.contraseña = nuevaPass;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const index = usuarios.findIndex(u => u.correo === correoOriginal);

    if (usuarios.some((u, i) => u.correo === nuevoCorreo && i !== index)) {
      alert("El correo ya está registrado por otro usuario");
      return;
    }

    if (index !== -1) {
      usuarios[index] = usuario;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    localStorage.setItem("usuarioActual", JSON.stringify(usuario));

    alert("Datos actualizados correctamente ✅");
    location.reload();
  });

  // Cerrar sesión
  document.querySelector(".btn-cerrar").addEventListener("click", () => {
    localStorage.removeItem("usuarioActual");
    alert("Sesión cerrada");
    window.location.href = "../../Home/Index/index.html";
  });
});
