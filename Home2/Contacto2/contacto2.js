document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contacto2-form");

    const inputNombre = document.getElementById("nombre");
    const inputCorreo = document.getElementById("correo");
    const inputMensaje = document.getElementById("mensaje");

    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorMensaje = document.getElementById("error-mensaje");

    // Obtener usuario actual desde localStorage
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

    if (!usuarioActual) {
        alert("Debes iniciar sesión primero");
        window.location.href = "../../Login/login.html";
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Limpiar errores y estilos previos
        [inputNombre, inputCorreo, inputMensaje].forEach(input => {
            input.classList.remove("error-input", "valid-input");
        });
        [errorNombre, errorCorreo, errorMensaje].forEach(span => span.textContent = "");

        let valido = true;

        const nombre = inputNombre.value.trim();
        const correo = inputCorreo.value.trim();
        const mensaje = inputMensaje.value.trim();

        // VALIDAR NOMBRE
        if (!nombre) {
            errorNombre.textContent = "El nombre es requerido";
            inputNombre.classList.add("error-input");
            valido = false;
        } else if (nombre.length > 100) {
            errorNombre.textContent = "El nombre no puede superar los 100 caracteres";
            inputNombre.classList.add("error-input");
            valido = false;
        } else if (nombre !== usuarioActual.nombre) {
            errorNombre.textContent = "El nombre debe coincidir con el del perfil";
            inputNombre.classList.add("error-input");
            valido = false;
        } else {
            inputNombre.classList.add("valid-input");
        }

        // VALIDAR CORREO
        const patronCorreo = /^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!correo) {
            errorCorreo.textContent = "El correo es requerido";
            inputCorreo.classList.add("error-input");
            valido = false;
        } else if (correo.length > 100) {
            errorCorreo.textContent = "El correo no puede superar los 100 caracteres";
            inputCorreo.classList.add("error-input");
            valido = false;
        } else if (!patronCorreo.test(correo)) {
            errorCorreo.textContent = "El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com";
            inputCorreo.classList.add("error-input");
            valido = false;
        } else if (correo !== usuarioActual.correo) {
            errorCorreo.textContent = "El correo debe coincidir con el del perfil";
            inputCorreo.classList.add("error-input");
            valido = false;
        } else {
            inputCorreo.classList.add("valid-input");
        }

        // VALIDAR MENSAJE
        if (!mensaje) {
            errorMensaje.textContent = "El mensaje es requerido";
            inputMensaje.classList.add("error-input");
            valido = false;
        } else if (mensaje.length > 500) {
            errorMensaje.textContent = "El mensaje no puede superar los 500 caracteres";
            inputMensaje.classList.add("error-input");
            valido = false;
        } else {
            inputMensaje.classList.add("valid-input");
        }

        // Si todo está correcto
        if (valido) {
            alert("Formulario enviado correctamente ✅");
            form.reset();
            [inputNombre, inputCorreo, inputMensaje].forEach(input => input.classList.remove("valid-input"));
        }
    });
});
