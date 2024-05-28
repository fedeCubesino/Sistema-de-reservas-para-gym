



    document.addEventListener("DOMContentLoaded", function() {
    const calendario = document.querySelector(".calendario");
    const mesActualElemento = document.querySelector(".mesActual");
    const contenedorHorarios = document.querySelector (".horarios-disponibles");
    const formularioReserva = document.getElementById("formularioReserva");
    let anoActual;
    let mesActual;
    let fechaSeleccionada;
    let horarioSeleccionado;
    const horariosReservadosPorFecha = {};  
     
        /* Obtener los datos guardados del almacenamiento local al cargar la página */
    const datosGuardados = localStorage.getItem("datosReservas");
    if (datosGuardados) {
        Object.assign(horariosReservadosPorFecha, JSON.parse(datosGuardados));
    }

     /* Obtener la fecha actual */

    const hoy = new Date();
    anoActual = hoy.getFullYear();
    mesActual = hoy.getMonth();

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    generarCalendario(anoActual, mesActual);

     /* Función para generar el calendario */

    
    function generarCalendario(ano, mes) {
        const primerDiaDelMes = new Date(ano, mes, 1);
        const ultimoDiaDelMes = new Date(ano, mes + 1, 0);
        const diasEnMes = ultimoDiaDelMes.getDate();

        const diasElemento = calendario.querySelector(".dias");
        diasElemento.innerHTML = "";   /* Limpia los días existentes antes de generar los nuevos */

        
        mesActualElemento.textContent = meses[mes] + " " + ano;

         /* Calendario con los días del mes */

        for (let i = 0; i < primerDiaDelMes.getDay(); i++) {
            const diaVacio = document.createElement("div");
            diaVacio.classList.add("dia");
            diasElemento.appendChild(diaVacio);
        }

        for (let i = 1; i <= diasEnMes; i++) {
            const diaElemento = document.createElement("div");
            diaElemento.classList.add("dia");
            diaElemento.textContent = i;
            diasElemento.appendChild(diaElemento);
        }
    }

     /* Evento para cambiar al mes anterior */

    document.getElementById("mesAnterior").addEventListener("click", function() {
        mesActual--;
        if (mesActual < 0) {
            mesActual = 11;
            anoActual--;
        }
        generarCalendario(anoActual, mesActual);
    });

    /*  Evento para cambiar al mes siguiente */

    document.getElementById("mesSiguiente").addEventListener("click", function() {
        mesActual++;
        if (mesActual > 11) {
            mesActual = 0;
            anoActual++;
        }
        generarCalendario(anoActual, mesActual);
    });

     /* Evento para seleccionar una fecha específica */

    calendario.querySelector(".dias").addEventListener("click", function(event) {
        const dia = event.target.textContent;
        fechaSeleccionada = new Date(anoActual, mesActual, dia);
        mostrarHorariosDisponibles(fechaSeleccionada);
        contenedorHorarios.style.display = "flex";
    });
    
     /* Mostrar las opciones de horarios */
     function mostrarHorariosDisponibles(fecha) {
        contenedorHorarios.innerHTML = "";   /* Limpia las opciones de horarios existentes */
    
        const horariosReservadosParaFecha = horariosReservadosPorFecha[fecha.toLocaleDateString('es-ES')] || [];
    
        /* Horarios disponibles para el día seleccionado */
        const horariosDisponibles = ["09:00hs", "10:00hs", "11:00hs", "12:00hs", "13:00hs", "14:00hs", "15:00hs"];
        const eligeHorario = document.createElement("div");
        eligeHorario.textContent = "Elige un horario para:" + fecha.toLocaleDateString('es-ES');
        eligeHorario.style.fontWeight = "bold";
        contenedorHorarios.appendChild(eligeHorario);
    
        /* Mostrar las opciones de horarios disponibles */
        horariosDisponibles.forEach(function(horario) {
            const opcion = document.createElement("div");
            opcion.classList.add("horario");
            opcion.textContent = horario;
            opcion.style.lineHeight = "25px";
            
            // Verificar si el horario está reservado
            if (horariosReservadosParaFecha.some(reserva => reserva.horario === horario)) {
                opcion.classList.add("reservado");
            }
    
            contenedorHorarios.appendChild(opcion);
        });
    };

     /* Evento para seleccionar un horario */

     contenedorHorarios.addEventListener("click", function(event) {
        if (event.target.classList.contains("horario")) {
            horarioSeleccionado = event.target.textContent;
            const fechaKey = fechaSeleccionada.toLocaleDateString('es-ES');
            const horariosReservados = horariosReservadosPorFecha[fechaKey];
            if (horariosReservados && horariosReservados.some(reserva => reserva.horario === horarioSeleccionado)) {
                
                const reserv = document.createElement("div");
                reserv.classList.add("reserv");
                reserv.textContent = "\nEl horario no esta disponible";
                contenedorHorarios.appendChild(reserv);
                
            } else {
                mostrarFormularioReserva();
                contenedorHorarios.style.display= "none";
            }
        }
    });
    
    
    
    

    
    
    
     /* Mostrar el formulario de reserva */
    function mostrarFormularioReserva() {
        formularioReserva.style.display = "flex";
    }
    
     /* Maneja el envío del formulario */
    formularioReserva.addEventListener("submit", function(event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const telefono = document.getElementById("telefono").value;

         /* Guardar el horario reservado para la fecha seleccionada */
        
        
         if (!horariosReservadosPorFecha[fechaSeleccionada.toLocaleDateString('es-ES')]) {
            horariosReservadosPorFecha[fechaSeleccionada.toLocaleDateString('es-ES')] = [];
        }
        horariosReservadosPorFecha[fechaSeleccionada.toLocaleDateString('es-ES')].push({
            nombre: nombre,
            horario: horarioSeleccionado,
            telefono: telefono
        });

        
        

    var mensaje = "Fecha\t\tHorarios reservados\t\tNombre\n";
    mensaje += "--------------------------------------------\n";

    // Iterar sobre las claves y valores del objeto horariosReservadosPorFecha
    Object.keys(horariosReservadosPorFecha).forEach(function(key) {
        var horarios = horariosReservadosPorFecha[key];
        mensaje += key + "\t\t";
        mensaje += horarios.join(", ") + "\t\t" + nombre + "\n";
    });


    // Guardar los datos actualizados en el almacenamiento local
    localStorage.setItem("datosReservas", JSON.stringify(horariosReservadosPorFecha));

    alert("¡Reserva realizada con éxito! Nombre: " + nombre + ", Teléfono: " + telefono + ", Fecha: " + fechaSeleccionada.toLocaleDateString('es-ES') + ", Horario: " + horarioSeleccionado);

    /* Limpiar el formulario y ocultarlo después de enviar */
    formularioReserva.reset();
    formularioReserva.style.display = "none";
    contenedorHorarios.style.display = "none";
    // Construir el mensaje con filas

        });
});


