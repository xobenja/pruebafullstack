const tablaUsuarios = document.getElementById('usuarios-body');
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Mostrar usuarios en tabla
function mostrarUsuarios() {
    tablaUsuarios.innerHTML = "";

    usuarios.forEach((usuario, index) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${usuario.run || ''}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.apellidos || ''}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.fechaNac || ''}</td>
            <td>${usuario.contraseña}</td>
            <td>
                <button class="btn-accion" onclick="editarUsuario(${index})">✏️</button>
                <button class="btn-accion eliminar" onclick="eliminarUsuario(${index})">🗑️</button>
            </td>
        `;

        tablaUsuarios.appendChild(fila);
    });
}

// Editar usuario
function editarUsuario(index) {
    const usuario = usuarios[index];

    const run = prompt("RUN:", usuario.run || '');
    const nombre = prompt("Nombre:", usuario.nombre);
    const apellidos = prompt("Apellidos:", usuario.apellidos || '');
    const correo = prompt("Correo:", usuario.correo);
    const fechaNac = prompt("Fecha Nacimiento (YYYY-MM-DD):", usuario.fechaNac || '');
    const clave = prompt("Contraseña:", usuario.contraseña);

    if (run && nombre && apellidos && correo && fechaNac && clave) {
        // Validar RUN
        const patronRun = /^[0-9]{7,8}[0-9K]$/;
        if (!patronRun.test(run.toUpperCase())) {
            alert("RUN inválido. Ej: 19011022K");
            return;
        }

        // Validar correo
        const patronCorreo = /^[\w\.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!patronCorreo.test(correo)) {
            alert("Correo inválido. Debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
            return;
        }

        usuarios[index] = { run, nombre, apellidos, correo, fechaNac, contraseña: clave };
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mostrarUsuarios();
        alert("Usuario actualizado con éxito ✅");
    }
}

// Eliminar usuario
function eliminarUsuario(index) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        usuarios.splice(index, 1);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mostrarUsuarios();
    }
}

// Inicializar tabla al cargar
mostrarUsuarios();

// Boto Nuevo Usuario
const btnNuevo = document.getElementById('btn-nuevo');
btnNuevo.addEventListener('click', () => {
    window.location.href = "newUsuario/newUsuario.html";
});
