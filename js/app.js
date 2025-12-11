
// Catégories
let categories = [
  { id: 1, name: "Bracelets" },
  { id: 2, name: "Bagues" },
  { id: 3, name: "Colliers" }
];

// Produits
let products = [
  { id: 1, name: "Swarovski", description: "Bracelet-jonc Mesmera", price: 159.99, categoryId: 1, quantity: 10 },
  { id: 2, name: "Histoire d'Or", description: "Bague Solitaire Mireilla ", price: 39.99, categoryId: 2, quantity: 3 },
  { id: 3, name: "APM Monaco", description: "yacht club", price: 295.00, categoryId: 3, quantity: 7 }
];


// === Remplir le filtre  ===
function populateCategories() {
  const select = document.getElementById("filterCategory");
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}


// === Affichage des produits ===
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

  // Tri
  if (sortBy !== "none") {
    const [field, direction] = sortBy.split("-");
    list.sort((a, b) => {
      if (field === "name") {
        return direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
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
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;
}


populateCategories();
displayProducts();

document.getElementById("filterCategory").addEventListener("change", displayProducts);
document.getElementById("lowStockOnly").addEventListener("change", displayProducts);
document.getElementById("sortBy").addEventListener("change", displayProducts);

