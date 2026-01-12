const APP_URL = "https://script.google.com/macros/s/AKfycbyj4yPuQyJkLjy8kpXRs1cZZ3rZmxHSKwKTG6KHzLQ2QtpcJWw8q_bMW5esfYvhVAWQ/exec";

/* ---------- helpers ---------- */
function hideBroken(img){img.onerror=()=>img.style.display="none";}
function qs(k){return new URLSearchParams(location.search).get(k);}

/* ---------- banners ---------- */
async function loadBanners(){
  const r = await fetch(APP_URL+"?action=banners");
  const d = await r.json();
  const s = document.getElementById("slides");
  if(!s) return;
  s.innerHTML = d.map(b=>`
    <div class="slide"><img src="${b.image}"></div>
  `).join("");
  setInterval(()=>{s.appendChild(s.firstElementChild)},4000);
}

/* ---------- products ---------- */
async function getProducts(){
  const r = await fetch(APP_URL+"?action=products");
  return await r.json();
}

function productCard(p){
  return `
  <a href="product.html?id=${p.id}" class="card">
    <img src="${p.images[0]||""}" onerror="hideBroken(this)">
    <div class="info">${p.name}<br><span class="price">₹${p.price}</span></div>
  </a>`;
}

/* ---------- product page ---------- */
async function loadProduct(){
  const id = qs("id");
  if(!id) return;
  const r = await fetch(APP_URL+"?action=product&id="+id);
  const p = await r.json();

  nameEl.textContent = p.name;
  priceEl.textContent = "₹"+p.price;
  descEl.textContent = p.desc;

  mainImg.innerHTML = `<img src="${p.images[0]}" onerror="hideBroken(this)">`;
  thumbs.innerHTML = p.images.map(i=>`
    <img src="${i}" onclick="mainImg.innerHTML='<img src=\\'${i}\\'>'">
  `).join("");

  localStorage.setItem("cart",JSON.stringify(p));
}

/* ---------- order ---------- */
function placeOrder(){
  const n=name.value.trim(), ph=phone.value.trim(),
        a=address.value.trim(), c=city.value.trim(),
        z=pincode.value.trim();
  if(!n||!ph||!a||!c||!z){alert("All fields required");return;}

  const item=JSON.parse(localStorage.getItem("cart"));
  const msg=`New Order
Name: ${n}
Phone: ${ph}
Address: ${a}, ${c} - ${z}
Total: ₹${item.price}`;

  window.open("https://wa.me/919847420195?text="+encodeURIComponent(msg),"_blank");

  fetch(APP_URL+"?"+new URLSearchParams({
    action:"order", phone:ph, name:n,
    address:a, city:c, pincode:z,
    items:item.name, total:item.price
  }));
}
