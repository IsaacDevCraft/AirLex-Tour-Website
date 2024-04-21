document.addEventListener("DOMContentLoaded", function() {
    const increaseButtons = document.querySelectorAll('.btn-secondary[data-action="increase"]');
    const decreaseButtons = document.querySelectorAll('.btn-secondary[data-action="decrease"]');
    const removeButtons = document.querySelectorAll('.product-remove button');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const payButton = document.getElementById('payButton');
    const payAmount = document.querySelector('.pay-amount');
    const creditCardButton = document.querySelector('.method.selected');
    const paypalButton = document.querySelector('.method:not(.selected)');

    const taxRate = 0.05; // 5% tax rate

    function updateSubtotal() {
        let subtotal = 0;
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const quantityElement = card.querySelector('.mx-2');
            const quantity = parseInt(quantityElement.textContent);
            const priceElement = card.querySelector('.product-price span');
            const price = parseFloat(priceElement.getAttribute('data-price'));
            const totalPrice = quantity * price;
            priceElement.textContent = '£' + totalPrice.toFixed(2);
            const tripCount = card.querySelector('.product-quantity .mx-2');
            tripCount.textContent = quantity + ' Trip' + (quantity > 1 ? 's' : '');
            subtotal += totalPrice;
        });
        subtotalElement.textContent = subtotal.toFixed(2);
        updateTotal(subtotal);
    }

    function updateTotal(subtotal) {
        const tax = subtotal * taxRate;
        taxElement.textContent = tax.toFixed(2);
        const total = subtotal + tax;
        totalElement.textContent = total.toFixed(2);
        payAmount.textContent = total.toFixed(2);
    }

    function simulatePayment() {
        // Check if at least one trip has been selected
        const tripCount = document.querySelectorAll('.product-quantity .mx-2');
        let tripSelected = false;
        tripCount.forEach(count => {
            if (parseInt(count.textContent) > 0) {
                tripSelected = true;
            }
        });

        if (!tripSelected) {
            alert("Please select at least one trip to proceed with payment by clicking on the CREDIT CARD again.");
            return;
        }

        // Check if all required fields are filled
        const cardholderName = document.getElementById('cardholder-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (cardholderName === '' || cardNumber === '' || expiryDate === '' || cvv === '') {
            alert("Please enter all required payment details.");
            return;
        }

        // Validate CVV
        if (!/^\d{3}$/.test(cvv)) {
            alert("Please enter a valid CVV (3 digits).");
            return;
        }

        // Validate expiry date (MM/YY format)
        const [expiryMonth, expiryYear] = expiryDate.split('/');
        const expiry = new Date(parseInt('20' + expiryYear), parseInt(expiryMonth) - 1); // '20' + expiryYear to make it a 4-digit year
        const today = new Date();
        today.setMonth(today.getMonth() + 1); // Add 1 month to today's date
        if (isNaN(expiry.getTime()) || expiry <= today) {
            alert("Please enter a valid expiry date (MM/YY format) that is in the future.");
            return;
        }

         // If all checks pass, display payment successful message with cardholder name, last 4 digits of the card number, and payment amount
       const last4Digits = cardNumber.slice(-4);
        const paymentAmount = payAmount.textContent;
        alert("AirLex Tour Payment successful!\nCardholder Name: " + cardholderName + "\nCard Number: ************" + last4Digits + "\nPayment Amount: £" + paymentAmount);
    }

    function showNotSupportedPrompt() {
        alert("This service is currently not supported.");
    }

    function reloadPage() {
        location.reload();
    }

    payButton.addEventListener('click', simulatePayment);
    paypalButton.addEventListener('click', showNotSupportedPrompt);
    creditCardButton.addEventListener('click', reloadPage);

    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantityElement = this.parentNode.querySelector('.mx-2');
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
            updateSubtotal();
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantityElement = this.parentNode.querySelector('.mx-2');
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                updateSubtotal();
            }
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            productCard.remove();
            updateSubtotal();
        });
    });

    // Initial calculation
    updateSubtotal();
});

