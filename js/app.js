import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =====================================================
   FIREBASE
===================================================== */

const firebaseConfig = {

    apiKey: "AIzaSyBpFVpOyPfS9C7b8Hit2NpAtcK4k-DeTPw",

    authDomain: "akh-brand.firebaseapp.com",

    projectId: "akh-brand",

    storageBucket: "akh-brand.firebasestorage.app",

    messagingSenderId: "671562968837",

    appId: "1:671562968837:web:06557b3ab756696cf5116c",

    measurementId: "G-L1HPJ8PYMJ"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* =====================================================
   ELEMENTS
===================================================== */

const productsBox =
    document.getElementById("products");

const searchInput =
    document.getElementById("searchInput");

const cartCount =
    document.getElementById("cartCount");

const favCount =
    document.getElementById("favCount");


/* =====================================================
   LOCAL STORAGE
===================================================== */

let cart = [];

let favorites = [];


try {

    cart =
        JSON.parse(localStorage.getItem("cart")) || [];

} catch (error) {

    console.error("Cart Storage Error:", error);

    cart = [];

}


try {

    favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

} catch (error) {

    console.error("Favorites Storage Error:", error);

    favorites = [];

}


/* =====================================================
   COUNTERS
===================================================== */

function updateCartCount() {

    let total = 0;

    cart.forEach(item => {

        total += Number(item.quantity) || 1;

    });

    if (cartCount) {

        cartCount.innerHTML = total;

    }

}


function updateFavoriteCount() {

    if (favCount) {

        favCount.innerHTML = favorites.length;

    }

}


updateCartCount();

updateFavoriteCount();


/* =====================================================
   TOAST
===================================================== */

function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");

    if (!toast) return;


    toast.className =
        "toast " + type;

    toast.innerHTML =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


/* =====================================================
   OPEN PRODUCT
===================================================== */

window.openProduct = function(code) {

    location.href =
        "product.html?id=" +
        encodeURIComponent(code);

};


/* =====================================================
   ADD TO CART
===================================================== */

window.addToCart = function(product) {

    if (!product) return;


    let existing =
        cart.find(
            item =>
                String(item.code) ===
                String(product.code)
        );


    if (existing) {

        existing.quantity =
            (Number(existing.quantity) || 1) + 1;

    } else {

        product.quantity = 1;

        cart.push(product);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showToast(
        "🛒 تم إضافة المنتج للسلة"
    );

};


/* =====================================================
   FAVORITES
===================================================== */

window.toggleFavorite = function(product) {

    if (!product) return;


    const index =
        favorites.findIndex(
            item =>
                String(item.code) ===
                String(product.code)
        );


    if (index > -1) {

        favorites.splice(index, 1);


        showToast(
            "💔 تمت الإزالة من المفضلة",
            "warning"
        );

    } else {

        favorites.push(product);


        showToast(
            "❤️ تمت الإضافة للمفضلة",
            "success"
        );

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    updateFavoriteCount();


    document
        .querySelectorAll(".favoriteBtn")
        .forEach(btn => {

            if (
                String(btn.dataset.code) ===
                String(product.code)
            ) {

                const active =
                    favorites.some(
                        item =>
                            String(item.code) ===
                            String(product.code)
                    );


                btn.classList.toggle(
                    "favoriteActive",
                    active
                );


                btn.innerHTML =
                    active
                        ? "❤️"
                        : "🤍";

            }

        });

};


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    if (!productsBox) {

        console.error(
            "❌ Element #products غير موجود في index.html"
        );

        return;

    }


    /* -------------------------------------------------
       Loading Message
    ------------------------------------------------- */

    productsBox.innerHTML = `

        <div class="productsLoading">

            جاري تحميل المنتجات...

        </div>

    `;


    try {

        console.log(
            "🔥 جاري الاتصال بـ Firestore..."
        );


        const snapshot =
            await getDocs(
                collection(db, "products")
            );


        console.log(
            "✅ تم الاتصال بـ Firestore"
        );


        console.log(
            "عدد المنتجات:",
            snapshot.size
        );


        /* -------------------------------------------------
           No Products
        ------------------------------------------------- */

        if (snapshot.empty) {

            productsBox.innerHTML = `

                <div class="productsEmpty">

                    <div style="font-size:50px;">
                        🛍️
                    </div>

                    <h2>
                        لا توجد منتجات حالياً
                    </h2>

                    <p>
                        سيتم إضافة المنتجات قريباً
                    </p>

                </div>

            `;

            return;

        }


        let productsHTML = "";


        /* -------------------------------------------------
           LOOP PRODUCTS
        ------------------------------------------------- */

        snapshot.forEach(doc => {

            try {

                const product =
                    doc.data();


                console.log(
                    "📦 Product:",
                    product
                );


                /* -----------------------------------------
                   PRODUCT CODE
                ----------------------------------------- */

                const productCode =
                    product.code ??
                    doc.id;


                /* -----------------------------------------
                   PRODUCT NAME
                ----------------------------------------- */

                const productName =
                    product.name ??
                    "منتج AKH BRAND";


                /* -----------------------------------------
                   PRODUCT PRICE
                ----------------------------------------- */

                const productPrice =
                    product.price ??
                    "";


                /* -----------------------------------------
                   IMAGES
                ----------------------------------------- */

                let imgs = [];


                if (
                    Array.isArray(product.image)
                ) {

                    imgs =
                        product.image.filter(
                            img =>
                                typeof img === "string" &&
                                img.trim() !== ""
                        );

                } else if (
                    typeof product.image === "string" &&
                    product.image.trim() !== ""
                ) {

                    imgs = [
                        product.image
                    ];

                }


                /* -----------------------------------------
                   FALLBACK IMAGE
                ----------------------------------------- */

                if (imgs.length === 0) {

                    imgs = [
                        "https://akhbrand.github.io/AKH-BRAND/images/VideoToGif_GIF.gif"
                    ];

                }


                /* -----------------------------------------
                   BUILD IMAGES
                ----------------------------------------- */

                let images = "";

                let dots = "";


                imgs.forEach(
                    (img, index) => {

                        const imagePath =
                            img.startsWith("http")
                                ? img
                                : "./images/" + img;


                        images += `

                            <img
                                src="${imagePath}"
                                loading="lazy"
                                alt="${productName}"
                                onerror="this.src='https://akhbrand.github.io/AKH-BRAND/images/VideoToGif_GIF.gif'"
                            >

                        `;


                        dots += `

                            <span
                                class="dot ${index === 0 ? "active" : ""}">
                            </span>

                        `;

                    }
                );


                /* -----------------------------------------
                   FAVORITE
                ----------------------------------------- */

                const isFavorite =
                    favorites.some(
                        item =>
                            String(item.code) ===
                            String(productCode)
                    );


                /* -----------------------------------------
                   AVAILABLE
                ----------------------------------------- */

                const available =
                    product.available !== false;


                /* -----------------------------------------
                   WHATSAPP
                ----------------------------------------- */

                const whatsappText =
                    encodeURIComponent(
                        `مرحباً، أريد طلب ${productName} - كود ${productCode}`
                    );


                /* -----------------------------------------
                   PRODUCT CARD
                ----------------------------------------- */

                productsHTML += `

                    <div
                        class="card"
                        onclick="openProduct('${String(productCode).replace(/'/g, "\\'")}')"
                    >

                        ${
                            !available
                                ? `
                                    <div class="soldOutBadge">
                                        SOLD OUT
                                    </div>
                                `
                                : ""
                        }


                        <div
                            class="favoriteBtn
                            ${isFavorite ? "favoriteActive" : ""}"
                            data-code="${productCode}"
                            onclick='
                                event.stopPropagation();
                                event.preventDefault();
                                toggleFavorite(${JSON.stringify(product)})
                            '
                        >

                            ${
                                isFavorite
                                    ? "❤️"
                                    : "🤍"
                            }

                        </div>


                        <div class="gallery">

                            <div class="slider">

                                ${images}

                            </div>


                            <div class="dots">

                                ${dots}

                            </div>

                        </div>


                        <div class="info">

                            <h2>
                                ${productName}
                            </h2>


                            <div class="price">
                                ${productPrice}
                            </div>


                            <p class="productCode">
                                Code : ${productCode}
                            </p>


                            ${
                                !available
                                    ? `

                                        <button
                                            class="cartBtn soldBtn"
                                            onclick="event.stopPropagation();"
                                            disabled
                                        >

                                            ❌ نفد المخزون

                                        </button>

                                    `
                                    : `

                                        <button
                                            class="cartBtn"
                                            onclick='
                                                event.stopPropagation();
                                                event.preventDefault();
                                                addToCart(${JSON.stringify(product)})
                                            '
                                        >

                                            🛒 أضف للسلة

                                        </button>

                                    `
                            }


                            <a
                                class="btn"
                                onclick="event.stopPropagation()"
                                href="https://wa.me/201097521334?text=${whatsappText}"
                            >

                                اطلب الآن واتساب

                            </a>


                        </div>

                    </div>

                `;


            } catch (productError) {

                console.error(
                    "❌ خطأ في منتج:",
                    productError,
                    doc.id
                );

            }

        });


        /* -------------------------------------------------
           RENDER
        ------------------------------------------------- */

        productsBox.innerHTML =
            productsHTML;


        console.log(
            "✅ تم عرض المنتجات بنجاح"
        );


        /* -------------------------------------------------
           SEARCH
        ------------------------------------------------- */

        setupSearch();


        /* -------------------------------------------------
           SLIDER
        ------------------------------------------------- */

        setupSliders();


    } catch (error) {

        console.error(
            "❌ FIREBASE ERROR:",
            error
        );


        productsBox.innerHTML = `

            <div class="productsError">

                <div style="font-size:50px;">
                    ⚠️
                </div>

                <h2>
                    حدث خطأ أثناء تحميل المنتجات
                </h2>

                <p>
                    ${error.message || "تعذر الاتصال بقاعدة البيانات"}
                </p>

                <button
                    onclick="location.reload()"
                    class="cartBtn"
                >

                    🔄 إعادة المحاولة

                </button>

            </div>

        `;

    }

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        function() {

            const value =
                this.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(".card")
                .forEach(card => {

                    const text =
                        card.innerText
                            .toLowerCase();


                    card.style.display =
                        text.includes(value)
                            ? ""
                            : "none";

                });

        }
    );

}


/* =====================================================
   IMAGE SLIDER
===================================================== */

function setupSliders() {

    document
        .querySelectorAll(".slider")
        .forEach(slider => {

            const images =
                slider.querySelectorAll("img");


            if (images.length <= 1) return;


            let current = 0;


            images.forEach(
                (img, index) => {

                    img.style.display =
                        index === 0
                            ? "block"
                            : "none";

                }
            );


            setInterval(() => {

                images[current]
                    .style.display = "none";


                current++;


                if (
                    current >= images.length
                ) {

                    current = 0;

                }


                images[current]
                    .style.display = "block";


            }, 2500);

        });

}


/* =====================================================
   START
===================================================== */

loadProducts();
