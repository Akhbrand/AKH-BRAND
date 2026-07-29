const cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderItems = document.getElementById("orderItems");
const totalPrice = document.getElementById("totalPrice");
const totalItems = document.getElementById("totalItems");

let total = 0;
let itemsCount = 0;

if (cart.length === 0) {

    orderItems.innerHTML = `
    <div class="orderCard">
        <div class="orderInfo">
            <h3>🛒 السلة فارغة</h3>
            <p>أضف منتجات أولاً.</p>
        </div>
    </div>
    `;

    totalPrice.textContent = "0 EGP";

    if (totalItems) {
        totalItems.textContent = "0";
    }

} else {

    let html = "";

    cart.forEach(product => {

        const image = Array.isArray(product.image)
            ? product.image[0]
            : product.image;

        let imagePath = image;

        if (image && !String(image).startsWith("http")) {
            imagePath = "./images/" + image;
        }

        const price = Number(
            String(product.price).replace(/[^\d.]/g, "")
        ) || 0;

        const quantity = product.quantity || 1;

        const itemTotal = price * quantity;

        total += itemTotal;

        itemsCount += quantity;

        html += `
        <div class="orderCard">

            <img src="${imagePath}" alt="${product.name}">

            <div class="orderInfo">

                <h3>${product.name}</h3>

                <p>سعر القطعة: ${price} EGP</p>

                <p>الكمية: ${quantity}</p>

                <p><strong>الإجمالي: ${itemTotal} EGP</strong></p>

                <p>المقاس: ${product.size}</p>

            </div>

        </div>
        `;

    });

    orderItems.innerHTML = html;

    totalPrice.textContent = total + " EGP";

    if (totalItems) {
        totalItems.textContent = itemsCount;
    }

}
document.getElementById("sendOrder").onclick = async () => {

    if (cart.length === 0) {
        alert("🛒 السلة فارغة");
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();
    const governorate = document.getElementById("customerGovernorate").value;
    const city = document.getElementById("customerCity").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const notes = document.getElementById("customerNotes").value.trim();

    if (!customerName || !customerPhone || !governorate || !city || !address) {
        alert("من فضلك أكمل جميع البيانات المطلوبة.");
        return;
    }

    const payment = document.querySelector(
        'input[name="payment"]:checked'
    ).value;

    const btn = document.getElementById("sendOrder");
    btn.disabled = true;
    btn.innerHTML = "⏳ جاري إرسال الطلب...";

    try {

        const { initializeApp } = await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
        );

        const {
            getFirestore,
            collection,
            addDoc
        } = await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
        );

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

        await addDoc(collection(db, "orders"), {
            customerName,
            customerPhone,
            governorate,
            city,
            address,
            notes,
            payment,
            products: cart,
            total,
            totalItems: itemsCount,
            status: "جديد",
            createdAt: new Date().toISOString()
        });

        localStorage.removeItem("cart");

        alert("✅ تم إرسال الطلب بنجاح");

        window.location.href = "index.html";

    } catch (error) {

        console.error(error);

        alert("❌ حدث خطأ أثناء إرسال الطلب.");

        btn.disabled = false;
        btn.innerHTML = "✅ تأكيد الطلب";
    }

};
