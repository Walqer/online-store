import { IProductCard, IProducts, IcartItem } from '../types/interface';
export function getProductId(event: Event): number | string {
    const target = event.target;
    if (target instanceof HTMLElement && target.hasAttribute('data-productid')) {
        if (!target.classList.contains('info')) {
            addClassToCard(target);
        }
        return Number(target.getAttribute('data-productid'));
    }
    return 'Product not found';
}

function addClassToCard(button: HTMLElement) {
    const card = button.closest('.product-card')!;
    if (!card.classList.contains('in-cart')) {
        button.textContent = 'Remove';
        button.classList.add('remove');
    } else {
        button.textContent = 'Add';
        button.classList.remove('remove');
    }
    card.classList.toggle('in-cart');
}

export function cartSum(productList: IProducts, cartList: IcartItem[]) {
    let total = 0;
    for (let key of cartList) {
        total += productList[key.id].price * key.count;
    }
    return total.toFixed(2);
}

export function isProductInCart(productID: number, cartList: IcartItem[]) {
    for (let key of cartList) {
        if (key.id === productID) return true;
    }
    return false;
}
