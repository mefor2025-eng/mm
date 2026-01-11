const API = "https://script.google.com/macros/s/AKfycbyj4yPuQyJkLjy8kpXRs1cZZ3rZmxHSKwKTG6KHzLQ2QtpcJWw8q_bMW5esfYvhVAWQ/exec";

function loadProducts(target, featured=false) {
  fetch(API + "?action=products")
    .then(r => r.json())
    .then(data => {
      document.getElementById(target).innerHTML = data.map(p => `
        <div class="card" onclick="location.href='product.html?id=${p[0]}'">
          <img src="${p[6]}">
          <h4>${p[1]}</h4>
          <p>₹${p[2]}</p>
        </div>
      `).join("");
    });
}

function loadProduct() {
  const id = new URLSearchParams(location.search).get("id");
  fetch(API + "?action=product&id=" + id)
    .then(r => r.json())
    .then(p => {
      document.getElementById("name").innerText = p[1];
      document.getElementById("price").innerText = "₹" + p[2];
      document.getElementById("desc").innerText = p[3];

      const images = p.slice(6, 20).filter(Boolean);
      document.getElementById("mainImage").src = images[0];

      document.getElementById("thumbs").innerHTML = images.map(i =>
        `<img src="${i}" onclick="document.getElementById('mainImage').src='${i}'">`
      ).join("");

      localStorage.setItem("product", JSON.stringify(p));
    });
}

function addToCart() {
  localStorage.setItem("cart", localStorage.getItem("product"));
  location.href = "cart.html";
}

function placeOrder() {
  const name = name.value;
  const phone = phone.value;
  const address = address.value;
  const city = city.value;
  const pincode = pincode.value;

  if (!name || !phone || !address || !pincode) {
    alert("All fields required");
    return;
  }

  const product = JSON.parse(localStorage.getItem("cart"));
  const msg = `New Order\nName: ${name}\nPhone: ${phone}\nAddress: ${address}, ${city} - ${pincode}\nTotal: ₹${product[2]}`;

  window.open(`https://wa.me/919847420195?text=${encodeURIComponent(msg)}`);
}
