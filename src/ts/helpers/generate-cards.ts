import { ProductCard } from '../service/StoreService';
import { LoaderOption } from '../types/interface';

export function generateCard(card: ProductCard) {
    const cartList = JSON.parse(localStorage.getItem('cart')!);
    let inCart = false;
    for (let item in cartList) {
        if (cartList[item].id === card.product.id) {
            inCart = true;
        }
    }
    let title = card.product.title;
    if (title.length > 20) {
        title = title.slice(0, 17) + '...';
    }
    return `
        <li class="product-card ${inCart ? 'in-cart' : ''}">
            <h3 class="product-card__title"">${title}</h3>
            <div class="product-card__thumbnail">
                <img src ="${card.product.thumbnail}" width="245" height="245">
            </div>
            <div class="product-card__body">
                <span class="product-card__price">${card.product.price}$</span>
                <span class="product-card__category">${card.product.category}</span>
                <span class="product-card__brand">${card.product.brand}</span>
                <span class="product-card__rating">Rating: <b>${card.product.rating}</b></span>
                <div class="product-card__buttons">
                    <button class="product-card__button add" data-productId="${card.product.id}">
                        ${inCart ? 'Remove' : 'Add'}
                    </button>
                    <button class="product-card__button info" data-productId="${card.product.id}">Info</button>
                </div>
            </div>
        </li>
        `;
}

export function mount(parent: Element, card: ProductCard): void {
    const CardHtml = generateCard(card);
    parent.insertAdjacentHTML('beforeend', CardHtml);
}

export async function loadProducts() {
    const res = await fetch(`../data/products.json`);
    const data = (await res.json()) as LoaderOption;
    return data.products;
}
