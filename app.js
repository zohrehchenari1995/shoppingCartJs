import { productsData } from "./products.js";

//---------------------------------------------------- selecting
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDom = document.querySelector(".products-total");
const cartTotal = document.querySelector(".cart-total");
const cartItemNumber = document.querySelector(".cart-item-number");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

//-----------------------------------------------------class(oop)
let cart = [];
let buttonsDom =[];

// 1.get products
class Products {
  getProducts() {
    return productsData;
  }
}

// 2.display products(show products in ui)
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `
       <div class="product product-one product-detail">
          <img
            class="product-image"
            src=${item.imageUrl}
            alt="production"
          />
          <div class="product__up product__up-detail">
            <p class="product__title">${item.title}</p>
            <p class="product__price">${item.price}میلیون تومان</p>
            <div class="product__up-button">
              <button class="btn add-to-cart"  data-id=${item.id}>افزودن به سبد خرید</button>
            </div>
          </div>
        </div>
      `;
      productsDom.innerHTML = result;
    });
  }
  getAddToCartBtn() {
    const addToCartBtn = [...document.querySelectorAll(".add-to-cart")];
    buttonsDom = addToCartBtn;

    addToCartBtn.forEach((btn) => {
      const id = btn.dataset.id;
      // check if this product id is in  cart or not
     const isInCart = cart.find((p)=>{return parseInt(p.id) == parseInt(id)})
      if (isInCart) {
        btn.innerText = "موجود درسبد خرید";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "موجود در سبدخرید";
        event.target.disabled = true;

        // get product from products:
        const addProduct = {...Storage.getProduct(id),quantity:1};
        // console.log(addProduct);
        // add to cart:
        cart = [...cart, addProduct];
        // save cart to localstorage:
        Storage.saveCart(cart);
        // update cart value:
        this.setCartValue(cart);
        // add to cart item:
        this.addCartItem(addProduct);
      });
    });
  }
  setCartValue(cart) {
    // 1.cart items (tedad item in cart):
    // 2.cart total price:
    let tempCartItems =0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.price * curr.quantity;
    }, 0);
    cartTotal.innerText =`قیمت کل : ${totalPrice.toFixed(2)} میلیون تومان`;
    cartItemNumber.innerText = tempCartItems;
    // console.log(tempCartItems);
  }
  addCartItem(cartItem){
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
     <img
              class="cart-item-image"
              src="${cartItem.imageUrl}"/>
            <div class="cart-item-description">
              <h4>${cartItem.title}</h4>
              <h5>${cartItem.price} میلیون تومان </h5>
            </div>

             <div class="cart-item-controller">
              <i class="fas fa-chevron-up" data-id= ${cartItem.id}></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down" data-id= ${cartItem.id}></i>
              <i class="far fa-trash-alt" data-id = ${cartItem.id}></i>
              </div>

    `
    cartContent.appendChild(div);
  }
  setupApp(){
    // get cart from storage
     cart = Storage.getCart() || [];
    // add cartItem
    cart.forEach((cartItem)=>{
      return this.addCartItem(cartItem)
    });
    // setValues: price + item 
    this.setCartValue(cart);
  }

  cartLogic(){
    // clear cart 
    clearCart.addEventListener("click",()=>{
      return this.clearCart();
    })
  };

  clearCart(){
     // remove : (DRY)=>
      cart.forEach((cItem)=>this.removeItem(cItem.id));
      while(cartContent.children.length){
        cartContent.removeChild(cartContent.children[0]);
      }
      closeModalFunction();
  }

  removeItem(id){
    // update cart
    cart = cart.filter((cItem)=> cItem.id !== id);
    // update totalPrice & cart Item
    this.setCartValue(cart);
    // update storage
    Storage.saveCart(cart);
    // get add to cart btns =>(update text and disabled)
    this.getSingleBtn(id);
   
  }
  getSingleBtn(id){
    const button = buttonsDom.find((btn)=> parseInt(btn.dataset.id) === parseInt(id));
    button.innerText = "افزودن به سبد خرید";
    button.disabled = false;
  }
}

// 3.storage(save all products in localStorage)
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart(){
    return JSON.parse(localStorage.getItem("cart"));
  }
}

// event
document.addEventListener("DOMContentLoaded", () => {
  const product = new Products();
  const productsData = product.getProducts();
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  // set up :get cart and set up app:
  ui.setupApp();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

//-------------------------------------------------- cart item modal
function showModalFunction() {
  backdrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "0%";
}
function closeModalFunction() {
  backdrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}
cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backdrop.addEventListener("click", closeModalFunction);
