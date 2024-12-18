document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const grandTotal = document.getElementById('grand-total');

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCart() {
        cartCount.textContent = cart.length;
        if (cart.length === 0) {
            cartItems.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
            grandTotal.textContent = '0/-';
            return;
        }

        let total = 0;
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartItems.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price}/-</td>
                    <td>
                        <input type="number" value="${item.quantity}" class="form-control quantity" data-index="${index}" min="1">
                    </td>
                    <td>${itemTotal}/-</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                    </td>
                </tr>
            `;
        });

        grandTotal.textContent = `${total}/-`;
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'), 10);

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            saveCart(); // Save to localStorage
            updateCart();
        });
    });

    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            saveCart(); // Save to localStorage
            updateCart();
        }
    });

    cartItems.addEventListener('input', (e) => {
        if (e.target.classList.contains('quantity')) {
            const index = e.target.getAttribute('data-index');
            const quantity = parseInt(e.target.value, 10);
            cart[index].quantity = quantity > 0 ? quantity : 1;
            saveCart(); // Save to localStorage
            updateCart();
        }
    });

    document.getElementById('place-order-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const fullName = document.getElementById('full-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!fullName || !email || !address || !phone) {
            alert('Please fill out all required fields.');
            return;
        }

        alert('Order placed successfully!');
        localStorage.removeItem('cart'); // Clear cart
        window.location.href = 'home.html'; // Redirect to home or success page
    });

    // Render cart on page load
    updateCart();
});
