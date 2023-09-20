/* 
  https://6509d046f6553137159c1074.mockapi.io/:endpoint
  GET = /Data
  GET = /Data/:id
  POST = /Data
  PUT = /Data/:id
  DELETE = /Data/:id
*/

const myForm = document.querySelector("#main-form");
const myTable = document.querySelector("#main-data");
const API = "https://6509d046f6553137159c1074.mockapi.io/Data";

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
            <td><button id="btn_edit" edit_id="${element.id}" type="button" class="btn btn-primary">Editar</button> <button id="btn_delete" delete_id="${element.id}" type="button" class="btn btn-danger">Eliminar</button></td>
          `
    );
    myTable.append(tr);
  });

  const btn_delete = document.querySelectorAll("#btn_delete");
  btn_delete.forEach((element) => {
    element.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("delete_id");
      let res = await fetch(
        `${API}/${id}`,
        {
          method: "DELETE",
        }
      );
      window.location.reload();
    });
  });

  const btn_edit = document.querySelectorAll("#btn_edit");
  btn_edit.forEach((element) => {
    element.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("edit_id");
      let res = await (await fetch(
        `${API}/${id}`,
        {
          method: "GET"
        }
      )).json();
    //   const valor = res.valor;
      console.log(res);
    });
  });

});

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