
const cartBtn =document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confrim");

function showModal(){
  backdrop.style.display ="block";
  cartModal.style.opacity = "1"
  cartModal.style.top= "20%";
}
function closeModalFunction(){
  backdrop.style.display ="none";
  cartModal.style.opacity ="0";
  cartModal.style.top="-100%";
}
cartBtn.addEventListener("click",showModal);
closeModal.addEventListener("click",closeModalFunction);
backdrop.addEventListener("click",closeModalFunction);