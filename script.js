document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        if (body.classList.contains('dark-theme')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Carousel
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (n + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });

    const resetInterval = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    };

    slideInterval = setInterval(nextSlide, 5000);

    // Menu Filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = '#fff';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        }
    });

    // Shopping Cart Logic
    let cart = [];
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Toggle Cart
    const toggleCart = () => {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    };

    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Add To Cart
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemEl = btn.closest('.menu-item');
            const id = itemEl.getAttribute('data-id');
            const name = itemEl.getAttribute('data-name');
            const price = parseInt(itemEl.getAttribute('data-price'));
            const img = itemEl.querySelector('img').src;

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            updateCartUI();

            // Animation for feedback
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = '#2ecc71';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-plus"></i>';
                btn.style.background = '#D4AF37';
            }, 1000);
        });
    });

    const updateCartUI = () => {
        // Update Count
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;

        // Update List
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Savat bo\'sh</p>';
            totalPriceEl.textContent = '0 so\'m';
        } else {
            cartItemsContainer.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                total += item.price * item.quantity;
                const itemHtml = `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">${item.quantity} x ${item.price.toLocaleString()} so'm</p>
                            <span class="cart-item-remove" onclick="window.removeFromCart('${item.id}')">O'chirish</span>
                        </div>
                    </div>
                `;
                cartItemsContainer.innerHTML += itemHtml;
            });

            totalPriceEl.textContent = total.toLocaleString() + " so'm";
        }
    };

    // Global function to remove item
    window.removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };

    // Checkout / Telegram Redirect
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Savat bo\'sh! Iltimos, shirinlik tanlang.');
            return;
        }

        let message = "🍰 *Yangi Buyurtma (Cake Mill)* 🍰\n\n";
        let total = 0;

        cart.forEach(item => {
            message += `🛒 ${item.name}\n   └ ${item.quantity} dona x ${item.price.toLocaleString()} = ${(item.price * item.quantity).toLocaleString()} so'm\n`;
            total += item.price * item.quantity;
        });

        message += `\n────────────────────\n💰 *Jami: ${total.toLocaleString()} so'm*\n────────────────────\n✨ Buyurtmani tasdiqlash uchun xabarni yuboring.`;

        const encodedMessage = encodeURIComponent(message);
        const telegramLink = `https://t.me/cakemill_uz?text=${encodedMessage}`;

        window.open(telegramLink, '_blank');
    });

    // Scroll Reveal
    const revealElements = () => {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealElements);
    revealElements(); // Run once on load

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll background
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});