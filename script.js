
    let pasoActual = 1;
    let textos = ["", "", "", ""];
    const MAX_RENGLONES = 6;

    function iniciarEdicion() {
      pasoActual = 1;
      document.getElementById('panelLateral').classList.add('activo');
      actualizarPaso();
    }

    function editarCelda(num) {
      pasoActual = num;
      document.getElementById('panelLateral').classList.add('activo');
      actualizarPaso();
    }

    function actualizarPaso() {
      document.getElementById('numeroPaso').textContent = pasoActual;
      document.getElementById('labelParte').textContent = getPosicion(pasoActual);
      
      const textarea = document.getElementById('textoActual');
      textarea.value = textos[pasoActual-1] || "";
      
      textarea.focus();
      actualizarContador();

      document.getElementById('btnAnterior').style.display = pasoActual > 1 ? 'inline-block' : 'none';
    }

    function getPosicion(n) {
      const posiciones = ["Arriba Izquierda", "Arriba Derecha", "Abajo Izquierda", "Abajo Derecha"];
      return posiciones[n-1];
    }

    function actualizarContador() {
      const textarea = document.getElementById('textoActual');
      const lineas = (textarea.value.match(/\n/g) || []).length + 1; 
      
      const contador = document.getElementById('contador');
      contador.textContent = `${lineas} / ${MAX_RENGLONES} renglones`;
      
      if (lineas >= MAX_RENGLONES) {
        contador.style.color = '#d32f2f';
      } else if (lineas >= MAX_RENGLONES - 1) {
        contador.style.color = '#ff9800';
      } else {
        contador.style.color = '#888';
      }
    }

    function limitarRenglones() {
      const textarea = document.getElementById('textoActual');
      let lineas = (textarea.value.match(/\n/g) || []).length + 1;
      
      if (lineas > MAX_RENGLONES) {
        const lineasArray = textarea.value.split('\n');
        textarea.value = lineasArray.slice(0, MAX_RENGLONES).join('\n');
      }
      actualizarContador();
    }

    function guardarTextoActual() {
      const textarea = document.getElementById('textoActual');
      textos[pasoActual-1] = textarea.value.trim();
      
      const celda = document.getElementById(`celda${pasoActual}`);
      celda.innerHTML = textos[pasoActual-1] 
        ? `<div style="font-size:2rem; opacity:0.25; margin-bottom:8px;">${pasoActual}</div>${textos[pasoActual-1]}`
        : pasoActual;
    }

    function siguientePaso() {
      guardarTextoActual();
      if (pasoActual < 4) {
        pasoActual++;
        actualizarPaso();
      } else {
        document.getElementById('panelLateral').classList.remove('activo');
        alert("✅ ¡Pancarta completada!");
      }
    }

    function anteriorPaso() {
      if (pasoActual > 1) {
        guardarTextoActual();
        pasoActual--;
        actualizarPaso();
      }
    }

    function limpiarTodo() {
      if (confirm("¿Estás seguro de borrar toda la pancarta?")) {
        textos = ["", "", "", ""];
        for (let i = 1; i <= 4; i++) {
          document.getElementById(`celda${i}`).innerHTML = i;
        }
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      const textarea = document.getElementById('textoActual');
      
      textarea.addEventListener('input', limitarRenglones);
      textarea.addEventListener('keyup', limitarRenglones);
      textarea.addEventListener('paste', () => setTimeout(limitarRenglones, 10));
    });

    const inputImagen = document.getElementById('input-imagen');
const nombreArchivo = document.getElementById('nombre-archivo');

inputImagen.addEventListener('change', () => {
    if (inputImagen.files.length > 0) {
        nombreArchivo.textContent = inputImagen.files[0].name;
    } else {
        nombreArchivo.textContent = "Ningún archivo seleccionado";
    }
});
