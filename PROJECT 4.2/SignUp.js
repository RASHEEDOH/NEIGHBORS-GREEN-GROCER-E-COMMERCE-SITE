document.addEventListener('DOMContentLoaded', function() {
    //code for payment method
    const selectElement = document.getElementById('payment-method');
    const selectContainer = document.createElement('div');
    selectContainer.classList.add('custom-select-container');
    selectElement.parentNode.insertBefore(selectContainer, selectElement);
    selectContainer.appendChild(selectElement);

    selectElement.addEventListener('change', function() {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const icon = selectedOption.getAttribute('data-icon');
        const customIcon = document.querySelector('.custom-select-icon');
        if (icon) {
            if (customIcon) {
                customIcon.src = icon;
            } else {
                const newIcon = document.createElement('img');
                newIcon.src = icon;
                newIcon.classList.add('custom-select-icon');
                selectContainer.insertBefore(newIcon, selectElement);
            }
        } else if (customIcon) {
            customIcon.remove();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const paymentNumberInput = document.getElementById('payment-number');
    
    paymentNumberInput.addEventListener('input', function() {
        const countryCode = '+254';
        let value = paymentNumberInput.value;

        // Ensure the input value starts with the country code
        if (!value.startsWith(countryCode)) {
            value = countryCode + value.replace(countryCode, '');
            paymentNumberInput.value = value;
        }
    });
});
