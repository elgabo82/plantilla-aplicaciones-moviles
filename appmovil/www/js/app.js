const $ = (id) => document.getElementById(id);

function setMsg(t) { $("msg").textContent = t || ""; }

function getApiBase() {
  return (localStorage.getItem("apiBase") || "http://localhost:3000").replace(/\/$/, "");
}
function apiUrl(path) {
  return `${getApiBase()}/api/v1/${path}`;
}

function resetForm() {
  $("bookId").value = "";
  $("title").value = "";
  $("author").value = "";
  $("year").value = "";
  $("isbn").value = "";
  $("formTitle").textContent = "Nuevo libro";
  $("btnCreate").disabled = false;
  $("btnUpdate").disabled = true;
  $("btnCancel").disabled = true;
}

async function loadBooks() {
  const res = await fetch(apiUrl("books"));
  const rows = await res.json();

  $("tbody").innerHTML = rows.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.year ?? ""}</td>
      <td>${b.isbn ?? ""}</td>
      <td class="actions">
        <button onclick="editBook(${b.id})">Editar</button>
        <button onclick="deleteBook(${b.id})">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

async function createBook() {
  setMsg("");
  const payload = {
    title: $("title").value.trim(),
    author: $("author").value.trim(),
    year: $("year").value ? Number($("year").value) : null,
    isbn: $("isbn").value.trim() || null
  };
  if (!payload.title || !payload.author) return setMsg("Título y autor son obligatorios.");

  const res = await fetch(apiUrl("books"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) return setMsg("Error al crear.");
  resetForm();
  await loadBooks();
}

async function editBook(id) {
  setMsg("");
  const res = await fetch(apiUrl(`books/${id}`));
  if (!res.ok) return setMsg("No encontrado.");

  const b = await res.json();
  $("bookId").value = b.id;
  $("title").value = b.title ?? "";
  $("author").value = b.author ?? "";
  $("year").value = b.year ?? "";
  $("isbn").value = b.isbn ?? "";

  $("formTitle").textContent = `Editando #${b.id}`;
  $("btnCreate").disabled = true;
  $("btnUpdate").disabled = false;
  $("btnCancel").disabled = false;
}

async function updateBook() {
  setMsg("");
  const id = $("bookId").value;
  if (!id) return;

  const payload = {
    title: $("title").value.trim(),
    author: $("author").value.trim(),
    year: $("year").value ? Number($("year").value) : null,
    isbn: $("isbn").value.trim() || null
  };

  const res = await fetch(apiUrl(`books/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) return setMsg("Error al actualizar.");
  resetForm();
  await loadBooks();
}

async function deleteBook(id) {
  if (!confirm("¿Eliminar libro?")) return;
  const res = await fetch(apiUrl(`books/${id}`), { method: "DELETE" });
  if (!res.ok) return setMsg("Error al eliminar.");
  await loadBooks();
}

window.editBook = editBook;
window.deleteBook = deleteBook;

window.addEventListener("DOMContentLoaded", async () => {
  $("apiBase").value = getApiBase();

  $("btnSaveApi").addEventListener("click", () => {
    localStorage.setItem("apiBase", $("apiBase").value.trim());
    setMsg("API Base guardada.");
  });

  $("btnCreate").addEventListener("click", () => createBook());
  $("btnUpdate").addEventListener("click", () => updateBook());
  $("btnCancel").addEventListener("click", () => resetForm());

  resetForm();
  await loadBooks();
});
