document.addEventListener("DOMContentLoaded", function () {
    const orderTableBody = document.querySelector("#order-table tbody");
    const totalPriceElement = document.getElementById("total-price");
    const errorMessageElement = document.getElementById("error-message");
    const confirmOrderButton = document.getElementById("confirm-order");
    const orderTable = document.getElementById("order-table");
    let itemClickCounts = JSON.parse(localStorage.getItem("itemClickCounts")) || {};

    const updateOrderTable = () => {
        orderTableBody.innerHTML = "";
        let totalPrice = 0;
        let hasItems = false;

        for (const item in itemClickCounts) {
            if (itemClickCounts[item].addedToCart && itemClickCounts[item].quantity > 0) {
                hasItems = true;
                const row = document.createElement("tr");

                const itemNameCell = document.createElement("td");
                itemNameCell.textContent = item;
                row.appendChild(itemNameCell);

                const quantityCell = document.createElement("td");
                const quantityWrapper = document.createElement("div");
                quantityWrapper.classList.add("quantity-wrapper");

                const minusButton = document.createElement("button");
                minusButton.textContent = "-";
                minusButton.classList.add("quantity-button", "minus-button");
                minusButton.addEventListener("click", () => {
                    if (itemClickCounts[item].quantity > 1) {
                        itemClickCounts[item].quantity--;
                        localStorage.setItem("itemClickCounts", JSON.stringify(itemClickCounts));
                        updateOrderTable();
                    }
                });

                const quantityDisplay = document.createElement("span");
                quantityDisplay.textContent = itemClickCounts[item].quantity;
                quantityDisplay.classList.add("quantity-display");

                const plusButton = document.createElement("button");
                plusButton.textContent = "+";
                plusButton.classList.add("quantity-button", "plus-button");
                plusButton.addEventListener("click", () => {
                    itemClickCounts[item].quantity++;
                    localStorage.setItem("itemClickCounts", JSON.stringify(itemClickCounts));
                    updateOrderTable();
                });

                quantityWrapper.appendChild(minusButton);
                quantityWrapper.appendChild(quantityDisplay);
                quantityWrapper.appendChild(plusButton);
                quantityCell.appendChild(quantityWrapper);
                row.appendChild(quantityCell);

                const priceCell = document.createElement("td");
                const itemTotalPrice = itemClickCounts[item].quantity * itemClickCounts[item].price;
                priceCell.textContent = `${itemTotalPrice}/=`;
                row.appendChild(priceCell);

                const removeCell = document.createElement("td");
                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.classList.add("remove-button");
                removeButton.addEventListener("click", () => {
                    delete itemClickCounts[item];
                    localStorage.setItem("itemClickCounts", JSON.stringify(itemClickCounts));
                    updateOrderTable();
                });
                removeCell.appendChild(removeButton);
                row.appendChild(removeCell);

                orderTableBody.appendChild(row);

                totalPrice += itemTotalPrice;
            }
        }

        totalPriceElement.textContent = `Total Price: ${totalPrice}/=`;

        if (hasItems) {
            orderTable.style.display = "";
            totalPriceElement.style.display = "";
            confirmOrderButton.style.display = "";
            errorMessageElement.style.display = "none";
        } else {
            orderTable.style.display = "none";
            totalPriceElement.style.display = "none";
            confirmOrderButton.style.display = "none";
            errorMessageElement.style.display = "";
        }
    };

    confirmOrderButton.addEventListener("click", function () {
        if (Object.keys(itemClickCounts).length === 0) {
            alert("No items in the cart!");
            return;
        }

        const orderData = Object.keys(itemClickCounts).map(item => ({
            name: item,
            quantity: itemClickCounts[item].quantity,
            price: itemClickCounts[item].price
        }));

        fetch('submit_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.text())
        .then(data => {
            alert("Thank you for your order!");
            itemClickCounts = {}; // Clear the itemClickCounts object
            localStorage.removeItem("itemClickCounts"); // Remove itemClickCounts from localStorage
            localStorage.removeItem("cartItemCount"); // Remove cartItemCount from localStorage
            updateOrderTable();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    confirmOrderButton.addEventListener("click", function () {
    if (Object.keys(itemClickCounts).length === 0) {
        alert("No items in the cart!");
        return;
    }

    const orderData = Object.keys(itemClickCounts).map(item => ({
        name: item,
        quantity: itemClickCounts[item].quantity,
        price: itemClickCounts[item].price
    }));

    const totalPrice = Object.values(itemClickCounts).reduce((total, item) => {
        return total + (item.quantity * item.price);
    }, 0);

    fetch('submit_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderData, totalPrice })
    })
    .then(response => response.text())
    .then(data => {
        alert("Thank you for your order!");
        itemClickCounts = {}; // Clear the itemClickCounts object
        localStorage.removeItem("itemClickCounts"); // Remove itemClickCounts from localStorage
        localStorage.removeItem("cartItemCount"); // Remove cartItemCount from localStorage
        updateOrderTable();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


    updateOrderTable();
});
