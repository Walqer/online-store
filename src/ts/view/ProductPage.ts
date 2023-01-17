import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { Cart } from '../service/Cart';
import { loadProducts } from '../helpers/generate-cards';
import { IProducts } from '../types/interface';
import { cartSum, isProductInCart } from '../helpers/addProduct';
import { ProductCard } from '../service/StoreService';

export class ProductPage extends AbstractView {
    productID: number;

    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Product Details');
        if (isNaN(Number(this.params.type))) window.location.href = '/404';
        this.productID = Number(this.params.type);
        if (this.productID < 0 || this.productID > 101) window.location.href = '/404';
    }

    async getHtml() {
        return `
      <h1 class="main-title visually-hidden">Cart</h1>
      <div class="product-details">
          <div class="product-title">
              <div class="products-name">IPhone</div>
              <div class="breadcrumbs">Store > Smartphones > Apple > IPhone X</div>
          </div>
          <div class="product-main">
              <div class="product-images">
              </div>
              <div class="product-image">
                <img src="" width="550" height="550">
              </div>
              <div class="product-desc">
                <h3 class="description-title">Description</h3>
                <p class="desc-description">SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...</p>
                <h3 class="description-title">Discount Percentage</h3>
                <p class="desc-discountPercentage">17.94</p>
                <h3 class="description-title">Rating</h3>
                <p class="desc-rating">4.44</p>
                <h3 class="description-title">In Stock</h3>
                <p class="desc-stock">34</p>
                <h3 class="description-title">Brand</h3>
                <p class="desc-brand">Apple</p>
                <h3 class="description-title">Category</h3>
                <p class="desc-category">smartphones</p>
                <h3 class="description-title">Price</h3>
                <p class="desc-price">899$</p>
                <div class="buy-utilities">
                    <button class="buy-button buy-cart">Add To Cart</button>
                    <button class="buy-button buy-now">Buy Now</button>
                </div>                
              </div>
          </div>
      </div>
    `;
    }

    async mounted() {
        const products = (await loadProducts()) as unknown as IProducts;
        const card = new ProductCard(products[this.productID]);
        (document.querySelector('.products-name') as HTMLDivElement).innerHTML = card.product.title;
        (
            document.querySelector('.breadcrumbs') as HTMLDivElement
        ).innerHTML = `Store > ${card.product.category} > ${card.product.brand} > ${card.product.title}`;

        const thumbnails = document.querySelector('.product-images') as HTMLDivElement;
        card.product.images.forEach((element) => {
            const img: HTMLImageElement = document.createElement('img');
            img.width = 150;
            img.height = 150;
            img.src = element;
            img.className = 'thumbnails';
            thumbnails.append(img);
            img.addEventListener('click', (e) => {
                (document.querySelector('.product-image img') as HTMLImageElement).src = (e.target as HTMLImageElement).src;
            });
        });

        (document.querySelector('.product-image img') as HTMLImageElement).src = card.product.images[0];
        (document.querySelector('.desc-description') as HTMLDivElement).innerHTML = card.product.description;
        (document.querySelector('.desc-discountPercentage') as HTMLDivElement).innerHTML = card.product.discountPercentage.toString();
        (document.querySelector('.desc-rating') as HTMLDivElement).innerHTML = card.product.rating.toString();
        (document.querySelector('.desc-stock') as HTMLDivElement).innerHTML = card.product.stock.toString();
        (document.querySelector('.desc-brand') as HTMLDivElement).innerHTML = card.product.brand;
        (document.querySelector('.desc-category') as HTMLDivElement).innerHTML = card.product.category;
        (document.querySelector('.desc-price') as HTMLDivElement).innerHTML = card.product.price.toString() + '$';

        const shopCart = new Cart();
        const cartCounter = document.querySelector('.cart-counter');
        const cartTotal = document.querySelector('.cart-total__price');
        cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`; ///Нужно как-то иначе сделать чтобы не дублировалось  думаю кака то функця обновлния днных
        cartCounter!.textContent = `${shopCart.length()}`;

        if (isProductInCart(this.productID, shopCart.show())) {
            (document.querySelector('.buy-cart') as HTMLButtonElement).innerHTML = 'Remove';
            (document.querySelector('.buy-cart') as HTMLButtonElement).classList.add('remove');
        } else {
            (document.querySelector('.buy-cart') as HTMLButtonElement).innerHTML = 'Add To Cart';
        }

        document.querySelector('.buy-cart')?.addEventListener('click', (e) => {
            const currentProduct = products[this.productID];
            const addButton = e.target as HTMLButtonElement;
            if (addButton.classList.contains('remove')) {
                shopCart.remove(currentProduct, true);
                addButton.textContent = 'Add to Cart';
            } else {
                shopCart.add(currentProduct);
                addButton.textContent = 'Remove';
            }
            addButton.classList.toggle('remove');
            cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`;
            cartCounter!.textContent = `${shopCart.length()}`;
            localStorage.setItem('cart', JSON.stringify(shopCart.show()));
        });
        document.querySelector('.buy-now')?.addEventListener('click', (e) => {
            const currentProduct = products[this.productID];
            const addButton = document.querySelector('.buy-cart') as HTMLButtonElement;
            if (!addButton.classList.contains('remove')) {
                shopCart.add(currentProduct);
            }
            localStorage.setItem('cart', JSON.stringify(shopCart.show()));
            window.location.href = '/cart?modal=true';
        });
    }
}
