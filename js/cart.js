const cart = JSON.parse(localStorage.getItem("cart")) || [];

const box = document.getElementById("cartItems");

let total = 0;

if (cart.length === 0) {

    box.innerHTML = `
    <div class="card">
        <div class="info" style="text-align:center;padding:50px 25px;">

            <div style="font-size:70px;margin-bottom:15px;">
                🛒
            </div>

            <h2>السلة فارغة</h2>

            <p style="margin-top:15px;">
                لم تقم بإضافة أي منتجات بعد
            </p>

            <a href="index.html" class="btn">
                العودة للتسوق
            </a>

        </div>
    </div>
    `;

} else {

    cart.forEach((product, index) => {

        const qty = product.quantity || 1;

        const price = parseFloat(
            String(product.price).replace(/[^\d]/g, "")
        ) || 0;

        total += price * qty;

        const image = Array.isArray(product.image)
            ? product.image[0]
            : product.image;

        box.innerHTML += `
        <div class="card">

            <div class="cartImageBox">

                <img
                class="cartImage"
                src="${image}"
                alt="${product.name}">

            </div>

            <div class="info">

                <h2>${product.name}</h2>

                <div class="price">
                    ${product.price} EGP
                </div>

                <p>الخامة: ${product.material}</p>

                <p>المقاس: ${product.size}</p>

                <p>الكود: ${product.code}</p>

                <div class="qtyBox">

                    <button
                    class="qtyBtn"
                    onclick="changeQty(${index},-1)">
                    ➖
                    </button>

                    <span class="qtyNumber">
                    ${qty}
                    </span>

                    <button
                    class="qtyBtn"
                    onclick="changeQty(${index},1)">
                    ➕
                    </button>

                </div>

                <button
                class="deleteBtn"
                onclick="removeFromCart(${index})">

                🗑️ حذف المنتج

                </button>

            </div>

        </div>
        `;
    });

}

window.changeQty = function(index, change){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity =
    (cart[index].quantity || 1) + change;

    if(cart[index].quantity <= 0){

        cart.splice(index,1);

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();
};

window.removeFromCart = function(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

   cart.splice(index,1);

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

showToast(
"🗑️ تم حذف المنتج من السلة",
"warning"
);

setTimeout(()=>{

location.reload();

},800);
};

const totalBox = document.getElementById("totalPrice");

if(totalBox){

    totalBox.innerHTML =
    total + " EGP";

}

function showToast(message,type="success"){

const toast =
document.getElementById("toast");

if(!toast) return;

toast.className =
"toast " + type;

toast.innerHTML = message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2200);

}
