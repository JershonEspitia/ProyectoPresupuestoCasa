/* 
  https://6509d046f6553137159c1074.mockapi.io/:endpoint
  GET = /Data
  GET = /Data/:id
  POST = /Data
  PUT = /Data/:id
  DELETE = /Data/:id
*/

// -----------------------------------------------------------------------------------------------------------

// Variables globales que pueden ser usadas en todo el documento
const API_URL = "http://127.0.0.1:5010/Data";
const myForm = document.querySelector("#main-form");
const myTable = document.querySelector("#main-data");
const myTableBalance = document.querySelector("#table-balance");

// Evento principal que carga el DOM y crea la tabla con sus registros, botones y sus eventos
addEventListener("DOMContentLoaded", async () => {
  // Obtener datos de la API_URL y convertirlos a json (cada await lo que hace es esperar a la accion para poder continuar)
  const data = await (await fetch(API_URL)).json();
  // Variables que almacenaran los totales
  let totalIngresos = 0;
  let totalEgresos = 0;

  // ForEach que recorre cada registro que encuentre en la constante data
  data.forEach((element) => {
    // Variable que crea un elemento "tr" en el documento para luego agregarlo a la tabla
    let tr = document.createElement("TR");
    // Con el insertAdjacentHTML le agregamos contenido HTML a la fila creada anteriormente. Recibe 2 parametros, ("1","2")
    // el 1 es la posicion donde se ubicara, y el 2 es el contenido en forma de etiquetas.
    // afterbegin -> despues del primer hijo ------- los valores que tiene el elemento, ademas se agregan 2 botones (editar, eliminar)
    tr.insertAdjacentHTML(
      "afterbegin",
      ` 
        <td>${element.id}</td>
        <td>${element.tipo}</td>
        <td>${element.valor}</td>
        <td><button edit_id="${element.id}" type="button" class="btn btn-primary btn-editar">Editar</button> <button id="btn_delete" delete_id="${element.id}" type="button" class="btn btn-danger btn-eliminar">Eliminar</button></td>
      `
    );
    // se agrega a la tabla principal el tr creado con su contenido
    myTable.append(tr);

    // Ternario que compara el tipo, en caso de ser Ingreso suma al total de ingreso, sino suma a egreso
    element.tipo === "Ingreso"
      ? (totalIngresos = totalIngresos + element.valor)
      : (totalEgresos = totalEgresos + element.valor);
  });

  // MOSTRAR INFORMACION DE BALANCE
  // Variable que crea un elemento "tr" en el documento para luego agregarlo a la tabla
  let tr2 = document.createElement("TR");
  // Con el insertAdjacentHTML le agregamos contenido HTML a la fila creada anteriormente. Recibe 2 parametros, ("1","2")
  // el 1 es la posicion donde se ubicara, y el 2 es el contenido en forma de etiquetas.
  // afterbegin -> despues del primer hijo ------- los valores que tienen las variables totalIngresos y totalEgresos
  tr2.insertAdjacentHTML(
    "afterbegin",
    ` 
      <td>${totalIngresos}</td>
      <td>${totalEgresos}</td>
      <td>${totalIngresos - totalEgresos}</td>
    `
  );
  // se agrega a la tabla balance el tr creado con su contenido
  myTableBalance.append(tr2);

  // ********** ELIMINAR **********
  // Variable que almacena todos los botones que tengan la clase .btn-eliminar del documento
  const btn_delete = document.querySelectorAll(".btn-eliminar");
  // Ciclo que le asigna el evento de escucha a todos los botones de la constante btn_delete
  btn_delete.forEach((element) => {
    element.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("delete_id");
      let res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      window.location.reload();
    });
  });

  // ********** EDITAR **********
  // Variable que almacena todos los botones que tengan la clase .btn-editar del documento
  const btn_edit = document.querySelectorAll(".btn-editar");
  // Ciclo que le asigna el evento de escucha a todos los botones de la constante btn_edit
  btn_edit.forEach((element) => {
    element.addEventListener("click", async (e) => {
      // Se selecciona el padre que cumpla la condicion
      const row = element.closest("tr");
      // Se toman los valores correspondientes a cada indice
      const id = row.querySelector("td:nth-child(1)").textContent;
      const tipo = row.querySelector("td:nth-child(2)").textContent;
      const valor = row.querySelector("td:nth-child(3)").textContent;

      // Se insertan los valores que se tomaron anteriormente en los campos del formulario
      document.getElementById("input-valor").value = valor;
      document.querySelector(`input[value="${tipo}"]`).checked = true;

      // Se cambia el valor del boton del formulario y el color, ademas se le agrega un data-edit-id para el momento de actualizar con el boton
      const submitBoton = document.querySelector('button[type="submit"]');
      submitBoton.textContent = "Actualizar";
      submitBoton.classList.add("btn-success");
      submitBoton.setAttribute("data-edit-id", id);
    });
  });

  // ********** BUSCAR **********
  // Se agrega un evento de escucha al boton de buscar
  document
    .getElementById("searchButton")
    .addEventListener("click", async (e) => {
      // Evita que se realice la accion del boton submit
      e.preventDefault();

      // Variable que guarda el valor del input digitado en search y elimina sus espacios (si tiene) con trim
      const searchId = document.getElementById("searchInput").value.trim();

      // Realizar la solicitud a la API_URL con el valor de búsqueda
      let dataFound = await (await fetch(`${API_URL}/${searchId}`)).json();

      // Limpiar la tabla eliminando todo su contenido
      myTable.innerHTML = "";

      if (dataFound.id) {
        // Si se encuentra un registro con el ID especificado, crear una fila en la tabla
        let tr = document.createElement("TR");
        tr.insertAdjacentHTML(
          "afterbegin",
          `
          <td>${dataFound.id}</td>
          <td>${dataFound.tipo}</td>
          <td>${dataFound.valor}</td>
          <td><button edit_id="${dataFound.id}" type="button" class="btn btn-primary btn-editar">Editar</button> <button id="btn_delete" delete_id="${dataFound.id}" type="button" class="btn btn-danger btn-eliminar">Eliminar</button></td>
        `
        );
        myTable.append(tr);
      } else {
        // Si no se encuentra ningún registro, mostrar un mensaje de no encontrado 
        // el colspan significa que el mensaje ocupara las 4 columnas (como si se unieran)
        let tr = document.createElement("TR");
        tr.insertAdjacentHTML(
          "afterbegin",
          `
          <td colspan="4">No se encontraron resultados</td>
        `
        );
        myTable.append(tr);
      }
    });

  // ********** LIMPIAR **********
  // Le agrega el evento de recargar la pagina para cargar nuevamente la tabla
  document.getElementById("clearButton").addEventListener("click", async () => {
    window.location.reload();
  });
});

// ********** REGISTRAR **********
// Evento que envia los datos ingresados a la API_URL cuando se da en el boton de registrar
myForm.addEventListener("submit", async (e) => {
  // Evita que se realice la accion del boton submit
  e.preventDefault();

  // Toma los datos del formulario y los convierte en un objeto JavaScript
  const data = Object.fromEntries(new FormData(e.target));
  // Se desestructura el objeto data para tomar la propiedad valor
  const { valor } = data;

  // convierte en tipo numero el valor
  data.valor = typeof valor === "string" ? Number(valor) : null;

  // Se obtiene el atributo data-edit-id en caso de que el boton sea actualizar
  // para de esa forma enviar la informacion a la nueva direccion
  const id = document
    .querySelector('button[type="submit"]')
    .getAttribute("data-edit-id");

  // Ternario que compara el texto que tiene el boton, para de esa forma evaluar
  // si debe utilizar metodo POST para registrar o PUT para actualizar
  document.getElementById("btn-submit").textContent === "Registrar"
    // Configuracion para registro
    ? await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      })
    // Configuracion para actualizar
    : await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
  
  // Recarga la pagina para visualizar los cambios
  window.location.reload();
});
