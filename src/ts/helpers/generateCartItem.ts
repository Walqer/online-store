import { IProductCard } from '../types/interface';
export function generateCartItem(product: IProductCard, count: number, productNumber = 1) {
    let productCount = count;
    return `
    <li class="cart-item" data-productId = "${product.id}">
        <span class="cart-item__number">${productNumber}</span>
        <img width="200" src="${product.thumbnail}" alt="${product.title}" height="120" class="cart-item__img">
        <div class="cart-item__info">
            <span class="cart-item__info-title">
                ${product.title}
            </span>
            <hr class="cart-item__info-line">
            <p class="cart-item__info-descr">
                ${product.description}
            </p>
            <div class="cart-item__info-btn-wrapper">
            <span class="cart-item__info-rating cart-item__info-button">
                Rating: <b class="rating-count">
                    ${product.rating}
                </b>
            </span>
            <span class="cart-item__info-discount cart-item__info-button">
                Discount: <b class="discount-count">
                    ${product.discountPercentage}
                </b>
            </span>
            </div>
        </div>
        <div class="cart-item__stock">
            Stock: <b class="stock-count"> ${product.stock}</b>
            <div class="stock-buttons-wrapper">
                <button class="button button_plus">+</button>
                <b class="cart__paginator-item">${productCount}</b>
                <button class="button button_minus">-</button>
            </div>
            <span class="cart-item__total">${(product.price * productCount).toFixed(2)}$</span>
        </div>
    </li>
    `;
}
