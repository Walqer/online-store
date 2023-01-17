import { ProductCard } from '../service/StoreService';
import { IProductCard } from '../types/interface';

function getFilterFieldArray(productCards: ProductCard[], filterField: string) {
    let filterFieldValues: string[] = [];
    for (let item in productCards) {
        const filterFieldValue = productCards[item].product[filterField as keyof IProductCard] as string;
        if (!filterFieldValues.includes(filterFieldValue)) filterFieldValues.push(filterFieldValue);
    }
    return filterFieldValues;
}

function getProductsCount(productCards: ProductCard[], filterField: string, filterFieldValue: string) {
    let counter: number = 0;
    for (let item in productCards) {
        const card = productCards[item].product;
        if (filterFieldValue === card[filterField as keyof IProductCard]) counter++;
    }
    return counter;
}

function generateFilterLine(filterFieldValue: string, productsCount: number, filterField: string) {
    return `
        <div class="checkbox-line">
            <input type="checkbox" id="${filterFieldValue}" class="filter-check" data-filterfield="${filterField}">
            <label for="${filterFieldValue}" class="filter-check-label">${filterFieldValue}</label>
        </div>
        <div class="checkbox-counter"><span id="${filterFieldValue}">${productsCount}</span>/${productsCount}</div>
    `;
}

function mount(parent: Element, filterFieldValue: string, productsCount: number, filterField: string) {
    const element: HTMLElement = document.createElement('div');
    element.classList.add('filter-checkbox-line');
    element.innerHTML = generateFilterLine(filterFieldValue, productsCount, filterField);
    parent.append(element);
}

function redrawMinMaxRange(productCards: ProductCard[], filterField: string) {
    let minParam = Infinity;
    let maxParam = 0;
    for (let item in productCards) {
        const cardField = productCards[item].product[filterField as keyof IProductCard];
        if (cardField < minParam) minParam = Number(cardField);
        if (cardField > maxParam) maxParam = Number(cardField);
    }
    if (minParam <= maxParam) {
        const rangeInput = document.querySelectorAll(`.${filterField}-range .range-input input`) as unknown as HTMLInputElement[];
        const priceInput = document.querySelectorAll(`.${filterField}-range .price-input input`) as unknown as HTMLInputElement[];
        const range = document.querySelector(`.${filterField}-range .slider .progress`) as HTMLDivElement;
        rangeInput[0].value = minParam.toString();
        rangeInput[1].value = maxParam.toString();
        priceInput[0].value = minParam.toString();
        priceInput[1].value = maxParam.toString();
        range!.style.left = (minParam / Number(rangeInput[0].max)) * 100 + '%';
        range!.style.right = 100 - (maxParam / Number(rangeInput[1].max)) * 100 + '%';
    }
}

function redrawCountProductsAfterFilter(productCards: ProductCard[], filterField: string) {
    const fields = Array.from(document.querySelectorAll(`.filter-${filterField}-list span`)) as Array<HTMLSpanElement>;
    fields.forEach((f: Element) => {
        f.innerHTML = String(getProductsCount(productCards, filterField, f.id));
    });
}

export function recalcFilters(productCards: ProductCard[], caller: string) {
    redrawCountProductsAfterFilter(productCards, 'category');
    redrawCountProductsAfterFilter(productCards, 'brand');

    if (caller !== 'slider' && caller !== 'firstload') {
        redrawMinMaxRange(productCards, 'price');
        redrawMinMaxRange(productCards, 'stock');
    }
}

export function generateFilter(productCards: ProductCard[], filterField: string) {
    const page = document.querySelector('.filter-' + filterField + '-list');
    let filterFieldValues: string[] = getFilterFieldArray(productCards, filterField);
    for (let i in filterFieldValues) {
        const productsCount = getProductsCount(productCards, filterField, filterFieldValues[i]);
        mount(page!, filterFieldValues[i], productsCount, filterField);
    }
}

export function filter(productCards: ProductCard[]): ProductCard[] {
    let filters = Array.from(document.querySelectorAll('input[type=checkbox]')) as Array<HTMLInputElement>;
    filters = filters.filter((i) => i.checked);
    const filterCategory = filters.filter((i) => i.getAttribute('data-filterfield') === 'category');
    const filterBrand = filters.filter((i) => i.getAttribute('data-filterfield') === 'brand');
    const filterCategoryStrings = filterCategory.map((i) => i.getAttribute('id'));
    const filterBrandStrings = filterBrand.map((i) => i.getAttribute('id'));
    const filterPrice = document.querySelectorAll('.price-range .price-input input') as unknown as HTMLInputElement[];
    const filterStock = document.querySelectorAll('.stock-range .price-input input') as unknown as HTMLInputElement[];

    if (filterCategoryStrings.length > 0) productCards = productCards.filter((i) => filterCategoryStrings.includes(i.product.category));
    if (filterBrandStrings.length > 0) productCards = productCards.filter((i) => filterBrandStrings.includes(i.product.brand));
    productCards = productCards.filter(
        (i) => i.product.price >= Number(filterPrice[0].value) && i.product.price <= Number(filterPrice[1].value)
    );
    productCards = productCards.filter(
        (i) => i.product.stock >= Number(filterStock[0].value) && i.product.stock <= Number(filterStock[1].value)
    );

    return productCards;
}

export function resetFilters() {
    window.open(window.location.pathname, '_self');
}

export function copyFilters(e: Event) {
    let url: string = window.location.href;
    navigator.clipboard.writeText(url);
    (<HTMLButtonElement>e.target).innerText = 'Copied';
    setTimeout(() => ((<HTMLButtonElement>e.target).innerText = 'Copy Link'), 2000);
}
