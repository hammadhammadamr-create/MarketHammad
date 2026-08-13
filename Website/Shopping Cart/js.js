let select = document.getElementById("categories_select");
let search_input = document.getElementById("search_input");
let products_container = document.getElementById("products_container");
let message = document.getElementById("message");

let storeid = JSON.parse(localStorage.getItem("storeid")) || [];
console.log(storeid);


let products = [];
async function getProducts(){
    try{
        message.innerHTML="";
        message.innerHTML += `
            <h1>loading</h1>
        `;
        let response = await fetch("https://dummyjson.com/products");
        let data = await response.json();
        products = data.products;
        
        displayCards (products);
        getCategories(products);
        
    }

    catch(error){
        console.warn(error);
        message.innerHTML="";
        message.innerHTML += `
            <h1>There is currently a problem with the site, please try again later.</h1>
        `;
    }
}
getProducts();

let categories = [];

function displayCategories(categories){
    for (let i = 0; i < categories.length; i++) {
        select.innerHTML += `
            <option value="${categories[i]}">
                ${categories[i].charAt(0).toUpperCase() + categories[i].slice(1)}
            </option>
        `;
    }
}

function getCategories(products){

    for(let i = 0; i < products.length; i++){
        if(!categories.includes(products[i].category)){
            categories.push(products[i].category);
        }
    }

    displayCategories(categories);
}

let selectedCategory = "all";
select.addEventListener("change", function () {
   selectedCategory = select.value;

    if (selectedCategory === "all") {
        displayCards(products);
    } 
    else {
        filterProducts();
    }
});

search_input.addEventListener("input", function () {
    filterProducts();
});

function filterProducts() {
    let filtered = products;

    if (selectedCategory !== "all") {
        filtered = filtered.filter(product =>
            product.category === selectedCategory
        );
    }

    if (search_input.value.trim() !== "") {
        filtered = filtered.filter(product =>
            product.title.toLowerCase().includes(search_input.value.toLowerCase()) 
        );
    }

    displayCards(filtered);
}



function noproductsMessage() {
    message.innerHTML="";

    message.innerHTML += `
        <h1>No products found.</h1>
    `;
}

let close_modal = document.getElementById("close_modal");

if (close_modal) {
    close_modal.addEventListener("click", () => {

        if (window.parent && window.parent !== window) {
            window.parent.document.getElementById("cart_iframe").style.display = "none";
        }

    });
}

function displayCards(items) {
    products_container.innerHTML = "";

    const idCounts = {};
    storeid.forEach(id => {
        idCounts[id] = (idCounts[id] || 0) + 1;
    });

    let renderedCount = 0;

    items.forEach(product => {
        const count = idCounts[product.id];

        if (count) {
            renderedCount++;
            
            products_container.innerHTML += `
                <article class="card" id="card-${product.id}">
                    <span class="cart-badge">${count}</span>

                    <div class="card-img-wrapper">
                        <img class="product-image" src="${product.images[0]}" alt="${product.title}">
                    </div>

                    <div class="card-body">
                        <span class="category"><i class="fa-solid fa-layer-group"></i> ${product.category}</span>
                        <h2 class="title">${product.title}</h2> 

                        <div class="meta-info">
                            <span class="rating"><i class="fa-solid fa-star"></i> ${product.rating}</span>
                            
                            <a href="#" class="remove" onclick="removeOneFromCart(${product.id})">
                                Remove
                            </a>
                        </div>

                        <div class="card-footer">
                            <p class="price">$${product.price}</p>
                            <button class="add-to-cart-btn"><i class="fa-solid fa-cart-plus"></i> buy now</button>
                        </div>
                    </div>
                </article>
            `;
        }
    });

    
    if (renderedCount === 0) {
        noproductsMessage();
    } else {
        message.innerHTML = "";
    }
}

function removeOneFromCart(productId) {
    storeid = JSON.parse(localStorage.getItem("storeid")) || [];

    const index = storeid.indexOf(productId);

    if (index !== -1) {
        storeid.splice(index, 1);

        localStorage.setItem("storeid",JSON.stringify(storeid));

        filterProducts();

        if (window.parent && window.parent !== window) {
            window.parent.updateCartBadge();
        }
    }
}


window.addEventListener("message", function (event) {

    if (event.data?.type === "cartUpdated") {

        storeid = JSON.parse(localStorage.getItem("storeid")) || [];

        filterProducts();
    }

});