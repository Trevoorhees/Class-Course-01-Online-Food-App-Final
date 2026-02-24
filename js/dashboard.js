const user = localStorage.getItem("user");

if (!user) {
  window.location.href = "login.html";
}

// DOM References
const userEmailEl = document.getElementById("userEmail");
const cartCountEl = document.getElementById("cartCount");
const foodSelection = document.getElementById("foodSelection");
const cartSelection = document.getElementById("cartSelection");

userEmailEl.textContent = user;

// UI State
let cart = [];
const FOOD_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=c";

// Initial Page Setup
showFoodSelection(); 
updateCartCount(); 
loadFoodItems(); 
updateCart();

// Navigation / View Functions
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function showFoodSelection() {
  foodSelection.style.display = "grid";
  cartSelection.style.display = "none";
}

function showCartSelection() {
  foodSelection.style.display = "none";
  cartSelection.style.display = "block";
  updateCart();
}

// Data Fetch (AJAX / Fetch API)
function loadFoodItems() {
  fetch(FOOD_URL)
    .then((response) => response.json())
    .then((data) => {
      displayFood(data?.meals || []);
    })
    .catch((error) => {
      console.error("Error loading food items:", error);

      foodSelection.innerHTML = `
        <p class="text-red-600 font-semibold">
          Unable to load food items right now. Please try again later.
        </p>
      `;
    });
}

// Food Display
function displayFood(meals) {
  if (!Array.isArray(meals) || meals.length === 0) {
    foodSelection.innerHTML = `
      <p class="text-gray-700 font-semibold">
        No food items available right now.
      </p>
    `;
    return;
  }

  let foodMarkup = "";

  meals.forEach((meal) => {
    const price = Math.floor(Math.random() * 100) + 50; // 50 to 149
    const safeMealName = JSON.stringify(meal.strMeal);

    foodMarkup += `
      <div class="bg-white p-4 rounded-lg shadow-md">
        <img
          src="${meal.strMealThumb}"
          alt="${meal.strMeal}"
          width="200"
          height="200"
          class="h-20 w-full object-cover rounded-lg"
        />
        <h3 class="text-lg font-semibold">${meal.strMeal}</h3>
        <p class="text-gray-800 text-sm">Price: $${price}</p>

        <input
          type="button"
          value="Add To Cart"
          onclick='addToCart(${meal.idMeal}, ${safeMealName}, ${price})'
          class="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
        />
      </div>
    `;
  });

  foodSelection.innerHTML = foodMarkup;
}

function updateCartCount() {
  cartCountEl.textContent = `Cart Items: ${cart.length}`;
}

// Cart Actions
function addToCart(mealId, mealName, price) {
  const existingItem = cart.find((item) => item.mealId === mealId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      mealId,
      mealName,
      price,
      quantity: 1,
    });
  }

  updateCartCount();
  updateCart();
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

function updateCart() {
  const cartItem = document.getElementById("cartItem");

  if (cart.length === 0) {
    cartItem.innerHTML = `
      <p class="text-gray-600">Your cart is empty.</p>
      <div class="cart-row cart-total-row">
        <h3>Total Cost: $0.00</h3> 
      </div>
    `;
    return;
  }

  let cartMarkup = "";

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;

    cartMarkup += `
      <div class="cart-row">
        <h3>${item.mealName}</h3>
        <p>Price: $${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <p><strong>Item Total: $${itemTotal.toFixed(2)}</strong></p>

        <div class="cart-buttons">
          <input type="button" value="+" onclick="changeQuantity(${item.mealId}, 1)" />
          <input type="button" value="-" onclick="changeQuantity(${item.mealId}, -1)" />
        </div>
      </div>
    `;
  });

  const cartTotal = getCartTotal(); 

  cartMarkup += `
    <div class="cart-row cart-total-row">
      <h3>Total Cost: $${cartTotal.toFixed(2)}</h3> 
    </div>
  `;

  cartItem.innerHTML = cartMarkup;
}

function changeQuantity(mealId, change) {
  cart = cart
    .map((item) => {
      if (item.mealId === mealId) {
        return { ...item, quantity: item.quantity + change };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  updateCartCount();
  updateCart();
}

function checkOut() {
  if (cart.length === 0) {
    alert("Cart is empty. Please add items to cart before checkout.");
    return false;
  }

  alert("Checkout successful! Thank you for your order.");

  cart = [];
  updateCartCount();
  updateCart();
  showFoodSelection();
}
