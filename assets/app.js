const qs = q => document.querySelector(q);
const qsa = q => document.querySelectorAll(q);

// assets/app.js (top)
const APP_URL = "https://script.google.com/macros/s/AKfycbyj4yPuQyJkLjy8kpXRs1cZZ3rZmxHSKwKTG6KHzLQ2QtpcJWw8q_bMW5esfYvhVAWQ/exec";

function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function isLoggedIn() {
  return sessionStorage.getItem("phone");
}

function requireLogin(next) {
  if (!isLoggedIn()) {
    location.href = "login.html?next=" + (next || location.pathname);
    return false;
  }
  return true;
}

/* PRODUCTS */
async function loadProducts(target) {
  const res = await fetch(`${APP_URL}?action=products`);
  const data = await res.json();

  target.innerHTML = data.map(p => `
    <a class="card" href="product.html?id=${p[0]}">
      <img src="${p[6] || ''}">
      <div class="info">
        <h3>${p[1]}</h3>
        <div class="price">₹${p[2]}</div>
      </div>
    </a>
  `).join("");
}

/* PRODUCT PAGE */
async function loadProduct() {
  const id = getParam("id");
  if (!id) return;

  const res = await fetch(`${APP_URL}?action=product&id=${id}`);
  const p = await res.json();

  qs("#title").innerText = p[1];
  qs("#price").innerText = "₹" + p[2];
  qs("#desc").innerText = p[3];

  const images = p.slice(6, 20).filter(Boolean);
  const video = p[20];

  const main = qs("#main");
  const thumbs = qs("#thumbs");

  function show(el) { main.innerHTML = ""; main.appendChild(el); }

  images.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onclick = () => show(img.cloneNode());
    thumbs.appendChild(img);
    if (i === 0) show(img.cloneNode());
  });

  if (video) {
    const v = document.createElement("video");
    v.src = video; v.controls = true;
    thumbs.appendChild(v);
  }
}

/* CART */
async function placeOrder() {
  const name = qs("#name").value.trim();
  const phone = qs("#phone").value.trim();
  const address = qs("#address").value.trim();
  const city = qs("#city").value.trim();
  const pincode = qs("#pincode").value.trim();

  if (!name || !phone || !address || !city || !pincode) {
    alert("All fields are required");
    return;
  }

  const items = sessionStorage.getItem("cartItems") || "";
  const total = sessionStorage.getItem("cartTotal") || "";

  const url = `${APP_URL}?action=order&name=${encodeURIComponent(name)}&phone=${phone}&address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&pincode=${pincode}&items=${encodeURIComponent(items)}&total=${total}`;
  await fetch(url);
}

/* ORDERS */
async function loadOrders() {
  if (!requireLogin()) return;
  const phone = sessionStorage.getItem("phone");
  const res = await fetch(`${APP_URL}?action=orders&phone=${phone}`);
  const data = await res.json();

  qs("#orders").innerHTML = data.map(o => `
    <div class="order-card">
      <b>Order:</b> ${o.orderId}<br>
      <b>Date:</b> ${o.date}<br>
      <b>Items:</b> ${o.items}<br>
      <b>Total:</b> ₹${o.total}<br>
      <b>Status:</b> ${o.status}<br>
      <b>Address:</b> ${o.address}
      <br><br>
      <a href="https://wa.me/919847420195?text=Reorder ${o.orderId}" target="_blank">Reorder on WhatsApp</a>
    </div>
  `).join("");
}
