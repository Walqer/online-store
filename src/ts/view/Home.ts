import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { loadProducts, mount } from '../helpers/generate-cards';
import { getProductId } from '../helpers/addProduct';
import { IProducts } from '../types/interface';
import { ProductCard } from '../service/StoreService';
import { search } from '../helpers/search';
import { generateFilter, recalcFilters, filter, resetFilters, copyFilters } from '../helpers/filters';
import { restoreFiltersFromQS, saveFiltersToQS } from '../helpers/querystring';
import { Cart } from '../service/Cart';
import { cartSum } from '../helpers/addProduct';

export class Home extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Home');
    }

    async getHtml() {
        return `
      <h1 class="main-title visually-hidden">Home</h1>
        <section class="products-wrapper">
            <aside class="sidebar">
                <div class="filter-utilities">
                    <button class="filter-button filter-reset">Reset Filters</button>
                    <button class="filter-button filter-copy">Copy Link</button>
                </div>
                <div class="filter-category">
                    <h3 class="filter-title">Category</h3>
                    <div class="filter-category-list">
                    </div>
                </div>
                <div class="filter-brand">
                    <h3 class="filter-title">Brand</h3>
                    <div class="filter-brand-list">
                    </div>
                </div>
                <div class="filter-price">
                    <h3 class="filter-title">Price</h3>
                    <div class="price-range">
                        <div class="price-input">
                          <div class="field">
                            <input type="number" class="input-min" value="10" readonly>
                          </div>
                          <div class="field">
                            <input type="number" class="input-max" value="1749" readonly>
                          </div>
                        </div>
                        <div class="slider">
                          <div class="progress"></div>
                        </div>
                        <div class="range-input">
                          <input type="range" class="range-min" min="10" max="1749" value="10" step="1">
                          <input type="range" class="range-max" min="10" max="1749" value="1749" step="1">
                        </div>
                  </div>                    
                </div>
                <div class="filter-stock">
                    <h3 class="filter-title">In Stock</h3>
                    <div class="stock-range">
                        <div class="price-input">
                          <div class="field">
                            <input type="number" class="input-min" value="2" readonly>
                          </div>
                          <div class="field">
                            <input type="number" class="input-max" value="150" readonly>
                          </div>
                        </div>
                        <div class="slider">
                          <div class="progress"></div>
                        </div>
                        <div class="range-input">
                          <input type="range" class="range-min" min="2" max="150" value="2" step="1">
                          <input type="range" class="range-max" min="2" max="150" value="150" step="1">
                        </div>
                  </div>                    
                </div>
            </aside>
            <div class="products">
                <div class="products-utilities">
                    <div class="products-count">100 Results</div>
                    <div class="utilities">
                        <div class="sort-bar">
                            <span>Sort:</span>
                            <select class="product-sort">
                                <option value="" selected="selected">Default</option>
                                <option value="price.asc">Price ASC</option>
                                <option value="price.desc">Price DESC</option>
                                <option value="rating.asc">Rating ASC</option>
                                <option value="rating.desc">Rating DESC</option>
                            </select>
                        </div>
                        <div class="search-bar">
                            <span>Search:</span>
                            <input type="search" class="product-search">
                        </div>
                        <div class="view-bar">
                            <span>View:</span>
                            <select class="product-view">
                                <option value="" selected="selected">Default</option>
                                <option value="mini">Mini</option>
                            </select>
                        </div>
                    </div>
                </div>
                <ul class="products-list">
                </ul>
            </div>
      </section>
    `;
    }

    convertToProductCard(products: IProducts): ProductCard[] {
        let productCards: ProductCard[] = [];
        for (let item in products) {
            const card = new ProductCard(products[item]);
            productCards.push(card);
        }
        return productCards;
    }

    drawProductCards(productCards: ProductCard[]) {
        const page = document.querySelector('.products-list');
        const results = document.querySelector('.products-count');
        page!.textContent = '';
        let resultsCount: number = 0;

        for (let item in productCards) {
            const card = productCards[item];
            mount(page!, card);
            resultsCount++;
        }

        if (resultsCount === 0) page!.innerHTML = 'No Product Found';
        results!.textContent = `${resultsCount} Results`;
    }

    async prepareSearch(caller: string) {
        const products = (await loadProducts()) as unknown as IProducts;
        let productCards = this.convertToProductCard(products);
        productCards = filter(productCards);
        let filterSearch: string = (document.querySelector('.product-search') as HTMLInputElement).value.toLowerCase();
        let filterSort: string = (document.querySelector('.product-sort') as HTMLSelectElement).value;
        productCards = search(productCards, filterSearch, filterSort);
        recalcFilters(productCards, caller);
        this.drawProductCards(productCards);
        this.changeView();
        saveFiltersToQS();
    }

    sliderListener(slider: string) {
        const sliderClass = `.${slider}-range`;
        const rangeInput = document.querySelectorAll(`${sliderClass} .range-input input`) as unknown as HTMLInputElement[];
        const priceInput = document.querySelectorAll(`${sliderClass} .price-input input`) as unknown as HTMLInputElement[];
        const range = document.querySelector(`${sliderClass} .slider .progress`) as HTMLDivElement;
        rangeInput.forEach((input) => {
            input.addEventListener('input', async (e) => {
                let priceGap = 10;
                let minVal = parseInt(rangeInput[0].value);
                let maxVal = parseInt(rangeInput[1].value);

                if (maxVal - minVal < priceGap) {
                    if ((<HTMLInputElement>e.target)!.className === 'range-min') {
                        rangeInput[0].value = (maxVal - priceGap).toString();
                    } else {
                        rangeInput[1].value = (minVal + priceGap).toString();
                    }
                } else {
                    priceInput[0].value = minVal.toString();
                    priceInput[1].value = maxVal.toString();
                    range!.style.left = (minVal / Number(rangeInput[0].max)) * 100 + '%';
                    range!.style.right = 100 - (maxVal / Number(rangeInput[1].max)) * 100 + '%';
                }
                await this.prepareSearch('slider');
            });
        });
    }

    changeView() {
        const view: string = (document.querySelector('.product-view') as HTMLSelectElement).value;
        const products = document.querySelectorAll('.product-card__thumbnail') as unknown as HTMLDivElement[];
        products.forEach((element) => {
            if (view === 'mini') element.style.display = 'none';
            else element.style.display = 'block';
        });
    }

    async bindListeners() {
        document.querySelector('.product-search')?.addEventListener('search', async (e) => {
            await this.prepareSearch('search');
        });
        document.querySelector('.product-sort')?.addEventListener('change', async (e) => {
            await this.prepareSearch('sort');
        });
        document.querySelector('.product-view')?.addEventListener('change', async (e) => {
            await this.prepareSearch('view');
        });
        document.querySelector('.filter-reset')?.addEventListener('click', (e) => {
            resetFilters();
        });
        document.querySelector('.filter-copy')?.addEventListener('click', (e) => {
            copyFilters(e);
        });

        const filters = Array.from(document.querySelectorAll('input[type=checkbox]')) as Array<HTMLInputElement>;
        filters.forEach((f: Element) => {
            f.addEventListener('change', async (e) => {
                await this.prepareSearch('checkbox');
            });
        });

        this.sliderListener('price');
        this.sliderListener('stock');
    }

    async mounted() {
        const products = (await loadProducts()) as unknown as IProducts;
        let productCards = this.convertToProductCard(products);
        generateFilter(productCards, 'category');
        generateFilter(productCards, 'brand');
        let params = new URL(window.location.href).searchParams;
        restoreFiltersFromQS(params);
        productCards = filter(productCards);
        let filterSearch: string = (document.querySelector('.product-search') as HTMLInputElement).value.toLowerCase();
        let filterSort: string = (document.querySelector('.product-sort') as HTMLSelectElement).value;
        productCards = search(productCards, filterSearch, filterSort);
        recalcFilters(productCards, 'firstload');
        this.drawProductCards(productCards);
        this.changeView();
        this.bindListeners();

        const shopCart = new Cart();
        const cartCounter = document.querySelector('.cart-counter');
        const cartTotal = document.querySelector('.cart-total__price');
        cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`; ///Нужно как-то иначе сделать чтобы не дублировалось  думаю кака то функця обновлния днных
        cartCounter!.textContent = `${shopCart.length()}`;

        document.addEventListener('click', (e) => {
            const target = e.target instanceof Element ? e.target : null;
            if (target?.classList.contains('product-card__button')) {
                const productId = getProductId(e);
                const currentProduct = products[productId];
                if (typeof productId === 'number') {
                    if (target?.classList.contains('add')) {
                        if (!target?.classList.contains('remove')) {
                            shopCart.remove(currentProduct, true);
                        } else {
                            shopCart.add(currentProduct);
                        }
                        console.log(shopCart.show());
                        cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`;
                        cartCounter!.textContent = `${shopCart.length()}`;
                        localStorage.setItem('cart', JSON.stringify(shopCart.show()));
                    }
                    if (target?.classList.contains('info')) {
                        window.location.href = `/product/${productId}`;
                    }
                }
            }
        });
    }
}
