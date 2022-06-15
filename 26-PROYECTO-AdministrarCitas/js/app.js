//Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
       this.citas = [...this.citas, cita];

       console.log(this.citas);
    }
    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id)
    }
    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );

    }
}

class UI {
    
    imprimirAlerta(mensaje, tipo) {
        //crear el div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase en base al tipo de error 
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        }else {
            divMensaje.classList.add('alert-success');
        }

        //mensje de error
        divMensaje.textContent = mensaje;

        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //quitar la alerta despues de 5 seg
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }
    imprimirCitas({citas}) {

        this.limpiarHtml();

        citas.forEach( cita => {
                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;

                //scripting de los elementos de la cita
                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                mascotaParrafo.textContent = mascota;

                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML = `
                  <span class="font-weigth-bolder">Propietario: </span> ${propietario}
                `;

                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML = `
                  <span class="font-weigth-bolder">Telèfono: </span> ${telefono}
                `;
                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `
                  <span class="font-weigth-bolder">Fecha: </span> ${fecha}
                `;
                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `
                  <span class="font-weigth-bolder">Hora: </span> ${hora}
                `;
                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML = `
                  <span class="font-weigth-bolder">Sintomas: </span> ${sintomas}
                `;

                //boton para eliminar esta cita

                const btnEliminar = document.createElement('button');
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' ;
                btnEliminar.onclick = () => eliminarCita(id);

                //anade un boton para editar
                const btnEditar = document.createElement('button');
                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
                btnEditar.onclick = () => cargarEdicion(cita);

                //agregar los parrafos al div cita
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);


                //agregar la cita al HTML
                contenedorCitas.appendChild(divCita);

        });

    }

    limpiarHtml() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

//Registrar objetos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);

}

//objetos con la informacion de cita
const citaObj = {
    mascota:  '',
    propietario:  '',
    telefono: '',
    fecha: '',
    hora:  '',
    sintomas:  ''
}

//Agregaal objet datos o de cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;

}//valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    //Extraer la informacion del objeto de citas
    const { mascota, propietario, telefono, fecha, hora, sintomas, } = citaObj;

    //validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }
    if(editando) {
        ui.imprimirAlerta('Editado correctamente');

        //pasar el objeto de la cita a edicion
        administrarCitas.editarCita({...citaObj});

        //regresar el texto del boton a su estado original

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        //quitar modo edicion
        editando = false;

    }else {
         //Generar un id unico
    citaObj.id = Date.now();

    //Crear una nueva cita
    administrarCitas.agregarCita({...citaObj});

    //Mensaje de agregado correctamente
    ui.imprimirAlerta('Se agrego correctamente');
    }

    
  
    //reinisiar objeto para la val;oracion
    reiniciarObjeto();


    //reinicia el formulario
    formulario.reset();

    //mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);

}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';

}
function eliminarCita (id) {
    //Eliminar la cita
    administrarCitas.eliminarCita(id);

    //muestra un mensaje
    ui.imprimirAlerta('La cita se elimino correctamente',);
    
    //refrescar la cita
    ui.imprimirCitas(administrarCitas);

}

//cargar los datos y el modo edicion

function cargarEdicion (cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //llenar los inpjuts
   mascotaInput.value = mascota;
   propietarioInput.value = propietario;
   telefonoInput.value = telefono;
   fechaInput.value = fecha;
   horaInput.value = hora;
   sintomasInput.value = sintomas;

   //llenar el objeto
   citaObj.mascota = mascota;
   citaObj.propietario = propietario;
   citaObj.telefono = telefono;
   citaObj.fecha = fecha;
   citaObj.hora = hora;
   citaObj.sintomas = sintomas;
   citaObj.id = id;


   //cambiar texto de boton
   formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

   editando = true;
}