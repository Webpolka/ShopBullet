export default class ShopBullet {
  constructor(container, options) {
    this.container = container;
    this.options = Object.assign({
      imageSelector: ".shopBullet_images img",
      activeClass: "active",
      dotSelector: ".shopBullet_dot",
      lazyLoad: true,
      bulletHover: 'red',
      placeholderSrc:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      overlaySelector: ".shopBullet_overlay", // селектор для overlay
      overlayActiveClass: "active", // класс для overlay при наведении на последнюю картинку
    }, options);
    this.addDots();
    this.addPreloader();

    this.images = Array.from(
      container.querySelectorAll(this.options.imageSelector)
    );
    this.dots = Array.from(
      container.querySelectorAll(this.options.dotSelector)
    );
    this.overlay = container.querySelector(this.options.overlaySelector);
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.addPlaceholders();
    this.setupDots();
    this.setupImages();
    if (this.options.lazyLoad) {
      this.setupLazyLoading();
    }
    this.resizeListener();
  }

  addPlaceholders() {
    this.images.forEach((img, index) => {
      img.src = this.options.placeholderSrc;
    });
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width >= 1024) return "desktop";
    if (width >= 576) return "tablet";
    return "mobile";
  }

  setupImages() {
    const deviceType = this.getDeviceType();

    this.images.forEach((img, index) => {
      if (index === 0) {
        img.classList.add(this.options.activeClass);
        const src = img.dataset[`src_${deviceType}`] || img.dataset.src;
        if (src) {
          img.src = src;
        }
      } else {
        img.classList.remove(this.options.activeClass);
        if (this.options.lazyLoad && img.src === this.options.placeholderSrc) {
          const src = img.dataset[`src_${deviceType}`] || img.dataset.src;
          if (src) {
            img.src = src;
          }
        }
      }
    });
  }

  setupDots() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener("mouseenter", () => {
        this.showImage(index);
      });
      dot.addEventListener("mouseleave", () => {
        this.hideOverlay(index);
      });
    });
  }

  resizeListener() {
    window.addEventListener("resize", () => {
      this.setupImages();
    });
  }

  showImage(index) {
    if (index < 0 || index >= this.images.length) return;
    const deviceType = this.getDeviceType();

    this.images.forEach((img, i) => {
      img.classList.toggle(this.options.activeClass, i === index);
      if (i === index) {
        const src = img.dataset[`src_${deviceType}`] || img.dataset.src;
        if (src) {
          img.src = src;
        }
      }
    });
    this.dots.forEach((dot, i) => {
      dot.classList.toggle(this.options.activeClass, i === index);
    });

    this.currentIndex = index;

    if (this.options.lazyLoad) {
      const currentImg = this.images[index];

      const src =
        currentImg.dataset[`src_${deviceType}`] || currentImg.dataset.src;

      if (
        !currentImg.src ||
        (currentImg.src === this.options.placeholderSrc && src)
      ) {
        currentImg.src = src;
      }
    }

    // Проверяем, если последняя картинка, добавляем активный класс overlay
    if (index === this.images.length - 1 && this.overlay) {
      this.overlay.classList.add(this.options.overlayActiveClass);
    } else if (this.overlay) {
      this.overlay.classList.remove(this.options.overlayActiveClass);
    }
  }
  hideOverlay(index) {
    this.overlay.classList.remove(this.options.overlayActiveClass);
  }

  setupLazyLoading() {
    const deviceType = this.getDeviceType();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;

              const src = img.dataset[`src_${deviceType}`] || img.dataset.src;

              if (
                !img.src ||
                (img.src === this.options.placeholderSrc && src)
              ) {
                img.src = src;
                obs.unobserve(img);
              }
            }
          });
        },
        { rootMargin: "50px" }
      );

      this.images.forEach((img) => {
        const src = img.dataset[`src_${deviceType}`] || img.dataset.src;
        if (!img.src || (img.src === this.options.placeholderSrc && src)) {
          observer.observe(img);
        }
      });
    }
  }

  addDots() {
    let colorVariable='';
    if(this.options.bulletHover){ colorVariable = `style='--bullet-hover:${this.options.bulletHover}'`;

    }
    let html = `<div class="shopBullet_dots" ${colorVariable}>`;
    let nums = this.container.querySelectorAll(".shopBullet_images img").length;
    if (!nums) {
      return;
    } else if (nums == 1) {
      html += `<span class="shopBullet_dot active" data-index="0"></span>`;
    } else if (nums > 1) {
      let extraListHtml = "";
      for (let n = 1; n < nums; n++) {
        extraListHtml += `<span class="shopBullet_dot" data-index="${n}"></span>`;
      }
      html += `<span class="shopBullet_dot active" data-index="0"></span>${extraListHtml}`;
    }
    html += "</div>";
    this.container.children[1].insertAdjacentHTML("beforebegin", html);
  }

  addPreloader() {
    let html = `       
        <div class="shopBullet_preloader">
        <span class="shopBullet_preloader-body"></span>
        </div>`;
    this.container.children[1].insertAdjacentHTML("beforebegin", html);
  }
}
