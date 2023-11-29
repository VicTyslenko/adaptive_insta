const burgerMenu = document.querySelector('.burger-menu');
const menu = document.querySelector('.header-menu');

burgerMenu.addEventListener('click',()=>{

  burgerMenu.classList.toggle('active');
  menu.classList.toggle('active');

})