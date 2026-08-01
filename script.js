function revelarRegalo(elementoClickeado) {
    // Desde el contenedor donde se hizo clic, buscamos ADENTRO a la capa que tiene la clase 'clase-regalo'
    const capaRegalo = elementoClickeado.querySelector('.clase-regalo');
    
    if (capaRegalo) {
        // Le aplicamos la animación de caída solo a ESA capa específica
        capaRegalo.classList.add('opacity-0', 'translate-y-full');
        
        // Desaparece por completo después de la animación
        setTimeout(() => {
            capaRegalo.classList.add('hidden');
        }, 700);
    }
}

function irAlAlbum(pasoDestino) {
    // 1. Ocultamos la pantalla de inicio y el cartel del título
    const inicio = document.getElementById('pantalla-inicio');
    const cartel = document.getElementById('cartel-titulo');
    if (inicio) inicio.classList.add('hidden');
    if (cartel) cartel.classList.add('hidden');
    
    // 2. Ocultamos todos los pasos de álbumes abiertos
    const pasos = document.querySelectorAll('[id^="album-paso-"]');
    pasos.forEach(paso => paso.classList.add('hidden'));
    
    // 3. APAGAMOS LOS GATITOS DEL BODY
    document.body.style.backgroundImage = 'none';
    
    // 4. MANEJO DE FONDOS ESPECIALES (Apagamos ambos primero para evitar superposiciones)
    const gifNormal = document.getElementById('gif-fondo');
    const fondoDW = document.getElementById('fondo-dw');
    
    if (gifNormal) gifNormal.classList.add('hidden');
    if (fondoDW) fondoDW.classList.add('hidden');

    // 5. Encendemos el fondo que corresponde según el álbum de destino
    if (pasoDestino === 28) {
        if (fondoDW) fondoDW.classList.remove('hidden');
    } else {
        if (gifNormal) gifNormal.classList.remove('hidden');
    }
    
    // 6. Mostramos el paso del álbum seleccionado
    const pasoActual = document.getElementById(`album-paso-${pasoDestino}`);
    if (pasoActual) {
        pasoActual.classList.remove('hidden');
    }
}

function volverAlInicio() {
    // 1. Ocultamos todos los pasos de los álbumes
    const pasos = document.querySelectorAll('[id^="album-paso-"]');
    pasos.forEach(paso => paso.classList.add('hidden'));
    
    // 2. APAGAMOS AMBOS FONDOS DINÁMICOS
    const gifNormal = document.getElementById('gif-fondo');
    const fondoDW = document.getElementById('fondo-dw');
    
    if (gifNormal) gifNormal.classList.add('hidden');
    if (fondoDW) fondoDW.classList.add('hidden');
    
    // 3. RESTAURAMOS LOS GATITOS AL BODY
    document.body.style.backgroundImage = "url('assets/fondogatitos.png')";
    
    // 4. Volvemos a mostrar la pantalla de inicio y el título
    const inicio = document.getElementById('pantalla-inicio');
    const cartel = document.getElementById('cartel-titulo');
    if (inicio) inicio.classList.remove('hidden');
    if (cartel) cartel.classList.remove('hidden');
}

// ====== FUNCIONES PARA HACER ZOOM A LAS FOTOS ======

function abrirZoom(elementoImg) {
    const modal = document.getElementById('modal-zoom');
    const imagenModal = document.getElementById('foto-zoom-img');
    const textoModal = document.getElementById('texto-zoom-desc');
    
    const contenedorTexto = textoModal.parentElement; 
    const contenedorImagen = imagenModal.parentElement;

    // 1. Copiamos la ruta de la foto
    imagenModal.src = elementoImg.src;
    
    // 2. Leemos si tiene el atributo data-texto escrito
    const textoRecuerdo = elementoImg.getAttribute('data-texto');
    
    if (textoRecuerdo && textoRecuerdo.trim() !== "") {
        // --- CASO A: SI TIENE TEXTO ---
        textoModal.innerText = textoRecuerdo;
        
        // Mostramos el bloque blanco del texto
        contenedorTexto.classList.remove('hidden');
        
        // Volvemos a la distribución compartida en monitores (Imagen 2/3, Texto 1/3)
        contenedorImagen.classList.remove('md:w-full');
        contenedorImagen.classList.add('md:w-2/3');
    } else {
        // --- CASO B: SINO TIENE TEXTO (SOLO ZOOM LIMPIO) ---
        textoModal.innerText = "";
        
        // Escondemos por completo el bloque blanco del texto para que no deje bordes vacíos
        contenedorTexto.classList.add('hidden');
        
        // Hacemos que el contenedor de la imagen ocupe el centro libre
        contenedorImagen.classList.remove('md:w-2/3');
        contenedorImagen.classList.add('md:w-full');
    }
    
    // 3. Abrimos el modal
    modal.showModal();
}

function cerrarZoom() {
    const modal = document.getElementById('modal-zoom');
    modal.close();
}

function voltearCarta(elemento) {
    const cajaGirable = elemento.children[0];
    cajaGirable.classList.toggle('[transform:rotateY(180deg)]');
}

// 2. Click derecho: Cancela el menú normal y reutiliza TU abrirZoom()
function abrirZoomCarta(evento, elementoCarta) {
    evento.preventDefault(); // Bloquea el menú del click derecho

    // Toma la cara frontal de la carta (la segunda <img> dentro del div)
    const imgFrente = elementoCarta.querySelectorAll('img')[1];

    if (imgFrente) {
        // Le pasa el <img> directamente a tu función existente
        abrirZoom(imgFrente); 
    }
}

const CLAVE_CORRECTA = "0208"; // 👈 Cambiá esto por la contraseña real (ej. tu fecha especial)

function validarClave() {
    const input = document.getElementById('input-clave');
    const mensajeError = document.getElementById('mensaje-error');
    const vistaCandado = document.getElementById('vista-candado');
    const contenidoSecreto = document.getElementById('contenido-secreto');

    if (input.value.trim() === CLAVE_CORRECTA) {
        // Clave correcta: ocultamos el candado y mostramos el contenido
        vistaCandado.classList.add('hidden');
        contenidoSecreto.classList.remove('hidden');
        mensajeError.classList.add('hidden');
        
        // Guardamos en la sesión para que si recarga la página o vuelve no tenga que escribirla de nuevo
        sessionStorage.setItem('album_secreto_desbloqueado', 'true');
    } else {
        // Clave incorrecta: mostramos mensaje de error y vibra/agita el input
        mensajeError.classList.remove('hidden');
        input.classList.add('border-rose-500');
        input.value = '';
        input.focus();
        window.timerError = setTimeout(() => {
            mensajeError.classList.remove('animate-bounce');
            mensajeError.classList.add('hidden');
        }, 2500);
    }
}

// Permite validar apretando la tecla "Enter" en lugar de hacer click en el botón
function siPresionaEnter(evento) {
    if (evento.key === 'Enter') {
        validarClave();
    }
}

// Para volver a bloquear la sección si quiere
function volverABloquear() {
    sessionStorage.removeItem('album_secreto_desbloqueado');
    document.getElementById('vista-candado').classList.remove('hidden');
    document.getElementById('contenido-secreto').classList.add('hidden');
    document.getElementById('input-clave').value = '';
}

// Revisa si ya la había desbloqueado anteriormente al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('album_secreto_desbloqueado') === 'true') {
        document.getElementById('vista-candado').classList.add('hidden');
        document.getElementById('contenido-secreto').classList.remove('hidden');
    }
});

  //irAlAlbum(28);