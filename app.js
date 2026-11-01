const P = [
  ["Fresh Milk","🥛","Dairy","500 ml",28],
  ["Amul Butter","🧈","Dairy","100 g",58],
  ["Paneer","🧀","Dairy","200 g",90],
  ["Curd","🍶","Dairy","400 g",45],
  ["Banana","🍌","Fruits & veg","6 pcs",42],
  ["Apple","🍎","Fruits & veg","4 pcs",120],
  ["Tomato","🍅","Fruits & veg","500 g",30],
  ["Onion","🧅","Fruits & veg","1 kg",38],
  ["Bread","🍞","Bakery","400 g",45],
  ["Croissant","🥐","Bakery","2 pcs",80],
  ["Potato Chips","🍟","Snacks","90 g",30],
  ["Chocolate","🍫","Snacks","50 g",60],
  ["Biscuits","🍪","Snacks","150 g",35],
  ["Cola","🥤","Drinks","750 ml",40],
  ["Orange Juice","🧃","Drinks","1 L",110],
  ["Tea","🍵","Drinks","250 g",140],
  ["Eggs","🥚","Staples","12 pcs",84],
  ["Rice","🍚","Staples","5 kg",420],
  ["Noodles","🍜","Staples","280 g",56]
].map((p, i) => ({ id: i, name: p[0], e: p[1], cat: p[2], qty: p[3], price: p[4] }));

const cats = ["All", ...new Set(P.map(p => p.cat))];
let cat = "All", term = "", cart = {};
try { cart = JSON.parse(localStorage.getItem("cart") || "{}"); } catch (e) {}
const $ = id => document.getElementById(id);

function ctl(id) {
  const n = cart[id] || 0;
  if (n) return `<div class="step"><button data-d="-1" data-id="${id}">−</button><span>${n}</span><button data-d="1" data-id="${id}">+</button></div>`;
  return `<button class="add" data-d="1" data-id="${id}">Add</button>`;
}

function renderCats() {
  $("cats").innerHTML = cats.map(c => `<button class="${c === cat ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
}

function renderGrid() {
  const list = P.filter(p => (cat === "All" || p.cat === cat) && p.name.toLowerCase().includes(term));
  $("grid").innerHTML = list.length
    ? list.map(p => `<div class="card"><div class="pic">${p.e}</div><div class="time">10 mins</div><div class="name">${p.name}</div><div class="qty">${p.qty}</div><div class="row"><span class="price">₹${p.price}</span>${ctl(p.id)}</div></div>`).join("")
    : `<div class="empty">No products found.</div>`;
}

function renderCart() {
  const ids = Object.keys(cart).filter(k => cart[k] > 0);
  const count = ids.reduce((s, k) => s + cart[k], 0);
  $("cartBtn").textContent = `Cart (${count})`;
  $("items").innerHTML = ids.length
    ? ids.map(k => { const p = P[k]; return `<div class="item"><span class="e">${p.e}</span><div class="t">${p.name}<div class="qty">${p.qty} · ₹${p.price}</div></div>${ctl(k)}</div>`; }).join("")
    : `<div class="empty">Your cart is empty.</div>`;
  const sub = ids.reduce((s, k) => s + P[k].price * cart[k], 0);
  const fee = sub && sub < 199 ? 25 : 0;
  const hand = sub ? 4 : 0;
  $("bill").innerHTML = ids.length
    ? `<div><span>Items total</span><span>₹${sub}</span></div>
       <div><span>Delivery fee</span><span>${fee ? "₹" + fee : "Free"}</span></div>
       <div><span>Handling fee</span><span>₹${hand}</span></div>
       <div class="tot"><span>To pay</span><span>₹${sub + fee + hand}</span></div>
       <button class="pay" id="pay">Place order</button>`
    : "";
  try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {}
}

function render() { renderGrid(); renderCart(); }

document.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.d) {
    const id = b.dataset.id;
    cart[id] = Math.max(0, (cart[id] || 0) + Number(b.dataset.d));
    if (!cart[id]) delete cart[id];
    render();
  } else if (b.dataset.c) {
    cat = b.dataset.c; renderCats(); renderGrid();
  } else if (b.id === "cartBtn") {
    $("drawer").classList.add("open");
  } else if (b.id === "close") {
    $("drawer").classList.remove("open");
  } else if (b.id === "pay") {
    cart = {}; render();
    $("drawer").classList.remove("open");
    toast("Order placed. Arriving in 10 minutes.");
  }
});

$("q").addEventListener("input", e => { term = e.target.value.toLowerCase().trim(); renderGrid(); });

function toast(m) {
  const t = $("toast");
  t.textContent = m; t.style.display = "block";
  setTimeout(() => t.style.display = "none", 2500);
}

renderCats();
render();