const loadProducts = () => {
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => showProducts(data));
};
loadProducts();

// show all product in UI 
const showProducts = (products) => {
  const allProducts = products.map((pd) => pd);
  for (const product of allProducts) {
    const image = product.image;
    const div = document.createElement("div");

    // for making rating star 
    let floor_rate;
    let isInt;
    if(product.rating.rate % 1 === 0){
      floor_rate = product.rating.rate;
      isInt = true;
    }
    else{
      floor_rate = Math.floor(product.rating.rate);
      isInt = false;
    }
    let star = "";
    if (isInt){
      for(var i=1; i<=5; i++){
        if(i >floor_rate){
          star +=`<i class="far fa-star"></i>`
        }
        else{
          star +=`<i class="fas fa-star"></i>`
        }
      }
    }
    else{
      for(var i=1; i<=5; i++){
        if(i >floor_rate+1){
          star +=`<i class="far fa-star"></i>`
        }
        else if(i==floor_rate+1){
          star +=`<i class="fas fa-star-half-alt"></i>`
        }
        else{
          star +=`<i class="fas fa-star"></i>`
        }
      }
    }
    div.classList.add("product");
    div.innerHTML = `<div class="single-product rounded-md bg-white shadow">
      <div class="flex justify-center">
      <img class="product-image" src=${image}></img>
      </div>
      <h3 class="product-title text-5xl font-bold mb-4">${product.title}</h3>
      <div class="flex justify-around">
      <div class="mr-1">
      <div class="bg-green-100 px-6 py-4 rounded-lg shadow-sm">
      <p class="product-category text-2xl font-bold">Category:<hr/> ${product.category}</p>
      </div>
      <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now w-full bg-red-100 rounded-lg py-3 mt-4 hover:bg-red-200 font-bold">Add to Cart</button>

      <button id="details-btn" data-toggle="modal" data-target="#exampleModalCenter" onclick="getModal(${product.id})" class="w-full bg-red-400 hover:bg-red-500 rounded-lg py-3 mt-2 font-bold">Details</button>
      </div>

      <div class="bg-green-100 px-6 py-4 rounded-lg flex flex-col align-center justify-center shadow-sm">
      <p class="product-price p-3 shadow-lg text-2xl font-bold">Price: $${product.price}</p>
      <p class="p-3 shadow-lg text-2xl font-bold">Rating: ${product.rating.rate}<br>
      <span id="star-field">${star}</span>
      </p>
      <p class="p-3 shadow-lg text-2xl font-bold">Tot. Rating: ${product.rating.count}</p>
      </div>
      </div>
      </div>
      `;
    document.getElementById("all-products").appendChild(div);
  }
};

// get single product 
const getModal= (id) =>{
  const url = `https://fakestoreapi.com/products/${id}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => handleModal(data));
}

// set data in modal 
const handleModal = (data) =>{
  document.getElementById("modal-img").setAttribute("src", `${data.image}`);
  document.getElementById("modal-title").innerText = data.title;
  document.getElementById("modal-des").innerText = data.description;
  document.getElementById("modal-price").innerText = data.price;
  document.getElementById("modal-rate").innerHTML = `${data.rating.rate} <i class="fas fa-star"></i>`;
}
let count = 0;
const addToCart = (id, price) => {
  count = count + 1;
  updatePrice("price", price);
  updateTaxAndCharge();
  updateTotal();
  document.getElementById("total-Products").innerText = count;
};

const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = Math.round(value);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if (priceConverted > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", priceConverted * 0.2);
  }
  if (priceConverted > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", priceConverted * 0.3);
  }
  if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", priceConverted * 0.4);
  }
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal =
    getInputValue("price") + getInputValue("delivery-charge") +
    getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal.toFixed(2);
};
