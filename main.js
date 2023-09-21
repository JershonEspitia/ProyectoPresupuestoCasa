/* 
  https://6509d046f6553137159c1074.mockapi.io/:endpoint
  GET = /Data
  GET = /Data/:id
  POST = /Data
  PUT = /Data/:id
  DELETE = /Data/:id
*/

// Variables globales que pueden ser usadas en todo el documento
const myForm = document.querySelector("#main-form");
const myTable = document.querySelector("#main-data");
const API = "https://6509d046f6553137159c1074.mockapi.io/Data";

// Evento principal que carga el DOM y crea la tabla con sus registros, botones y sus eventos
addEventListener("DOMContentLoaded", async () => {
  let data = await (
    await fetch("https://6509d046f6553137159c1074.mockapi.io/Data")
  ).json();

  let totalIngresos = 0;
  let totalEgresos = 0;

  data.forEach((element) => {
    let tr = document.createElement("TR");
    tr.insertAdjacentHTML(
      "afterbegin",
      ` 
        <td>${element.id}</td>
        <td>${element.tipo}</td>
        <td>${element.valor}</td>
        <td><button edit_id="${element.id}" type="button" class="btn btn-primary btn-editar">Editar</button> <button id="btn_delete" delete_id="${element.id}" type="button" class="btn btn-danger btn-eliminar">Eliminar</button></td>
      `
    );
    myTable.append(tr);

    if (element.tipo === "Ingreso") {
      totalIngresos = totalIngresos + element.valor;
    } else {
      totalEgresos = totalEgresos + element.valor;
    }

  });

  console.log(totalEgresos, totalIngresos);
  // MOSTRAR INFORMACION DE BALANCE
  const myTableBalance = document.querySelector("#table-balance");
  let tr2 = document.createElement("TR");
  tr2.insertAdjacentHTML(
    "afterbegin",
    ` 
      <td>${totalIngresos}</td>
      <td>${totalEgresos}</td>
      <td>${totalIngresos - totalEgresos}</td>
    `
  );
  myTableBalance.append(tr2);
  

  // ELIMINAR
  // Variable que almacena todos los botones que tengan la clase .btn-eliminar del documento
  const btn_delete = document.querySelectorAll(".btn-eliminar");
  // Ciclo que le asigna el evento de escucha a todos los botones de la constante btn_delete
  btn_delete.forEach((element) => {
    element.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("delete_id");
      let res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      window.location.reload();
    });
  });

  // EDITAR
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

      // Se cambia el valor del boton del formulario y el color
      const submitBoton = document.querySelector('button[type="submit"]');
      submitBoton.textContent = "Actualizar";
      submitBoton.classList.add("btn-success");
      submitBoton.setAttribute("data-edit-id", id);
    });
  });

  document
    .querySelector('button[type="submit"]')
    .addEventListener("click", async () => {

      const nuevoValor = document.getElementById("input-valor").value;
      const nuevoTipo = document.querySelector(
        'input[name="tipo"]:checked'
      ).value;
    });


  // BUSCAR
  document
  .getElementById("searchButton")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const searchId = document.getElementById("searchInput").value.trim();

    // Realizar la solicitud a la API con el valor de búsqueda
    let dataFound = await (
      await fetch(`${API}/${searchId}`)
    ).json();

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

  // LIMPIAR
  document.getElementById("clearButton").addEventListener("click", async()=>{
    window.location.reload();
  });

});

// REGISTRAR
// Evento que envia los datos ingresados a la API cuando se da en el boton
myForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  const { valor } = data;

  data.valor = typeof valor === "string" ? Number(valor) : null;

  const id = document
        .querySelector('button[type="submit"]')
        .getAttribute("data-edit-id");

  if (document.getElementById("btn-submit").textContent === "Registrar") {
    let res = await fetch(`${API}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  } else {
    let res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  }
  window.location.reload();
});
