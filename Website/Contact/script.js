let storeid = JSON.parse(localStorage.getItem("storeid")) || [];
let y = storeid.length;
let cartBadge = document.getElementById("cart-badge");

function updateCartBadge() {
    if (cartBadge) {
        cartBadge.textContent = y;
    }
}

updateCartBadge();
