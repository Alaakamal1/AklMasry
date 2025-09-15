// حماية لوحة التحكم
if(localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

let foods = JSON.parse(localStorage.getItem("foods")) || [];
const form = document.getElementById("foodForm");
const menu = document.getElementById("menu");
const imageInput = document.getElementById("image");
const filterCategory = document.getElementById("filterCategory");
let editingIndex = null;

function renderMenu(filter = "all") {
  menu.innerHTML = "";
  foods
    .filter(food => filter === "all" ? true : food.category === filter)
    .forEach((food, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${food.image}" alt="${food.name}">
        <h3>${food.name}</h3>
        <p>${food.description}</p>
        <div class="price">${food.price} ج.م</div>
        <div class="actions">
          <button onclick="editFood(${index})">✏️ تعديل</button>
          <button class="delete" onclick="deleteFood(${index})">🗑️ حذف</button>
        </div>
      `;
      menu.appendChild(card);
    });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const file = imageInput.files[0];

  const readerCallback = (imageData) => {
    if(editingIndex !== null) {
      foods[editingIndex] = { name, description, price, category, image: imageData || foods[editingIndex].image };
      editingIndex = null;
    } else {
      foods.push({ name, description, price, category, image: imageData || "" });
    }
    localStorage.setItem("foods", JSON.stringify(foods));
    renderMenu(filterCategory.value);
    form.reset();
  };

  if(file) {
    const reader = new FileReader();
    reader.onload = function(event) { readerCallback(event.target.result); };
    reader.readAsDataURL(file);
  } else { readerCallback(null); }
});

function deleteFood(index) {
  foods.splice(index, 1);
  localStorage.setItem("foods", JSON.stringify(foods));
  renderMenu(filterCategory.value);
}

function editFood(index) {
  const food = foods[index];
  document.getElementById("name").value = food.name;
  document.getElementById("description").value = food.description;
  document.getElementById("price").value = food.price;
  document.getElementById("category").value = food.category;
  editingIndex = index;
}

filterCategory.addEventListener("change", () => { renderMenu(filterCategory.value); });
renderMenu();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});
