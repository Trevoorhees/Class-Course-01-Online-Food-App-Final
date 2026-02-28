const user = localStorage.getItem("user"); // Read the "user" value that login.js stored in localStorage

if (!user) {
  window.location.href = "login.html"; // If no user exists, redirect back to the login page
}

// DOM References - grab elements from dashboard.html
const userEmailEl = document.getElementById("userEmail"); // Element that displays the signed-in email

const cartCountEl = document.getElementById("cartCount"); // Element that displays the cart item count

const foodSelection = document.getElementById("foodSelection"); // Section where food cards will be rendered

const cartSelection = document.getElementById("cartSelection"); // Section where cart content will be shown

userEmailEl.textContent = user; // Put the logged-in email into the dashboard

// UI State
let cart = []; // Cart is stored in memory as an array of items.

const FOOD_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=c"; // URL for the food data

// Initial Page Setup
showFoodSelection(); // Show menu area and hide cart area by default

updateCartCount(); // Update the cart count display (starts at 0)

loadFoodItems(); // Fetch food items from the API and render them on the page

updateCart(); // Render the cart section (shows empty cart message initially)

// Navigation and View Functions
function logout() {
  localStorage.removeItem("user"); // Remove the stored user from localStorage
  window.location.href = "login.html"; // Redirect back to login page
}

function showFoodSelection() {
  foodSelection.style.display = "grid"; // Make the menu grid visible
  cartSelection.style.display = "none"; // Hide the cart section
}

function showCartSelection() {
  foodSelection.style.display = "none"; // Hide the menu grid
  cartSelection.style.display = "block"; // Show the cart section
  updateCart(); // Re-render cart UI so it is up-to-date
}

// Data Fetch
function loadFoodItems() {
  fetch(FOOD_URL) // Request data from the food data URL
    .then((response) => response.json()) // Convert HTTP response into JSON
    .then((data) => {
      displayFood(data?.meals || []); // data.meals is an array but fallback to [] if null
    })
    .catch((error) => {
      console.error("Error loading food items:", error); // Log the error to the console for debugging

      // Show an error message in the UI
      foodSelection.innerHTML = `
        <p class="text-red-600 font-semibold">
          Unable to load food items right now. Please try again later. 
        </p>
      `;
    });
}

// Food Display
function displayFood(meals) {
  // If meals isnt an array or its empty, show a message and stop
  if (!Array.isArray(meals) || meals.length === 0) {
    foodSelection.innerHTML = `
      <p class="text-gray-700 font-semibold">
        No food items available right now.
      </p>
    `;
    return;
  }

  let foodMarkup = ""; // Make it an HTML

  meals.forEach((meal) => {
    const price = Math.floor(Math.random() * 100) + 50; // Create a random number between 50 and 149

    const safeMealName = JSON.stringify(meal.strMeal); // Make meal name easy to embed

    // Append a food "card" to the markup string
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

  foodSelection.innerHTML = foodMarkup; // Inject the HTML into the menu section
}

function updateCartCount() {
  cartCountEl.textContent = `Cart Items: ${cart.length}`; // Show number of items in cart. Item types only, not item quantity.
}

// Cart Actions
function addToCart(mealId, mealName, price) {
  const existingItem = cart.find((item) => item.mealId === mealId); // Look for the same meal already in cart

  if (existingItem) {
    existingItem.quantity += 1; // If found, increase quantity
  } else {
    // If not found, add a new cart object
    cart.push({
      mealId,
      mealName,
      price,
      quantity: 1,
    });
  }

  updateCartCount(); // Update UI after change
  updateCart(); // Update UI after change
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity; // Add up price * quantity for all items
  }, 0);
}

function updateCart() {
  const cartItem = document.getElementById("cartItem"); // Find the container in the DOM where cart rows are rendered

  // If cart is empty, show empty message + total = 0, then stop
  if (cart.length === 0) {
    cartItem.innerHTML = `
      <p class="text-gray-600">Your cart is empty.</p>
      <div class="cart-row cart-total-row">
        <h3>Total Cost: $0.00</h3> 
      </div>
    `;
    return;
  }

  let cartMarkup = ""; // Build HTML for all cart rows

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity; // get itemTotal from price and quantity

    // Append cart row markup
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

  const cartTotal = getCartTotal(); // Calculate total cart cost

  // Add a final "Total Cost" row at the bottom
  cartMarkup += `
    <div class="cart-row cart-total-row">
      <h3>Total Cost: $${cartTotal.toFixed(2)}</h3> 
    </div>
  `;

  cartItem.innerHTML = cartMarkup; // Inject cart HTML into the page
}

function changeQuantity(mealId, change) {
  // Update quantities using map, then remove items that are 0 or negative
  cart = cart
    .map((item) => {
      if (item.mealId === mealId) {
        return { ...item, quantity: item.quantity + change }; // If this is the item then adjust quantity
      }
      return item; // Otherwise keep item unchanged
    })
    .filter((item) => item.quantity > 0); // Remove any items whose quantity is now 0 or negative

  updateCartCount(); // Update UI after change
  updateCart(); // Update UI after change
}

function checkOut() {
  if (cart.length === 0) {
    alert("Cart is empty. Please add items to cart before checkout."); // Prevent checkout if cart has nothing in it
    return false;
  }

  alert("Checkout successful! Thank you for your order."); // Confirm checkout success

  cart = []; //Clear cart
  updateCartCount(); // Reset UI
  updateCart(); // Reset UI
  showFoodSelection(); // Reset UI
}
