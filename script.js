/* =========================================================
   BREW & BLOOM - JAVASCRIPT
   ========================================================= */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const header = document.getElementById("header");

const navMenu = document.getElementById("navMenu");

const menuToggle = document.getElementById("menuToggle");

const themeBtn = document.getElementById("themeBtn");

const cartBtn = document.getElementById("cartBtn");

const cartSidebar = document.getElementById("cartSidebar");

const cartOverlay = document.getElementById("cartOverlay");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartSubtotal = document.getElementById("cartSubtotal");

const cartTax = document.getElementById("cartTax");

const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

const toast = document.getElementById("toast");

const toastTitle = document.getElementById("toastTitle");

const toastMessage = document.getElementById("toastMessage");

const closeToast = document.getElementById("closeToast");

const backTop = document.getElementById("backTop");


/* =========================================================
   CART
   ========================================================= */

let cart = JSON.parse(
    localStorage.getItem("brewBloomCart")
) || [];


function saveCart() {

    localStorage.setItem(
        "brewBloomCart",
        JSON.stringify(cart)
    );

}


function formatPrice(price) {

    return `₹${Number(price).toLocaleString("en-IN")}`;

}


function updateCart() {

    saveCart();

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    <i class="fa-solid fa-bag-shopping"></i>
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add something delicious from our menu.
                </p>

                <button class="btn btn-primary"
                        id="startShopping">
                    Browse Menu
                </button>

            </div>
        `;

        const startShopping =
            document.getElementById("startShopping");

        if (startShopping) {

            startShopping.addEventListener(
                "click",
                () => {

                    closeCartSidebar();

                    document
                        .getElementById("menu")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        }

    } else {

        cartItems.innerHTML = cart.map(
            item => createCartItem(item)
        ).join("");

        attachCartEvents();

    }


    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );


    const tax = subtotal * 0.05;

    const total = subtotal + tax;


    cartSubtotal.textContent =
        formatPrice(subtotal);

    cartTax.textContent =
        formatPrice(tax);

    cartTotal.textContent =
        formatPrice(total);

}


function createCartItem(item) {

    return `

        <div class="cart-item">

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}">

            </div>


            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <div class="cart-item-price">
                    ${formatPrice(item.price)}
                </div>


                <div class="quantity-controls">

                    <button
                        class="decrease"
                        data-id="${item.id}">
                        <i class="fa-solid fa-minus"></i>
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="increase"
                        data-id="${item.id}">
                        <i class="fa-solid fa-plus"></i>
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                data-id="${item.id}"
                aria-label="Remove item">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>
    `;

}


function attachCartEvents() {

    document
        .querySelectorAll(".increase")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    const item =
                        cart.find(item => item.id === id);

                    if (item) {

                        item.quantity++;

                        updateCart();

                    }

                }
            );

        });


    document
        .querySelectorAll(".decrease")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    const item =
                        cart.find(item => item.id === id);

                    if (item) {

                        item.quantity--;

                        if (item.quantity <= 0) {

                            cart =
                                cart.filter(
                                    item => item.id !== id
                                );

                        }

                        updateCart();

                    }

                }
            );

        });


    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    cart =
                        cart.filter(
                            item => item.id !== id
                        );

                    updateCart();

                    showToast(
                        "Removed",
                        "Item removed from your cart."
                    );

                }
            );

        });

}


/* =========================================================
   ADD TO CART
   ========================================================= */

document
    .querySelectorAll(".add-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(".product-card");


                const id =
                    Number(card.dataset.id);

                const name =
                    card.dataset.name;

                const price =
                    Number(card.dataset.price);

                const image =
                    card.querySelector("img").src;


                const existingItem =
                    cart.find(item => item.id === id);


                if (existingItem) {

                    existingItem.quantity++;

                } else {

                    cart.push({

                        id,
                        name,
                        price,
                        image,
                        quantity: 1

                    });

                }


                updateCart();


                showToast(
                    "Added to cart",
                    `${name} has been added to your cart.`
                );


                button.innerHTML = `
                    Added
                    <i class="fa-solid fa-check"></i>
                `;


                setTimeout(() => {

                    button.innerHTML = `
                        Add to Cart
                        <i class="fa-solid fa-plus"></i>
                    `;

                }, 1200);

            }
        );

    });


/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function openCartSidebar() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


function closeCartSidebar() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


cartBtn.addEventListener(
    "click",
    openCartSidebar
);


closeCart.addEventListener(
    "click",
    closeCartSidebar
);


cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

menuToggle.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle("active");

        const icon =
            menuToggle.querySelector("i");


        if (navMenu.classList.contains("active")) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        }

    }
);


document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navMenu.classList.remove("active");

                const icon =
                    menuToggle.querySelector("i");

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            }
        );

    });


/* =========================================================
   HEADER SCROLL
   ========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }


        if (window.scrollY > 500) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    }
);


/* =========================================================
   BACK TO TOP
   ========================================================= */

backTop.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================================================
   THEME TOGGLE
   ========================================================= */

const savedTheme =
    localStorage.getItem("brewBloomTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeBtn.innerHTML =
        '<i class="fa-regular fa-sun"></i>';

}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark-mode");


        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        localStorage.setItem(
            "brewBloomTheme",
            isDark ? "dark" : "light"
        );


        themeBtn.innerHTML = isDark

            ? '<i class="fa-regular fa-sun"></i>'

            : '<i class="fa-regular fa-moon"></i>';

    }
);


/* =========================================================
   MENU FILTER
   ========================================================= */

const menuTabs =
    document.querySelectorAll(".menu-tab");

const products =
    document.querySelectorAll(".product-card");


menuTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            menuTabs.forEach(item =>
                item.classList.remove("active")
            );


            tab.classList.add("active");


            const category =
                tab.dataset.category;


            products.forEach(product => {

                const productCategory =
                    product.dataset.category;


                if (
                    category === "all" ||
                    category === productCategory
                ) {

                    product.classList.remove(
                        "hidden"
                    );

                } else {

                    product.classList.add(
                        "hidden"
                    );

                }

            });

        }
    );

});


/* =========================================================
   FAVORITES
   ========================================================= */

document
    .querySelectorAll(".favorite-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                button.classList.toggle("liked");


                const icon =
                    button.querySelector("i");


                if (
                    button.classList.contains("liked")
                ) {

                    icon.classList.remove(
                        "fa-regular"
                    );

                    icon.classList.add(
                        "fa-solid"
                    );

                    showToast(
                        "Favorite",
                        "Added to your favorites."
                    );

                } else {

                    icon.classList.remove(
                        "fa-solid"
                    );

                    icon.classList.add(
                        "fa-regular"
                    );

                }

            }
        );

    });


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(title, message) {

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(
        () => {

            toast.classList.remove("show");

        },
        3000
    );

}


closeToast.addEventListener(
    "click",
    () => {

        toast.classList.remove("show");

    }
);


/* =========================================================
   RESERVATION
   ========================================================= */

const reservationForm =
    document.getElementById(
        "reservationForm"
    );


reservationForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "reservationName"
            ).value.trim();


        showToast(
            "Reservation Confirmed",
            `Thank you ${name}! Your table request has been received.`
        );


        reservationForm.reset();

    }
);


/* =========================================================
   NEWSLETTER
   ========================================================= */

const newsletterForm =
    document.getElementById(
        "newsletterForm"
    );


newsletterForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        showToast(
            "Subscribed",
            "Welcome to the Brew & Bloom family!"
        );


        newsletterForm.reset();

    }
);


/* =========================================================
   SPECIAL ORDER
   ========================================================= */

document
    .getElementById("specialOrder")
    .addEventListener(
        "click",
        () => {

            const specialItem = {

                id: 100,
                name: "Weekend Brunch Board",
                price: 599,
                image:
                    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=85",
                quantity: 1

            };


            const existing =
                cart.find(
                    item => item.id === specialItem.id
                );


            if (existing) {

                existing.quantity++;

            } else {

                cart.push(specialItem);

            }


            updateCart();

            showToast(
                "Special Added",
                "Weekend Brunch Board added to your cart."
            );

            openCartSidebar();

        }
    );


/* =========================================================
   CHECKOUT
   ========================================================= */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast(
                "Cart Empty",
                "Please add some items before checkout."
            );

            return;

        }


        showToast(
            "Checkout",
            "Demo checkout started successfully."
        );

    }
);


/* =========================================================
   TESTIMONIALS
   ========================================================= */

const testimonials = [

    {
        text:
            "The best coffee I've had in years! The atmosphere is beautiful, the staff is incredibly friendly, and their caramel macchiato is absolutely amazing.",
        name:
            "Aarav Sharma",
        role:
            "Regular Customer",
        initials:
            "AS"
    },

    {
        text:
            "Brew & Bloom has become my favorite place to work. Great coffee, peaceful atmosphere and genuinely wonderful service.",
        name:
            "Meera Patel",
        role:
            "Coffee Lover",
        initials:
            "MP"
    },

    {
        text:
            "Their desserts are incredible and the cappuccino is perfect every single time. Definitely one of the best cafés around.",
        name:
            "Rohan Mehta",
        role:
            "Food Enthusiast",
        initials:
            "RM"
    }

];


let currentTestimonial = 0;


const testimonialText =
    document.getElementById(
        "testimonialText"
    );


const customerName =
    document.getElementById(
        "customerName"
    );


const customerAvatar =
    document.querySelector(
        ".customer-avatar"
    );


const testimonialDots =
    document.getElementById(
        "testimonialDots"
    );


function createTestimonialDots() {

    testimonialDots.innerHTML =
        testimonials.map(
            (_, index) => `
                <span
                    class="testimonial-dot ${
                        index === 0
                            ? "active"
                            : ""
                    }">
                </span>
            `
        ).join("");

}


function showTestimonial(index) {

    currentTestimonial =
        (index + testimonials.length) %
        testimonials.length;


    const testimonial =
        testimonials[currentTestimonial];


    testimonialText.textContent =
        `"${testimonial.text}"`;

    customerName.textContent =
        testimonial.name;

    customerAvatar.textContent =
        testimonial.initials;


    document
        .querySelectorAll(".testimonial-dot")
        .forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentTestimonial
            );

        });

}


createTestimonialDots();


document
    .getElementById("prevTestimonial")
    .addEventListener(
        "click",
        () => {

            showTestimonial(
                currentTestimonial - 1
            );

        }
    );


document
    .getElementById("nextTestimonial")
    .addEventListener(
        "click",
        () => {

            showTestimonial(
                currentTestimonial + 1
            );

        }
    );


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   ACTIVE NAV LINK
   ========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;


            if (
                window.scrollY >= sectionTop
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        document
            .querySelectorAll(".nav-link")
            .forEach(link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute("href") ===
                    `#${current}`
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            });

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

updateCart();

console.log(
    "☕ Brew & Bloom Cafe Website Loaded Successfully!"
);