const API="https://script.google.com/macros/s/AKfycbyj4yPuQyJkLjy8kpXRs1cZZ3rZmxHSKwKTG6KHzLQ2QtpcJWw8q_bMW5esfYvhVAWQ/exec";
const WA="https://wa.me/919847420195?text=";

function qs(k){return new URLSearchParams(location.search).get(k);}
function hideBroken(img){img.onerror=()=>img.style.display="none";}

/* ---------- Products ---------- */
async function loadProducts(target){
  const res=await fetch(API+"?action=products");
  const data=await res.json();
  target.innerHTML=data.map(p=>`
    <a class="card" href="product.html?id=${p.id}">
      <img src="${p.images[0]||""}" onerror="hideBroken(this)">
      <div class="info">${p.name}<br><span class="price">₹${p.price}</span></div>
    </a>
  `).join("");
}

/* ---------- Product ---------- */
async function loadProduct(){
  const id=qs("id");
  if(!id) return;
  const res=await fetch(API+"?action=product&id="+id);
  const p=await res.json();
  document.getElementById("name").innerText=p.name;
  document.getElementById("price").innerText="₹"+p.price;
  document.getElementById("desc").innerText=p.desc;

  const imgs=p.images.filter(Boolean);
  const main=document.getElementById("main");
  const thumbs=document.getElementById("thumbs");

  main.innerHTML=`<img src="${imgs[0]}" onerror="hideBroken(this)">`;
  thumbs.innerHTML=imgs.map(i=>`<img src="${i}" onclick="main.innerHTML='<img src=\\'${i}\\'>'">`).join("");

  localStorage.setItem("cart",JSON.stringify(p));
}

/* ---------- WhatsApp Order ---------- */
function placeOrder(){
  const n=name.value.trim(), p=phone.value.trim(),
        a=address.value.trim(), c=city.value.trim(),
        z=pincode.value.trim();
  if(!n||!p||!a||!c||!z){alert("All fields required");return;}

  const item=JSON.parse(localStorage.getItem("cart"));
  const msg=`New Order
Name: ${n}
Phone: ${p}
Address: ${a}, ${c} - ${z}
Total: ₹${item.price}`;

  window.open(WA+encodeURIComponent(msg),"_blank");

  fetch(API+"?"+new URLSearchParams({
    action:"order", phone:p, name:n,
    address:a, city:c, pincode:z,
    items:item.name, total:item.price
  }));
}
