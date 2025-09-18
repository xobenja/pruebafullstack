// Obtener elementos del formulario
const formulario = document.querySelector('.formulario-registro');
const nombreInput = document.getElementById('nombre');
const correoInput = document.getElementById('correo');
const claveInput = document.getElementById('clave');
const clave2Input = document.getElementById('clave2');

// Evento al enviar el formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recarga de página

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const clave = claveInput.value;
    const clave2 = clave2Input.value;

    // Validar contraseñas
    if (clave !== clave2) {
        alert("Las contraseñas no coinciden ❌");
        return;
    }

    // Obtener usuarios existentes de localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar si el correo ya existe
    const correoExiste = usuarios.some(usuario => usuario.correo === correo);
    if (correoExiste) {
        alert("Este correo ya está registrado ❌");
        return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        contraseña: clave
    };

    // Guardar en localStorage
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert("Usuario registrado con éxito ✅");

    // Redirigir a usuarios.html
    window.location.href = "../usuarios.html";
});
