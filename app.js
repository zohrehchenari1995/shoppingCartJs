//---------------------------------------------------- selecting
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confrim");
const productsDom = document.querySelector(".products-total");
const cartFooter = document.querySelector(".cart-footer");
const cartItemNumber = document.querySelector(".cart-item-number");

//-----------------------------------------------------class(oop)
import { productsData } from "./products.js";
let cart = [];

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
            alt="productone"
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
    const addToCartBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtn];

    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      // check if this product id is in  cart or not
      const isInCart = cart.find((p) => {
        return p.id === id;
      });
      if (isInCart) {
        btn.innerText = "موجود درسبد خرید";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "موجود در سبدخرید";
        event.target.disabled = true;

        // get product from products:
        const addProduct = Storage.getProduct(id);
        // console.log(addProduct);
        // add to cart:
        cart = [...cart, { ...addProduct, quantity: 1 }];
        // save cart to localstorage:
        Storage.saveCart(cart);
        // update cart value:
        this.setCartValue(cart);
        // add to cart item:
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
    cartFooter.innerText =`قیمت کل:${totalPrice.toFixed(2)}میلیون تومان`;
    cartItemNumber.innerText = tempCartItems;
    console.log(tempCartItems);
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
}

// event
document.addEventListener("DOMContentLoaded", () => {
  const product = new Products();
  const productsData = product.getProducts();
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  Storage.saveProducts(productsData);
});

//-------------------------------------------------- cart item modal
function showModal() {
  backdrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}
function closeModalFunction() {
  backdrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}
cartBtn.addEventListener("click", showModal);
closeModal.addEventListener("click", closeModalFunction);
backdrop.addEventListener("click", closeModalFunction);
