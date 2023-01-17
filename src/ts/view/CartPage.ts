import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { Cart } from '../service/Cart';
import { generateCard, loadProducts } from '../helpers/generate-cards';
import { IProducts, IcartItem, Promocodes, IcartItemArray } from '../types/interface';
import { cartSum } from '../helpers/addProduct';
import { generateCartItem } from '../helpers/generateCartItem';
import { getPromocode, generatePromoItem, removePromo, getPromoDiscount } from '../helpers/promocode';
import { openModal, closeModal } from '../helpers/modal';

export class CartPage extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Cart');
    }

    async getHtml() {
        return `
      <h1 class="main-title visually-hidden">Cart</h1>
      <section class="cart-section">
        <div class="cart">
            <div class="cart__topbar">
                <span class="cart__title">PRODUCTS IN CART</span>
                <span class="cart__items">
                    ITEMS:
                    <input type="number" min="1" value="3" class="cart__items-counter">
                </span>
                <span class="cart__paginator">
                    PAGE:
                    <button class="button button_prev"><</button>
                    <input type="number" min="1" value="1" class="cart__paginator-page" readonly>
                    <button class="button button_next">></button>
                </span>
            </div>
            <div class="empty-message">Cart is empty</div>
            <ol class="cart__list">
                
            </ol>
        </div>

        <div class="summary">
            <div class="summary__topbar">
                <span class="summary__title">Summary<span>
            </div>
            <div class="summary__products">
                <div class="summary__products-title">
                    Products: <span class="summary__products-counter">1</span>
                </div>
                <div class="summary__products-title">
                    Total: <span class="summary__products-price">500$</span>
                </div>
                
                <div class="summary__promocodes">
                    <div class="summary__promocodes-title">Applied codes</div>
                    <div class="summary__promocodes-list">
                    </div>
                </div>
                <input class="summary__products-promocode" type="search" placeholder="Enter promo code">
                <span>Example: rs or 2023</span>
                <div class="summary__products-promocode-notice"></div>
                <button class="buy-btn">Buy now</button>
            </div>
        </div>

        <div id="myModal" class="modal"></div>
      </section>
    `;
    }
    async mounted() {
        const products = (await loadProducts()) as unknown as IProducts;
        const cartCounter = document.querySelector('.cart-counter');
        const cartTotal = document.querySelector('.cart-total__price');
        const cartList = document.querySelector('.cart__list');
        const summaryCounter = document.querySelector('.summary__products-counter');
        const summaryPrice = document.querySelector('.summary__products-price');
        const promocodeInput = document.querySelector('.summary__products-promocode') as HTMLInputElement;
        const noticeWrap = document.querySelector('.summary__products-promocode-notice');
        const promocodeBlock = document.querySelector('.summary__promocodes');
        const promocodeBlockList = document.querySelector('.summary__promocodes-list');

        const activePromocodes: Promocodes[] = JSON.parse(localStorage.getItem('promo')!) || [];
        const shopCart = new Cart();

        // <pagination
        const currentPage = document.querySelector('.cart__paginator-page') as HTMLInputElement;
        const pagePrev = document.querySelector('.button_prev');
        const pageNext = document.querySelector('.button_next');
        const productsOnPageCounter = document.querySelector('.cart__items-counter') as HTMLInputElement;

        currentPage.value = localStorage.getItem('currentPage') || '1';
        productsOnPageCounter.value = localStorage.getItem('productsOnPageCounter') || '3';

        productsOnPageCounter.addEventListener('input', () => {
            if (productsOnPageCounter.value === '0' || productsOnPageCounter.value === '') return;
            localStorage.setItem('productsOnPageCounter', (+productsOnPageCounter.value).toString());
            currentPage!.max = String(Math.ceil(shopCart.unicItems() / Number(productsOnPageCounter.value)));
            currentPage.value = '1';
            localStorage.setItem('currentPage', currentPage.value);
            window.location.href = `/cart?pageNum=${currentPage.value}`;
        });

        pageNext?.addEventListener('click', () => {
            if (shopCart.unicItems() === 0) return;
            if (productsOnPageCounter.value === '0' || productsOnPageCounter.value === '') {
                productsOnPageCounter.value = '1';
                localStorage.setItem('productsOnPageCounter', '1');
            }
            const countPages = Math.ceil(shopCart.unicItems() / Number(productsOnPageCounter.value));
            if (+currentPage.value === countPages) {
                return;
            }
            currentPage.value = (+currentPage.value + 1).toString();
            localStorage.setItem('currentPage', currentPage.value);
            window.location.href = `/cart?pageNum=${currentPage.value}`;
        });
        pagePrev?.addEventListener('click', () => {
            if (shopCart.unicItems() === 0) return;
            if (productsOnPageCounter.value === '0' || productsOnPageCounter.value === '') {
                productsOnPageCounter.value = '1';
                localStorage.setItem('productsOnPageCounter', '1');
            }
            if (+currentPage.value === 1) {
                return;
            }
            currentPage.value = (+currentPage.value - 1).toString();
            localStorage.setItem('currentPage', currentPage.value);
            window.location.href = `/cart?pageNum=${currentPage.value}`;
        });
        // /pagination>

        cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`;
        changeSum();
        ///Нужно как-то иначе сделать чтобы не дублировалось  думаю кака то функця обновлния днных
        cartCounter!.textContent = `${shopCart.length()}`;
        summaryCounter!.textContent = `${shopCart.length()}`;

        //open window with modal if redirect from ProductPage
        let getParams = new URL(window.location.href).searchParams;
        let modalParam = getParams.has('modal') ? getParams.get('modal') : '';
        if (modalParam !== '') openModal();
        let pageParam = getParams.has('pageNum') ? getParams.get('pageNum') : '1';
        if (pageParam !== '') {
            const cartProducts = shopCart.show().slice(0);
            const currentPage: number = Number(pageParam);
            const pagItems = [];
            const countPages = Math.ceil(shopCart.unicItems() / Number(productsOnPageCounter.value));
            for (let i = 0; i < countPages; i += 1) {
                pagItems.push(cartProducts.splice(0, Number(productsOnPageCounter.value)));
            }

            if (!pagItems[currentPage - 1] && pagItems.length > 0) {
                let previousPage = currentPage === 1 ? 1 : currentPage - 1;
                localStorage.setItem('currentPage', previousPage.toString());
                window.location.href = `/cart?pageNum=${previousPage}`;
            }
            if (pagItems.length > 0) {
                let productNumber = (currentPage - 1) * Number(productsOnPageCounter.value) + 1;
                for (let key of pagItems[currentPage - 1]) {
                    const item = generateCartItem(products[key.id], key.count, productNumber);
                    productNumber += 1;
                    cartList!.insertAdjacentHTML('beforeend', item);
                }
            }
        } else {
            for (let key of shopCart.show()) {
                const item = generateCartItem(products[key.id], key.count);
                cartList!.insertAdjacentHTML('beforeend', item);
            }
        }

        productsOnPageCounter!.max = String(shopCart.unicItems());
        currentPage!.max = String(Math.ceil(shopCart.unicItems() / Number(productsOnPageCounter.value)));
        document.addEventListener('click', (event) => {
            productsOnPageCounter!.max = String(shopCart.unicItems());
            const target = event.target;
            if (target instanceof Element && target.classList.contains('button')) {
                if (target.parentElement?.classList.contains('stock-buttons-wrapper')) {
                    const cartItem = target.closest('.cart-item');
                    const cartItemId = Number(cartItem?.getAttribute('data-productid'));
                    const counter = target.parentElement.querySelector('.cart__paginator-item')!;
                    if (target.classList.contains('button_plus')) {
                        if (products[cartItemId].stock > Number(counter.textContent!)) {
                            shopCart.add(products[cartItemId]);
                            counter.textContent = (Number(counter.textContent!) + 1).toString();
                        }
                    } else if (target.classList.contains('button_minus')) {
                        counter.textContent = (Number(counter.textContent!) - 1).toString();
                        shopCart.remove(products[cartItemId]);
                        localStorage.setItem('cart', JSON.stringify(shopCart.show()));
                    }
                }
            }

            cartList!.innerHTML = '';
            if (pageParam !== '') {
                const cartProducts = shopCart.show().slice(0);
                const currentPage: number = Number(pageParam);
                const pagItems = [];
                const countPages = Math.ceil(shopCart.unicItems() / Number(productsOnPageCounter.value));
                for (let i = 0; i < countPages; i += 1) {
                    pagItems.push(cartProducts.splice(0, Number(productsOnPageCounter.value)));
                }

                if (!pagItems[currentPage - 1]) {
                    let previousPage = currentPage === 1 ? 1 : currentPage - 1;
                    localStorage.setItem('currentPage', previousPage.toString());
                    window.location.href = `/cart?pageNum=${previousPage}`;
                }
                let productNumber = (currentPage - 1) * Number(productsOnPageCounter.value) + 1;
                for (let key of pagItems[currentPage - 1]) {
                    const item = generateCartItem(products[key.id], key.count, productNumber);
                    productNumber += 1;
                    cartList!.insertAdjacentHTML('beforeend', item);
                }
            } else {
                for (let key of shopCart.show()) {
                    const item = generateCartItem(products[key.id], key.count);
                    cartList!.insertAdjacentHTML('beforeend', item);
                }
            }
            cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`;
            ///Нужно как-то иначе сделать чтобы не дублировалось  думаю кака то функця обновлния днных
            cartCounter!.textContent = `${shopCart.length()}`;
            summaryCounter!.textContent = `${shopCart.length()}`;
            changeSum();
            localStorage.setItem('cart', JSON.stringify(shopCart.show()));
        });

        promocodeInput!.addEventListener('input', async (event) => {
            noticeWrap!.innerHTML = '';
            let target = event.target as HTMLInputElement;
            let isPromocode = (await getPromocode(target.value, activePromocodes)) as unknown as Promocodes;
            if (isPromocode) {
                const notice = `<div class="summary__promocodes-item" data-promoid="${isPromocode.id}">${isPromocode.description} 
                ${isPromocode.discountPercentage}%<button data-code="${isPromocode.code}">ADD</button></div>`;
                noticeWrap!.insertAdjacentHTML('beforeend', notice);
            }
            changeSum();
        });

        generatePromoItem(activePromocodes, promocodeBlockList as HTMLElement);
        promocodeBlock!.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target instanceof HTMLButtonElement) {
                const promoItem = target.parentElement!;
                removePromo(activePromocodes, Number(promoItem.dataset.promoid));
                promoItem.remove();
            }
            changeSum();
        });

        noticeWrap!.addEventListener('click', async (event) => {
            const target = event.target as HTMLElement;
            if (target instanceof HTMLButtonElement) {
                const promoItem = target.parentElement!;
                let isPromocode = (await getPromocode(target.dataset.code as string, activePromocodes)) as unknown as Promocodes;
                activePromocodes.push(isPromocode);
                promocodeBlockList!.innerHTML = '';
                promocodeInput!.value = '';
                generatePromoItem(activePromocodes, promocodeBlockList as HTMLElement);
                promoItem.remove();
                changeSum();
            }
        });

        document.querySelector('.buy-btn')?.addEventListener('click', (e) => {
            openModal();
        });

        document.addEventListener('click', (e) => {
            const modal = document.querySelector('.modal') as HTMLDivElement;
            if (e.target === modal) {
                closeModal();
            }
        });

        function changeSum() {
            summaryPrice!.textContent = `${(+cartSum(products, shopCart.show())).toFixed(2)}$`;
            if (activePromocodes.length > 0) {
                summaryPrice!.innerHTML = `<span>${(+cartSum(products, shopCart.show())).toFixed(2)}$</span>
                
                    ${(
                        +cartSum(products, shopCart.show()) -
                        +cartSum(products, shopCart.show()) * (getPromoDiscount(activePromocodes) / 100)
                    ).toFixed(2)}$
                `;
            }
        }
        if (localStorage.getItem('cart')! !== '[]') {
            (document.querySelector('.empty-message') as HTMLDivElement).style.display = 'none';
        } else {
            (document.querySelector('.empty-message') as HTMLDivElement).style.display = 'flex';
        }
    }
}
