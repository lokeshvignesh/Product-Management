document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const grandTotal = document.getElementById('grand-total');

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartDisplay() {
        if (cartCount) {
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    function updateCart() {
        updateCartDisplay();

        if (cartItems) {
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

            saveCart();
            updateCartDisplay();
            alert(`${name} added to the cart!`);
        });
    });

    if (cartItems) {
        cartItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                saveCart();
                updateCart();
            }
        });

        cartItems.addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity')) {
                const index = e.target.getAttribute('data-index');
                const quantity = parseInt(e.target.value, 10);
                cart[index].quantity = quantity > 0 ? quantity : 1;
                saveCart();
                updateCart();
            }
        });
    }

    updateCart();
});
