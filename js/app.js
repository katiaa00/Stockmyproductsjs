let categories = [
  { id: 1, name: "Bracelets" },
  { id: 2, name: "Bagues" },
  { id: 3, name: "Colliers" }
];

let products = [
  { id: 1, name: "Swarovski", description: "Bracelet-jonc Mesmera", price: 159.99, categoryId: 1, quantity: 10 },
  { id: 2, name: "Histoire d'Or", description: "Bague Solitaire Mireilla ", price: 39.99, categoryId: 2, quantity: 3 },
  { id: 3, name: "APM Monaco", description: "yacht club", price: 295.00, categoryId: 3, quantity: 7 }
];

let stockMovements = [];

let nextProductId = products.length > 0 ? products[products.length - 1].id + 1 : 1;


// Remplir n'importe quel <select> de catégories
function populateCategories(selectId) {
  const select = document.getElementById(selectId);

  // Si c’est le filtre, ajouter “Toutes”
  select.innerHTML = selectId === "filterCategory"
    ? '<option value="all">Toutes</option>'
    : '';

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}


// Ajouter un produit
function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("productName").value;
  const description = document.getElementById("productDescription").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const categoryId = parseInt(document.getElementById("productCategory").value);
  const quantity = parseInt(document.getElementById("productQuantity").value);

  const newProduct = {
    id: nextProductId++,
    name,
    description,
    price,
    categoryId,
    quantity
  };

  products.push(newProduct);

  displayProducts();
  document.getElementById("addProductForm").reset();
  alert(`Le produit "${name}" a été ajouté !`);
}


// SUPPRIMER un produit
function deleteProduct(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
    products = products.filter(p => p.id !== id);
    displayProducts();
  }
}


// Ouvrir le formulaire de modification
function handleEdit(id) {
  const product = products.find(p => p.id === id);

  document.getElementById("editProductId").value = product.id;
  document.getElementById("editProductName").value = product.name;
  document.getElementById("editProductDescription").value = product.description;
  document.getElementById("editProductPrice").value = product.price;
  document.getElementById("editProductQuantity").value = product.quantity;
  document.getElementById("editProductCategory").value = product.categoryId;

  document.getElementById("editProductForm").style.display = "block";
}


// Enregistrer les modifications
document.getElementById("editProductForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("editProductId").value);
  const product = products.find(p => p.id === id);

  product.name = document.getElementById("editProductName").value;
  product.description = document.getElementById("editProductDescription").value;
  product.price = parseFloat(document.getElementById("editProductPrice").value);
  product.quantity = parseInt(document.getElementById("editProductQuantity").value);
  product.categoryId = parseInt(document.getElementById("editProductCategory").value);

  displayProducts();

  document.getElementById("editProductForm").reset();
  document.getElementById("editProductForm").style.display = "none";

  alert("Produit modifié avec succès !");
});


// Annuler modification
function cancelEdit() {
  document.getElementById("editProductForm").reset();
  document.getElementById("editProductForm").style.display = "none";
}


// AFFICHAGE PRODUITS
function displayProducts() {
  const container = document.getElementById("productsList");

  const filterCat = document.getElementById("filterCategory").value;
  const lowStockOnly = document.getElementById("lowStockOnly").checked;
  const sortBy = document.getElementById("sortBy").value;

  let list = [...products];

  if (filterCat !== "all") {
    list = list.filter(p => String(p.categoryId) === filterCat);
  }

  if (lowStockOnly) {
    list = list.filter(p => p.quantity < 5);
  }

  if (sortBy !== "none") {
    const [field, direction] = sortBy.split("-");
    list.sort((a, b) => {
      if (field === "name") {
        return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (field === "price") {
        return direction === "asc" ? a.price - b.price : b.price - a.price;
      }
      if (field === "quantity") {
        return direction === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity;
      }
    });
  }

  let html = "<table>";
  html += `
    <tr>
      <th>Nom</th>
      <th>Catégorie</th>
      <th>Quantité</th>
      <th>Prix</th>
      <th>Actions</th>
    </tr>
  `;

  list.forEach(p => {
    const catName = categories.find(c => c.id === p.categoryId)?.name || "—";
    const low = p.quantity < 5 ? "low-stock" : "";

    html += `
      <tr>
        <td>${p.name}</td>
        <td>${catName}</td>
        <td class="${low}">${p.quantity}</td>
        <td>${p.price.toFixed(2)} €</td>
        <td>
          <button onclick="handleEdit(${p.id})">Modifier</button>
          <button onclick="deleteProduct(${p.id})">Supprimer</button>
        </td>
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;
}


// INITIALISATION
populateCategories("filterCategory");
populateCategories("productCategory");
populateCategories("editProductCategory");

displayProducts();

document.getElementById("filterCategory").addEventListener("change", displayProducts);
document.getElementById("lowStockOnly").addEventListener("change", displayProducts);
document.getElementById("sortBy").addEventListener("change", displayProducts);
document.getElementById("addProductForm").addEventListener("submit", addProduct);
