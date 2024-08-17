
document.addEventListener("DOMContentLoaded", function () {
    let itemClickCounts = JSON.parse(localStorage.getItem("itemClickCounts")) || {};
    let cartItemCount = parseInt(localStorage.getItem("cartItemCount")) || 0;
    const cartCountElement = document.getElementById("cart-count");
    cartCountElement.innerText = cartItemCount;

    const updateQuantity = (item, change) => {
        const quantityElement = document.querySelector(`.quantity[data-item="${item}"]`);
        let quantity = parseInt(quantityElement.innerText);
        quantity = Math.max(0, quantity + change);
        quantityElement.innerText = quantity;

        if (!itemClickCounts[item]) {
            itemClickCounts[item] = { plus: 0, minus: 0, addedToCart: false, quantity: 0, price: 0 };
        }

        if (change > 0) {
            itemClickCounts[item].plus += 1;
        } else if (change < 0) {
            itemClickCounts[item].minus += 1;
        }

        console.log(`Item: ${item}, Plus clicks: ${itemClickCounts[item].plus}, Minus clicks: ${itemClickCounts[item].minus}`);
        localStorage.setItem("itemClickCounts", JSON.stringify(itemClickCounts));
    };

    const items = document.querySelectorAll(".item");

    items.forEach(item => {
        const itemName = item.querySelector("p").innerText;
        const addToCartButton = item.querySelector(".add-to-cart");
        const price = parseInt(item.querySelector(".price b").innerText.replace('/=', ''));

        item.querySelector(".plus").addEventListener("click", function () {
            updateQuantity(itemName, 1);
        });

        item.querySelector(".minus").addEventListener("click", function () {
            updateQuantity(itemName, -1);
        });

        addToCartButton.addEventListener("click", function () {
            const quantityElement = item.querySelector(`.quantity[data-item="${itemName}"]`);
            const quantity = parseInt(quantityElement.innerText);

            if (quantity > 0) {
                if (!itemClickCounts[itemName].addedToCart) {
                    // Add item to cart
                    itemClickCounts[itemName].addedToCart = true;
                    addToCartButton.innerText = "Added to cart";
                    addToCartButton.style.backgroundColor = "grey";

                    // Increment cart item count by 1 for each new item added to the cart
                    cartItemCount += 1;
                    cartCountElement.innerText = cartItemCount;
                }
            } else {
                if (itemClickCounts[itemName].addedToCart) {
                    // Remove item from cart
                    itemClickCounts[itemName].addedToCart = false;
                    addToCartButton.innerText = "Add to cart";
                    addToCartButton.style.backgroundColor = "";

                    // Decrement cart item count by 1 for each item removed from the cart
                    cartItemCount -= 1;
                    cartCountElement.innerText = cartItemCount;
                }
            }

            // Update the item quantity and price stored
            itemClickCounts[itemName].quantity = quantity;
            itemClickCounts[itemName].price = price;

            localStorage.setItem("itemClickCounts", JSON.stringify(itemClickCounts));
            localStorage.setItem("cartItemCount", cartItemCount);
        });
    });

    // Function to update the cart modal with items in the cart
    const updateCartModal = () => {
        const cartTableBody = document.querySelector("#cart-table tbody");
        cartTableBody.innerHTML = "";

        for (const item in itemClickCounts) {
            if (itemClickCounts[item].addedToCart && itemClickCounts[item].quantity > 0) {
                const row = document.createElement("tr");

                const itemNameCell = document.createElement("td");
                itemNameCell.textContent = item;
                row.appendChild(itemNameCell);

                const quantityCell = document.createElement("td");
                quantityCell.textContent = itemClickCounts[item].quantity;
                row.appendChild(quantityCell);

                const priceCell = document.createElement("td");
                const totalPrice = itemClickCounts[item].quantity * itemClickCounts[item].price;
                priceCell.textContent = `${totalPrice}/=`;
                row.appendChild(priceCell);

                // Add Remove button
                const removeCell = document.createElement("td");
                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.style.backgroundColor = "red";
                removeButton.style.color = "white";
                removeButton.addEventListener("click", function () {
                    // Remove item from cart
                    itemClickCounts[item].addedToCart = false;
                    itemClickCounts[item].quantity = 0;
                    cartItemCount -= 1;
                    cartCountElement.innerText = cartItemCount;

                    // Find the add to cart button and reset its state
                    const itemElement = Array.from(items).find(it => it.querySelector("p").innerText === item);
                    const itemAddToCartButton = itemElement.querySelector(".add-to-cart");
                    itemAddToCartButton.innerText = "Add to cart";
                    itemAddToCartButton.style.backgroundColor = "";

                    updateCartModal(); // Refresh the cart modal

                    localStorage.setItem("itemClickCounts", JSON.stringify(itemClickCounts));
                    localStorage.setItem("cartItemCount", cartItemCount);
                });
                removeCell.appendChild(removeButton);
                row.appendChild(removeCell);

                cartTableBody.appendChild(row);
            }
        }
    };

    const cartButton = document.querySelector(".centered-button");
    const cartModal = document.getElementById("cart-modal");
    const closeModalButton = document.querySelector(".close");

    cartButton.addEventListener("click", () => {
        updateCartModal();
        cartModal.style.display = "block";
    });

    closeModalButton.addEventListener("click", () => {
        cartModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = "none";
        }
    });

    const categoryItems = {
        "Legumes": ["Yellow Beans", "Ndengu"],
        "Cereals": ["Oats", "Millet"],
        "Vegetables and Fruits": ["Apples", "Oranges", "Potatoes","Onions"],
        "Greens": ["Terere", "Sukumawiki", "Kunde"]
    };

    const categories = document.querySelectorAll(".shopping > div");
    const gridContainer = document.querySelector(".grid-container");
    const spinner = document.getElementById("spinner");
    const overlay = document.getElementById("overlay");

    const hideAllItems = () => {
        items.forEach(item => {
            item.style.display = "none";
        });
    };

    const showItemsForCategory = (categoryName) => {
        hideAllItems();
        const itemsToShow = categoryItems[categoryName] || [];
        itemsToShow.forEach(itemName => {
            const itemElement = Array.from(items).find(item => item.querySelector("p").innerText === itemName);
            if (itemElement) {
                itemElement.style.display = "block";
            }
        });
    };

    categories.forEach(category => {
        category.addEventListener("click", function () {
            const categoryName = category.querySelector('h1').innerText;

            // Show spinner and overlay
            spinner.classList.add("show");
            overlay.classList.add("show");

            // Simulate loading delay
            setTimeout(() => {
                // Hide spinner and overlay
                spinner.classList.remove("show");
                overlay.classList.remove("show");

                // Show items for the selected category
                showItemsForCategory(categoryName);

                // Highlight the selected category
                categories.forEach(cat => cat.style.backgroundColor = "");
                category.style.backgroundColor = "#FF9800";
                category.style.color = "black";
            }, 1000);
        });
    });

    hideAllItems();

    // SEARCH FUNCTIONALITY
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const noResultsMessage = document.createElement('div');
    noResultsMessage.textContent = 'No items match your search.';
    noResultsMessage.style.display = 'none';
    noResultsMessage.style.color = 'red';
    gridContainer.appendChild(noResultsMessage);

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();
        filterItems(searchTerm);
    });

    function filterItems(term) {
        let hasMatches = false;

        items.forEach(item => {
            const itemName = item.querySelector('p').textContent.toLowerCase();
            if (itemName.includes(term)) {
                item.style.display = '';
                hasMatches = true;
            } else {
                item.style.display = 'none';
            }
        });

        if (hasMatches) {
            noResultsMessage.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'block';
        }
    }

    // Restore the state of items from localStorage
    for (const item in itemClickCounts) {
        if (itemClickCounts[item].addedToCart) {
            const itemElement = Array.from(items).find(it => it.querySelector("p").innerText === item);
            const addToCartButton = itemElement.querySelector(".add-to-cart");
            const quantityElement = itemElement.querySelector(`.quantity[data-item="${item}"]`);

            addToCartButton.innerText = "Added to cart";
            addToCartButton.style.backgroundColor = "grey";
            quantityElement.innerText = itemClickCounts[item].quantity;
        }
    }

    // CODE FOR FETCHING ITEMS FROM DATABASE
    document.addEventListener("DOMContentLoaded", function () {
        fetch('fetch_items.php')
            .then(response => response.json())
            .then(data => {
                const gridContainer = document.getElementById('grid-container');
                gridContainer.innerHTML = ''; // Clear the existing items
    
                data.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('item');
                    
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <p>${item.name}</p>
                        <p class="price"><b>${item.price}/=</b></p>
                        <div class="quantity-control">
                            <button class="minus" data-item="${item.name}">-</button>
                            <span class="quantity" data-item="${item.name}">0</span>
                            <button class="plus" data-item="${item.name}">+</button>
                        </div>
                        <button class="add-to-cart" data-item="${item.name}">Add to cart</button>
                    `;
    
                    gridContainer.appendChild(itemElement);
    
                    // Add event listeners to buttons (similar to your existing code)
                    itemElement.querySelector(".plus").addEventListener("click", function () {
                        updateQuantity(item.name, 1);
                    });
    
                    itemElement.querySelector(".minus").addEventListener("click", function () {
                        updateQuantity(item.name, -1);
                    });
    
                    itemElement.querySelector(".add-to-cart").addEventListener("click", function () {
                        addToCart(item.name, item.price);
                    });
                });
            })
            .catch(error => console.error('Error fetching items:', error));
    });

    // Checkout functionality
    const checkoutButton = document.getElementById("checkout-button");
    checkoutButton.addEventListener("click", function () {
        // Reset cart count
        cartItemCount = 0;
        cartCountElement.innerText = cartItemCount;

        
    });
    
     
});