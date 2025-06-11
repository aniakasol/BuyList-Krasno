const products = [
    { name: "Помідори", quantity: 2, bought: true },
    { name: "Печиво", quantity: 2, bought: false },
    { name: "Сир", quantity: 1, bought: false }
];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".new-item");
    const input = document.querySelector("#newitem");
    const panelMain = document.querySelector(".panel.main");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const productName = input.value.trim();
        if (productName === "") return;

        const newProduct = {
            name: productName,
            quantity: 1,
            bought: false,
        };

        products.push(newProduct);

        input.value = "";
        renderProducts();
    });

    loadProductsFromStorage();
    renderProducts();
    updateInfo();
});

function renderProducts() {
    const allitems = document.querySelector(".allitems");
    allitems.innerHTML = "";

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = `item ${product.bought ? "bought" : ""}`;
        productDiv.innerHTML = `
            <span class="item-name">${product.bought ? `<s>${product.name}</s>` : product.name}</span>
            <input type="text" class="edit-name" value="${product.name}" style="display: none;">
            <span class="amount">
                <button ${product.quantity == 1 ? "disabled" : ""} class="minus" data-tooltip="зменшити к-кість">-</button>
                <span>${product.quantity}</span>
                <button class="plus" data-tooltip="збільшити к-кість">+</button>
            </span>
            <span class="add-button">
                <button onclick="toggleBought('${product.name}')" data-tooltip="позначити як:">
                    ${product.bought ? "Не куплено" : "Куплено"}
                </button>
                <button class="delete" onclick="deleteProduct('${product.name}')" data-tooltip="видалити">x</button>
            </span>
        `;

        const nameSpan = productDiv.querySelector(".item-name");
        const nameInput = productDiv.querySelector(".edit-name");
        nameSpan.addEventListener("click", () => {
            nameSpan.style.display = "none";
            nameInput.style.display = "inline-block";
            nameInput.focus();
        });
        nameInput.addEventListener("blur", () => {
            const newName = nameInput.value.trim() || "Без назви";
            nameSpan.style.display = "inline-block";
            nameInput.style.display = "none";
            const product = products.find(p => p.name === nameSpan.textContent);
            if (product) {
                product.name = newName;
            }
            renderProducts();
        });
        allitems.appendChild(productDiv);
    });
    document.querySelectorAll(".minus").forEach(minus => {
        minus.addEventListener("click", () => handleMinusClick(minus));
    });
    document.querySelectorAll(".plus").forEach(plus => {
        plus.addEventListener("click", () => handlePlusClick(plus));
    });
    updateInfo();
    saveProductsToStorage();
}

function updateInfo() {
    const remainList = document.querySelector(".itemlist.remain");
    const boughtList = document.querySelector(".itemlist.bought");

    remainList.innerHTML = "";
    boughtList.innerHTML = "";

    products.forEach(product => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "list-item";
        
        const nameSpan = document.createElement("span");
        nameSpan.className = "list-name";
        nameSpan.innerHTML = product.bought ? `<s>${product.name}</s>` : product.name;

        const quantitySpan = document.createElement("span");
        quantitySpan.className = "list-am";
        quantitySpan.innerHTML = product.bought ? `<s>${product.quantity}</s>` : product.quantity;

        itemDiv.appendChild(nameSpan);
        itemDiv.appendChild(quantitySpan);

        if (product.bought) {
            boughtList.appendChild(itemDiv);
        } else {
            remainList.appendChild(itemDiv);
        }
    });
}

function toggleBought(name) {
    const product = products.find(p => p.name === name);
    if (product) {
        product.bought = !product.bought;
        renderProducts();
    }
}

function deleteProduct(name) {
    const index = products.findIndex(p => p.name === name);
    if (index !== -1) {
        products.splice(index, 1);
        renderProducts();
    }
}

function handleMinusClick(minus) {
    const countSpan = minus.nextElementSibling;
    let count = parseInt(countSpan.textContent);
    
    const itemDiv = minus.closest(".item");
    const itemNameSpan = itemDiv.querySelector(".item-name");
    const productName = itemNameSpan.textContent.replace(/<s>|<\/s>/g, "").trim();

    if (count > 1) {
        count--;
        countSpan.textContent = count;
        minus.disabled = count === 1;
    }
    const product = products.find(p => p.name === productName);
    product.quantity = count;
    console.log(product);

    updateInfo();
    saveProductsToStorage();
}

function handlePlusClick(plus) {
    const countSpan = plus.previousElementSibling;
    const minus = countSpan.previousElementSibling;
    const itemDiv = plus.closest(".item");
    const itemNameSpan = itemDiv.querySelector(".item-name");
    const productName = itemNameSpan.textContent.replace(/<s>|<\/s>/g, "").trim();

    let count = parseInt(countSpan.textContent);
    count++;
    countSpan.textContent = count;
    minus.disabled = false;

    const product = products.find(p => p.name === productName);
    product.quantity = count;
   
    updateInfo();
    saveProductsToStorage();
}

function saveProductsToStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem("products");

    if (storedProducts) {
        products.splice(0, products.length, ...JSON.parse(storedProducts));
    }
}
