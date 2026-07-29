const cart = JSON.parse(localStorage.getItem("cart")) || [];

const box = document.getElementById("cartItems");

if (cart.length === 0) {
    box.innerHTML = `
        <div class="card">
            <div class="info">
                <h2>🛒 السلة فارغة</h2>
                <p>أضف منتجات أولاً من الصفحة الرئيسية.</p>
            </div>
        </div>
    `;
} else {

    cart.forEach(product => {

        const image = Array.isArray(product.image)
            ? product.image[0]
            : product.image;

        box.innerHTML += `
        <div class="card">

            <div class="gallery">
                <img src="${image}" alt="${product.name}">
            </div>

            <div class="info">

                <h2>${product.name}</h2>

                <div class="price">
                    ${product.price}
                </div>

                <p>الخامة: ${product.material}</p>
                <p>المقاس: ${product.size}</p>

            </div>

        </div>
        `;
    });

}
