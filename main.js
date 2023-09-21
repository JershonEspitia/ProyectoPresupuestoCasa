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
  });

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
      const id = document
        .querySelector('button[type="submit"]')
        .getAttribute("data-edit-id");

      const nuevoValor = document.getElementById("input-valor").value;
      const nuevoTipo = document.querySelector(
        'input[name="tipo"]:checked'
      ).value;

      const newData = {
        tipo: nuevoTipo,
        valor: nuevoValor,
      };

      let res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newData),
      });
    });

  // document
  //   .getElementById("searchButton")
  //   .addEventListener("click", async () => {
  //     const searchId = document.getElementById("searchInput").value.trim();

  //     let dataFound = await (
  //       await fetch("https://6509d046f6553137159c1074.mockapi.io/Data")
  //     ).json();
  //     console.log(dataFound);
  //     myTable.innerHTML = "";

  //     // data.forEach((element) => {
  //     //   let tr = document.createElement("TR");
  //     //   tr.insertAdjacentHTML(
  //     //     "afterbegin",
  //     //     ` 
  //     //       <td>${element.id}</td>
  //     //       <td>${element.tipo}</td>
  //     //       <td>${element.valor}</td>
  //     //       <td><button edit_id="${element.id}" type="button" class="btn btn-primary btn-editar">Editar</button> <button id="btn_delete" delete_id="${element.id}" type="button" class="btn btn-danger btn-eliminar">Eliminar</button></td>
  //     //     `
  //     //   );
  //     //   myTable.append(tr);
  //     // });
  //   });
});

// Evento que envia los datos ingresados a la API cuando se da en el boton
myForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  const { valor } = data;

  data.valor = typeof valor === "string" ? Number(valor) : null;

  let res = await fetch(`${API}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log(res);
  window.location.reload();
});