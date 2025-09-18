const formulario = document.querySelector('.formulario-registro');

formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    const run = document.getElementById('run').value.trim().toUpperCase();
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const fechaNac = document.getElementById('fecha-nac').value;
    const clave = document.getElementById('clave').value.trim();
    const clave2 = document.getElementById('clave2').value.trim();

    // -------------------------
    // 🔹 VALIDAR RUN
    // -------------------------
    const patronRun = /^[0-9]{7,8}[0-9K]$/;
    if (!run) {
        alert("El RUN es requerido");
        return;
    }
    if (!patronRun.test(run)) {
        alert("RUN inválido. Ej: 123456789 (sin puntos ni guion)");
        return;
    }

    // -------------------------
    // 🔹 VALIDAR NOMBRE
    // -------------------------
    if (!nombre) {
        alert("El nombre es requerido");
        return;
    }
    if (nombre.length > 50) {
        alert("El nombre no puede superar los 50 caracteres");
        return;
    }

    // -------------------------
    // 🔹 VALIDAR APELLIDOS
    // -------------------------
    if (!apellidos) {
        alert("Los apellidos son requeridos");
        return;
    }
    if (apellidos.length > 100) {
        alert("Los apellidos no pueden superar los 100 caracteres");
        return;
    }

    // -------------------------
    // 🔹 VALIDAR CORREO
    // -------------------------
    if (!correo) {
        alert("El correo es requerido");
        return;
    }
    if (correo.length > 100) {
        alert("El correo no puede superar los 100 caracteres");
        return;
    }
    const patronCorreo = /^[\w\.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!patronCorreo.test(correo)) {
        alert("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
        return;
    }

    // -------------------------
    // 🔹 VALIDAR FECHA NACIMIENTO
    // -------------------------
    if (!fechaNac) {
        alert("La fecha de nacimiento es requerida");
        return;
    }

    // -------------------------
    // 🔹 VALIDAR CONTRASEÑAS
    // -------------------------
    if (!clave) {
        alert("La contraseña es requerida");
        return;
    }
    if (clave.length < 4 || clave.length > 10) {
        alert("La contraseña debe tener entre 4 y 10 caracteres");
        return;
    }
    if (clave !== clave2) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // -------------------------
    // 🔹 GUARDAR USUARIO
    // -------------------------
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarios.some(u => u.correo === correo)) {
        alert("El correo ya está registrado");
        return;
    }

    const usuario = { run, nombre, apellidos, correo, fechaNac, contraseña: clave };
    usuarios.push(usuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert("Registro exitoso ✅");
    window.location.href = "../IniciarSesion/iniciarSesion.html";
});
