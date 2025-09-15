
    // قراءة كل الأصناف من LocalStorage
    const foods = JSON.parse(localStorage.getItem("foods")) || [];

    // فلترة الطواجن بس
    const tawagenFoods = foods.filter(food => food.category === "tawagen");

    const menu = document.getElementById("menu");

    if (tawagenFoods.length === 0) {
      menu.innerHTML = "<p style='text-align:center;color:#777'>لا توجد طواجن بعد</p>";
    } else {
      tawagenFoods.forEach(food => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${food.image}" alt="${food.name}">
          <h3>${food.name}</h3>
          <p>${food.description}</p>
          <div class="price">${food.price} ج.م</div>
        `;
        menu.appendChild(card);
      });
    }