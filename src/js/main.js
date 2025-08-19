import ShopBullet from "./modules/shopBullet";

const allShopBullets = document.querySelectorAll(".shopBullet");
allShopBullets.forEach((shopBullet) => {
  new ShopBullet(shopBullet, {       
    lazyLoad: true,
    bulletHover: 'red',
  });
});
