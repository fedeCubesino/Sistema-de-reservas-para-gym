



    document.addEventListener("DOMContentLoaded", function() {
    const calendario = document.querySelector(".calendario");
    const mesActualElemento = document.querySelector(".mesActual");
    const contenedorHorarios = document.querySelector(".horarios-disponibles");
    const formularioReserva = document.getElementById("formularioReserva");
    let anoActual;
    let mesActual;
    let fechaSeleccionada;
    let horarioSeleccionado;
    const horariosReservadosPorFecha = {};  
    const reservas = {}; 

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

     /* Evento para seleccionar un horario */

    contenedorHorarios.addEventListener("click", function(event) {
        horarioSeleccionado = event.target.textContent;
        var horariosReservados = horariosReservadosPorFecha[fechaSeleccionada.toDateString()];
    if (horariosReservados && horariosReservados.includes(horarioSeleccionado)) {
        alert("¡Este horario ya está reservado!");
    } else {
        mostrarFormularioReserva();
    }

    });

     /* Mostrar las opciones de horarios */
    function mostrarHorariosDisponibles(fecha) {
        contenedorHorarios.innerHTML = "";   /* Limpia las opciones de horarios existentes */

         /* Obtener los horarios reservados para la fecha seleccionada */

        const horariosReservadosParaFecha = horariosReservadosPorFecha[fecha.toDateString()] || [];

         /* Horarios disponibles para el día seleccionado */

        const horariosDisponibles = ["09:00hs", "10:00hs", "11:00hs", "12:00hs", "13:00hs", "14:00hs", "15:00hs"];
        const eligeHorario = document.createElement("div");
        eligeHorario.textContent = "Elige un horario";
        eligeHorario.style.fontWeight = "bold";
        contenedorHorarios.appendChild(eligeHorario);


         /* Mostrar las opciones de horarios disponibles */
        
        
        horariosDisponibles.forEach(function(horario) {
            if (!horariosReservadosParaFecha.includes(horario)) { 
                const opcion = document.createElement("div");
                opcion.classList.add("horario");
                opcion.textContent = horario;
                opcion.style.lineHeight = "25px";
                contenedorHorarios.appendChild(opcion);
                
                opcion.addEventListener('click', function() {
                    const horarios = document.querySelectorAll('.horario');
                    horarios.forEach(function(item) {
                        item.classList.remove('clickeado');
                    });
                    
                    this.classList.add('clickeado');
                });
            }
        });
        
        
    }
    document.getElementById("horarios-click").addEventListener('click', function() {
        this.classList.toggle("clickeado");
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
        if (!horariosReservadosPorFecha[fechaSeleccionada.toDateString()]) {
            horariosReservadosPorFecha[fechaSeleccionada.toDateString()] = [];
        }
        horariosReservadosPorFecha[fechaSeleccionada.toDateString()].push(horarioSeleccionado);

         /* Guarda la reserva */
        const reserva = {
            nombre: nombre,
            telefono: telefono,
            fecha: fechaSeleccionada.toDateString(),
            horario: horarioSeleccionado
        };
        reservas[fechaSeleccionada.toDateString()] = reservas[fechaSeleccionada.toDateString()] || [];
        reservas[fechaSeleccionada.toDateString()].push(reserva);

        alert("¡Reserva realizada con éxito! Nombre: " + nombre + ", Teléfono: " + telefono + ", Fecha: " + fechaSeleccionada.toDateString() + ", Horario: " + horarioSeleccionado);

         /* Limpiar el formulario y ocultarlo después de enviar */
        formularioReserva.reset();
        formularioReserva.style.display = "none";
        contenedorHorarios.style.display = "none";

    });
});
