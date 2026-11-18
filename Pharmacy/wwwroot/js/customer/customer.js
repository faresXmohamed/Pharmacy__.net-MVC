
(function () {
    "use strict";

    /* =====================================
       CONFIGURATION
       ===================================== */

    const CART_KEY = "pharmacy_cart";
    const DELIVERY_FEE = 20;

    const currency = (value) => {
        return `EGP ${Number(value || 0).toFixed(2)}`;
    };

    const getElement = (selector, parent = document) => {
        return parent.querySelector(selector);
    };

    const getElements = (selector, parent = document) => {
        return Array.from(parent.querySelectorAll(selector));
    };

    const showMessage = (message, type = "success") => {
        if (
            window.PharmacyUI &&
            typeof window.PharmacyUI.toast === "function"
        ) {
            window.PharmacyUI.toast(message, type);
        } else {
            alert(message);
        }
    };

    /* =====================================
       CART STORAGE
       ===================================== */

    function getCart() {
        try {
            const storedCart = localStorage.getItem(CART_KEY);
            const parsedCart = storedCart ? JSON.parse(storedCart) : [];

            if (!Array.isArray(parsedCart)) {
                return [];
            }

            return parsedCart.filter(item => {
                return (
                    item &&
                    typeof item.id === "string" &&
                    typeof item.name === "string" &&
                    Number.isFinite(Number(item.price)) &&
                    Number(item.price) >= 0 &&
                    Number.isFinite(Number(item.quantity)) &&
                    Number(item.quantity) > 0
                );
            });

        } catch (error) {
            console.error("Cart loading error:", error);
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            renderCart();
        } catch (error) {
            console.error("Cart saving error:", error);
            showMessage("Unable to save your cart.", "error");
        }
    }

    function getCartTotals() {
        const cart = getCart();

        const subtotal = cart.reduce((total, item) => {
            return total + Number(item.price) * Number(item.quantity);
        }, 0);

        const delivery = cart.length > 0 ? DELIVERY_FEE : 0;

        return {
            subtotal,
            delivery,
            total: subtotal + delivery,
            count: cart.reduce((total, item) => {
                return total + Number(item.quantity);
            }, 0)
        };
    }

    /* =====================================
       CART ACTIONS
       ===================================== */

    function addToCart(product) {
        if (
            !product ||
            !product.id ||
            !product.name ||
            !Number.isFinite(Number(product.price)) ||
            Number(product.price) < 0
        ) {
            showMessage("Invalid product information.", "error");
            return;
        }

        const cart = getCart();

        const existingItem = cart.find(item => {
            return item.id === product.id;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: String(product.id),
                name: String(product.name),
                price: Number(product.price),
                image: String(product.image || ""),
                quantity: 1
            });
        }

        saveCart(cart);
        showMessage(`${product.name} added to cart.`);
    }

    function removeFromCart(productId) {
        const cart = getCart().filter(item => {
            return item.id !== productId;
        });

        saveCart(cart);
        showMessage("Product removed from cart.");
    }

    function changeQuantity(productId, amount) {
        const cart = getCart();

        const item = cart.find(product => {
            return product.id === productId;
        });

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (item.quantity > 99) {
            item.quantity = 99;
            showMessage("Maximum quantity is 99.", "warning");
        }

        saveCart(cart);
    }

    function updateQuantity(productId, quantity) {
        const value = Number(quantity);

        if (!Number.isInteger(value) || value < 1) {
            showMessage("Quantity must be at least 1.", "error");
            renderCart();
            return;
        }

        const cart = getCart();
        const item = cart.find(product => product.id === productId);

        if (!item) return;

        item.quantity = Math.min(value, 99);

        saveCart(cart);
    }

    /* =====================================
       CART COUNT & TOTALS
       ===================================== */

    function updateCartCount() {
        const totals = getCartTotals();

        getElements("[data-cart-count]").forEach(element => {
            element.textContent = totals.count;
        });
    }

    function updateCartTotals() {
        const totals = getCartTotals();

        getElements("[data-cart-subtotal]").forEach(element => {
            element.textContent = currency(totals.subtotal);
        });

        getElements("[data-cart-delivery]").forEach(element => {
            element.textContent = currency(totals.delivery);
        });

        getElements("[data-cart-total]").forEach(element => {
            element.textContent = currency(totals.total);
        });
    }

    /* =====================================
       CART HTML
       ===================================== */

    function createCartItem(item) {
        const article = document.createElement("article");
        article.className = "cart-item";

        const image = document.createElement("div");
        image.className = "cart-item-image";

        if (item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;

            img.addEventListener("error", () => {
                img.remove();
                image.textContent = "MED";
            });

            image.appendChild(img);
        } else {
            image.textContent = "MED";
        }

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const unitPrice = document.createElement("p");
        unitPrice.textContent = `${currency(item.price)} each`;

        const totalPrice = document.createElement("strong");
        totalPrice.className = "cart-item-price";
        totalPrice.textContent = currency(item.price * item.quantity);

        info.append(title, unitPrice, totalPrice);

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const quantityControl = document.createElement("div");
        quantityControl.className = "quantity-control";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute("aria-label", "Decrease quantity");
        decreaseButton.dataset.cartAction = "decrease";
        decreaseButton.dataset.productId = item.id;

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute("aria-label", "Increase quantity");
        increaseButton.dataset.cartAction = "increase";
        increaseButton.dataset.productId = item.id;

        quantityControl.append(
            decreaseButton,
            quantity,
            increaseButton
        );

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-item";
        removeButton.textContent = "Remove";
        removeButton.dataset.cartAction = "remove";
        removeButton.dataset.productId = item.id;

        actions.append(quantityControl, removeButton);

        article.append(image, info, actions);

        return article;
    }

    /* =====================================
       RENDER CART
       ===================================== */

    function renderCart() {
        const cart = getCart();

        const cartContainer = getElement("[data-cart-items]");
        const emptyState = getElement("[data-cart-empty]");

        if (cartContainer) {
            cartContainer.replaceChildren();

            cart.forEach(item => {
                cartContainer.appendChild(createCartItem(item));
            });
        }

        if (emptyState) {
            emptyState.hidden = cart.length > 0;
        }

        const checkoutLink = getElement("[data-checkout-link]");

        if (checkoutLink) {
            checkoutLink.style.pointerEvents =
                cart.length > 0 ? "auto" : "none";

            checkoutLink.style.opacity =
                cart.length > 0 ? "1" : "0.5";

            checkoutLink.setAttribute(
                "aria-disabled",
                cart.length === 0 ? "true" : "false"
            );
        }

        updateCartCount();
        updateCartTotals();
        renderCheckoutItems();
    }

    /* =====================================
       CHECKOUT ITEMS
       ===================================== */

    function renderCheckoutItems() {
        const container = getElement("[data-checkout-items]");

        if (!container) return;

        const cart = getCart();
        container.replaceChildren();

        if (cart.length === 0) {
            const message = document.createElement("p");
            message.className = "summary-empty";
            message.textContent = "Your cart is empty.";

            container.appendChild(message);
            return;
        }

        cart.forEach(item => {
            const row = document.createElement("div");
            row.className = "checkout-cart-item";

            const name = document.createElement("span");
            name.textContent = `${item.name} × ${item.quantity}`;

            const price = document.createElement("strong");
            price.textContent = currency(
                item.price * item.quantity
            );

            row.append(name, price);
            container.appendChild(row);
        });
    }

    /* =====================================
       ADD TO CART BUTTONS
       ===================================== */

    function initAddToCart() {
        document.addEventListener("click", event => {
            const button = event.target.closest("[data-add-to-cart]");

            if (!button) return;

            const product = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: Number(button.dataset.productPrice),
                image: button.dataset.productImage || ""
            };

            addToCart(product);
        });
    }

    /* =====================================
       CART BUTTON ACTIONS
       ===================================== */

    function initCartActions() {
        document.addEventListener("click", event => {
            const button = event.target.closest("[data-cart-action]");

            if (!button) return;

            const productId = button.dataset.productId;
            const action = button.dataset.cartAction;

            if (!productId) return;

            if (action === "increase") {
                changeQuantity(productId, 1);
            }

            if (action === "decrease") {
                changeQuantity(productId, -1);
            }

            if (action === "remove") {
                removeFromCart(productId);
            }
        });
    }

    /* =====================================
       SEARCH & FILTER
       ===================================== */

    function initMedicineFilters() {
        const searchInput = getElement("[data-medicine-search]");
        const categoryFilter = getElement("[data-category-filter]");
        const branchFilter = getElement("#branchFilter");

        const products = getElements("[data-medicine-item]");

        if (products.length === 0) return;

        function applyFilters() {
            const searchTerm = searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

            const selectedCategory = categoryFilter
                ? categoryFilter.value
                : "all";

            const selectedBranch = branchFilter
                ? branchFilter.value
                : "";

            let visibleCount = 0;

            products.forEach(product => {
                const name = product.textContent.toLowerCase();
                const category = product.dataset.category || "";
                const branch = product.dataset.branch || "";

                const matchesSearch = name.includes(searchTerm);

                const matchesCategory =
                    !selectedCategory ||
                    selectedCategory === "all" ||
                    category === selectedCategory;

                const matchesBranch =
                    !selectedBranch ||
                    branch === selectedBranch;

                const visible =
                    matchesSearch &&
                    matchesCategory &&
                    matchesBranch;

                product.hidden = !visible;

                if (visible) visibleCount++;
            });

            const emptyState = getElement("[data-medicines-empty]");

            if (emptyState) {
                emptyState.hidden = visibleCount > 0;
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        if (categoryFilter) {
            categoryFilter.addEventListener("change", applyFilters);
        }

        if (branchFilter) {
            branchFilter.addEventListener("change", applyFilters);
        }

        const clearButton = getElement("[data-clear-filters]");

        if (clearButton) {
            clearButton.addEventListener("click", () => {
                if (searchInput) searchInput.value = "";
                if (categoryFilter) categoryFilter.value = "all";
                if (branchFilter) branchFilter.value = "";

                applyFilters();
            });
        }

        applyFilters();
    }

    /* =====================================
       SORT PRODUCTS
       ===================================== */

    function initProductSorting() {
        const sortSelect = getElement(".medicines-toolbar select");
        const grid = getElement(".medicines-main .products-grid");

        if (!sortSelect || !grid) return;

        sortSelect.addEventListener("change", () => {
            const products = getElements(
                "[data-medicine-item]",
                grid
            );

            const sorted = [...products];

            if (sortSelect.value === "price-low") {
                sorted.sort((a, b) => {
                    return getProductPrice(a) - getProductPrice(b);
                });
            }

            if (sortSelect.value === "price-high") {
                sorted.sort((a, b) => {
                    return getProductPrice(b) - getProductPrice(a);
                });
            }

            if (sortSelect.value === "name") {
                sorted.sort((a, b) => {
                    return getProductName(a).localeCompare(
                        getProductName(b)
                    );
                });
            }

            sorted.forEach(product => {
                grid.appendChild(product);
            });
        });
    }

    function getProductPrice(product) {
        const button = getElement("[data-add-to-cart]", product);
        return Number(button?.dataset.productPrice || 0);
    }

    function getProductName(product) {
        const button = getElement("[data-add-to-cart]", product);
        return button?.dataset.productName || "";
    }

    /* =====================================
       URL SEARCH PARAMETERS
       ===================================== */

    function initUrlFilters() {
        const params = new URLSearchParams(window.location.search);

        const searchValue = params.get("search");
        const categoryValue = params.get("category");

        const searchInput = getElement("[data-medicine-search]");
        const categoryFilter = getElement("[data-category-filter]");

        if (searchValue && searchInput) {
            searchInput.value = searchValue;
            searchInput.dispatchEvent(new Event("input"));
        }

        if (categoryValue && categoryFilter) {
            categoryFilter.value = categoryValue;
            categoryFilter.dispatchEvent(new Event("change"));
        }
    }

    /* =====================================
       CHECKOUT VALIDATION
       ===================================== */

    function initCheckout() {
        const form = getElement("[data-checkout-form]");

        if (!form) return;

        form.addEventListener("submit", event => {
            event.preventDefault();

            const cart = getCart();

            if (cart.length === 0) {
                showMessage("Your cart is empty.", "error");
                return;
            }

            if (!form.reportValidity()) {
                return;
            }

            const formData = new FormData(form);
            const orderPreview = {
                customer: {
                    name: formData.get("customerName"),
                    phone: formData.get("customerPhone"),
                    email: formData.get("customerEmail")
                },
                branchId: formData.get("branchId"),
                address: {
                    city: formData.get("city"),
                    area: formData.get("area"),
                    street: formData.get("streetAddress"),
                    building: formData.get("buildingNumber"),
                    apartment: formData.get("apartmentNumber"),
                    notes: formData.get("deliveryNotes")
                },
                paymentMethod: formData.get("paymentMethod"),
                items: cart,
                totals: getCartTotals()
            };

            console.log("Demo order preview:", orderPreview);

            showMessage(
                "Your information is valid. Backend connection is still required.",
                "success"
            );
        });
    }

    /* =====================================
       PASSWORD IS NOT HANDLED HERE
       Auth controls are handled by shared.js.
       ===================================== */

    /* =====================================
       INITIALIZE
       ===================================== */

    function init() {
        initAddToCart();
        initCartActions();

        renderCart();

        initMedicineFilters();
        initProductSorting();
        initUrlFilters();

        initCheckout();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    /* =====================================
       PUBLIC API
       ===================================== */

    window.PharmacyCustomer = {
        getCart,
        saveCart,
        addToCart,
        removeFromCart,
        changeQuantity,
        updateQuantity,
        getCartTotals,
        renderCart
    };

})();
