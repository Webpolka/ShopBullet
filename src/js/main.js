import ShopBullet from "./modules/shopBullet";
/*------------------------------------------------------------------------------------------------------------------
Init All ShopBullets
--------------------------------------------------------------------------------------------------------------------*/
const allShopBullets = document.querySelectorAll(".shopBullet");
allShopBullets.forEach((shopBullet) => {
  new ShopBullet(shopBullet, {       
    lazyLoad: true,
    bulletHover: 'red',
  });
});