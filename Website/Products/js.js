let select = document.getElementById("categories_select");
let search_input = document.getElementById("search_input");
let products_container = document.getElementById("products_container");
let message = document.getElementById("message");
let modal_overlay = document.getElementById("modal_overlay");

let products = [];
let categories = [];

let storeid = JSON.parse(localStorage.getItem("storeid")) || [];
let y = storeid.length; 

updateCartBadge();

async function getProducts() {
    try {
        message.innerHTML = `<h1>loading...</h1>`;
        
        let response = await fetch("https://dummyjson.com/products");
        let data = await response.json();
        products = data.products;

        displayCards(products);
        getCategories(products);

        message.innerHTML = "";
    } catch (error) {
        console.warn(error);
        message.innerHTML = `<h1>There is currently a problem with the site, please try again later.</h1>`;
    }
}
getProducts();

function displayCards(items) {
    products_container.innerHTML = "";

    for (let x = 0; x < items.length; x++) {
        products_container.innerHTML += `
            <article class="card">
                <img class="product-image" src="${items[x].images[0]}" alt="Product Image">
                <h2 class="title">${items[x].title}</h2>
                <hr>
                <h4 class="category">Category: ${items[x].category}</h4>
                <h4>Rating :⭐ ${items[x].rating}</h4>
                
                <div style="display: flex; justify-content: space-between; padding: 15px; gap: 10px; margin-top: 10px;">
                    <p class="price">$${items[x].price}</p>
                    <a href="#" class="view" data-id="${items[x].id}">View Details →</a>
                </div>

                <button class="add-btn" data-id="${items[x].id}">Add product</button>
            </article>
        `;
    }

    products_container.classList.remove("one", "two");

    if (items.length === 1) {
        products_container.classList.add("one");
    } else if (items.length === 2) {
        products_container.classList.add("two");
    } else if (items.length === 0) {
        noproductsMessage();
    } else {
        message.innerHTML = "";
    }
}

products_container.addEventListener("click", function (e) {
    
    if (e.target.classList.contains("view")) {
        e.preventDefault();
        let id = Number(e.target.dataset.id);
        let product = products.find(prod => prod.id === id);
        if (product) openModal(product);
    }

    if (e.target.classList.contains("add-btn")) {
        let id = Number(e.target.dataset.id);
        let product = products.find(prod => prod.id === id);

        addToCart(id);
    }
});

function addToCart(productId) {
    storeid = JSON.parse(localStorage.getItem("storeid")) || [];

    storeid.push(productId);
    
    localStorage.setItem("storeid", JSON.stringify(storeid));
    
    updateCartBadge();

    const cartIframe = document.getElementById("cart_iframe");

    if (cartIframe && cartIframe.contentWindow) {
        cartIframe.contentWindow.postMessage(
            { type: "cartUpdated" },
            "*"
        );
    }
}

function updateCartBadge() {
    let cartBadge = document.getElementById("cart-badge");
    if (cartBadge) {
        const currentStore = JSON.parse(
            localStorage.getItem("storeid")
        ) || [];

        cartBadge.textContent = currentStore.length;
    }
}


function displayCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        select.innerHTML += `
            <option value="${categories[i]}">
                ${categories[i].charAt(0).toUpperCase() + categories[i].slice(1)}
            </option>
        `;
    }
}

function getCategories(products) {
    for (let i = 0; i < products.length; i++) {
        if (!categories.includes(products[i].category)) {
            categories.push(products[i].category);
        }
    }
    displayCategories(categories);
}

let selectedCategory = "all";
select.addEventListener("change", function () {
    selectedCategory = select.value;
    filterProducts();
});

search_input.addEventListener("input", function () {
    filterProducts();
});

function filterProducts() {
    let filtered = products;

    if (selectedCategory !== "all") {
        filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (search_input.value.trim() !== "") {
        filtered = filtered.filter(product =>
            product.title.toLowerCase().includes(search_input.value.toLowerCase())
        );
    }

    displayCards(filtered);
}

function noproductsMessage() {
    message.innerHTML = `<h1>No products found.</h1>`;
}

let cancel_btn = document.getElementById("close_btn");
if (cancel_btn) {
    cancel_btn.addEventListener("click", () => modal_overlay.style.display = "none");
}

let close_modal = document.getElementById("close_modal");
if (close_modal) {
    close_modal.addEventListener("click", () => modal_overlay.style.display = "none");
}

function openModal(product) {
    modal_overlay.style.display = "flex";
    document.getElementById("modal_image").src = product.images[0];
    document.getElementById("modal_title").textContent = product.title;
    document.getElementById("modal_description").textContent = product.description;
    document.getElementById("modal_category").textContent = product.category;
    document.getElementById("modal_brand").textContent = product.brand;
    document.getElementById("modal_price").textContent = `$${product.price}`;
    document.getElementById("modal_rating").textContent = `⭐ ${product.rating}`;
    document.getElementById("modal_stock").textContent = product.stock;
    document.getElementById("modal_sku").textContent = product.sku;
}