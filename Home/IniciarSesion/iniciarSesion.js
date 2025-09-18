const formulario = document.querySelector('.iniciar-sesion');

formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email) {
    alert("El correo es requerido");
    return;
  }

  if (email.length > 100) {
    alert("El correo no puede superar los 100 caracteres");
    return;
  }

  const patronCorreo = /^[\w\.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  if (!patronCorreo.test(email)) {
    alert("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
    return;
  }

  if (!password) {
    alert("La contraseña es requerida");
    return;
  }

  if (password.length < 4 || password.length > 10) {
    alert("La contraseña debe tener entre 4 y 10 caracteres");
    return;
  }

  if (email === 'adm@gmail.com' && password === '00000000') {
    alert('Bienvenido, Administrador');
    window.location.href = '../../Administrador/IndexAdministrador/indexAdministrador.html';
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.correo === email);

  if (!usuario) {
    alert('Correo no registrado');
    return;
  }

  if (usuario.contraseña !== password) {
    alert('Contraseña incorrecta');
    return;
  }

  localStorage.setItem('usuarioActual', JSON.stringify(usuario));

  alert(`Bienvenido, ${usuario.nombre}`);
  window.location.href = '../../Home2/Index2/index2.html';
});
