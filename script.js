let pasoActual = 1;
let textos = ["", "", "", ""];
let imagenes = ["", "", "", ""];
const MAX_RENGLONES = 6;
let modoBorradoActivo = false; 

function iniciarEdicion() {
  pasoActual = 1;
  document.getElementById('panelLateral').classList.add('activo');
  actualizarPaso();
}

function editarCelda(num) {
  if (modoBorradoActivo) return;
  pasoActual = num;
  document.getElementById('panelLateral').classList.add('activo');
  actualizarPaso();
}

function actualizarPaso() {
  document.getElementById('numeroPaso').textContent = pasoActual;
  document.getElementById('labelParte').textContent = getPosicion(pasoActual);
  
  const textarea = document.getElementById('textoActual');
  textarea.value = textos[pasoActual-1] || "";
  
  const nombreArchivo = document.getElementById('nombre-archivo');
  if (imagenes[pasoActual-1]) {
    nombreArchivo.textContent = "Imagen cargada en este paso";
  } else {
    nombreArchivo.textContent = "Ningún archivo seleccionado";
  }
  
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

function renderizarCelda(paso) {
  const celda = document.getElementById(`celda${paso}`);
  if (!celda) return;

  if (!textos[paso-1] && !imagenes[paso-1]) {
    celda.innerHTML = paso;
    return;
  }

  let contenidoHTML = `<div style="font-size:2rem; opacity:0.25; margin-bottom:8px;">${paso}</div>`;
  
  if (imagenes[paso-1]) {
    contenidoHTML += `<img src="${imagenes[paso-1]}" style="max-width:95%; max-height:120px; object-fit:contain; display:block; margin:0 auto 10px auto; border-radius:6px;">`;
  }
  
  if (textos[paso-1]) {
    contenidoHTML += `<div style="font-size:1.15rem; word-break:break-word; white-space:pre-wrap;">${textos[paso-1]}</div>`;
  }
  
  celda.innerHTML = contenidoHTML;
}

function guardarTextoActual() {
  const textarea = document.getElementById('textoActual');
  textos[pasoActual-1] = textarea.value.trim();
  renderizarCelda(pasoActual);
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
  const botonMenos = document.getElementById('btn-menos');
  const celdas = [
    document.getElementById('celda1'),
    document.getElementById('celda2'),
    document.getElementById('celda3'),
    document.getElementById('celda4')
  ];

  modoBorradoActivo = !modoBorradoActivo;

  if (modoBorradoActivo) {
    botonMenos.style.outline = "3px solid #ff0000";
    botonMenos.textContent = "Terminar -";

    celdas.forEach((celda, indice) => {
      if (celda) {
        celda.style.cursor = 'pointer';
        celda.style.backgroundColor = 'rgba(211, 47, 47, 0.2)'; 
        celda.classList.add('celda-borrado'); 

        celda.onclick = function() {
          if (modoBorradoActivo) {
            textos[indice] = "";   
            imagenes[indice] = "";  
            celda.innerHTML = indice + 1; 
            
            if (pasoActual === (indice + 1)) {
              document.getElementById('textoActual').value = "";
              document.getElementById('nombre-archivo').textContent = "Ningún archivo seleccionado";
              actualizarContador();
            }
          }
        };
      }
    });
  } else {
    desactivarModoBorrado(celdas, botonMenos);
  }
}

function desactivarModoBorrado(celdas, botonMenos) {
  modoBorradoActivo = false;
  botonMenos.style.outline = "none";
  botonMenos.textContent = "-";

  celdas.forEach((celda, indice) => {
    if (celda) {
      celda.style.cursor = 'default';
      celda.style.backgroundColor = 'transparent'; 
      celda.classList.remove('celda-borrado');     

      celda.onclick = function() {
        editarCelda(indice + 1);
      };
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('textoActual');
  
  textarea.addEventListener('input', () => {
    limitarRenglones();
    textos[pasoActual-1] = textarea.value;
    renderizarCelda(pasoActual);
  });

  textarea.addEventListener('keyup', limitarRenglones);
  textarea.addEventListener('paste', () => setTimeout(limitarRenglones, 10));

  const inputImagen = document.getElementById('input-imagen');
  const nombreArchivo = document.getElementById('nombre-archivo');

  if (inputImagen && nombreArchivo) {
    inputImagen.addEventListener('change', () => {
      if (inputImagen.files.length > 0) {
        const archivo = inputImagen.files[0];
        nombreArchivo.textContent = archivo.name;

        const lector = new FileReader();
        lector.onload = function(e) {
          imagenes[pasoActual-1] = e.target.result;
          renderizarCelda(pasoActual); 
        };
        lector.readAsDataURL(archivo);
      } else {
        nombreArchivo.textContent = "Ningún archivo seleccionado";
      }
    });
  }
});