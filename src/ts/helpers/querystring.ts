export function updateQueryStringParameter(uri: string, key: string, value: string) {
    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + value + '$2');
    } else {
        return uri + separator + key + '=' + value;
    }
}

export function saveFiltersToQS() {
    let url: string = window.location.href;

    let filterCategory = Array.from(document.querySelectorAll('.filter-category-list .filter-check') as unknown as HTMLInputElement[]);
    filterCategory = filterCategory.filter((i) => i.checked === true);
    let filterCategoryValues = filterCategory.map((i) => i.id).join('|');
    url = updateQueryStringParameter(url, 'category', filterCategoryValues);

    let filterBrand = Array.from(document.querySelectorAll('.filter-brand-list .filter-check') as unknown as HTMLInputElement[]);
    filterBrand = filterBrand.filter((i) => i.checked === true);
    let filterBrandValues = filterBrand.map((i) => i.id).join('|');
    url = updateQueryStringParameter(url, 'brand', filterBrandValues);

    const priceInput = document.querySelectorAll(`.price-range .price-input input`) as unknown as HTMLInputElement[];
    let minprice = priceInput[0].value;
    let maxprice = priceInput[1].value;
    url = updateQueryStringParameter(url, 'minprice', minprice);
    url = updateQueryStringParameter(url, 'maxprice', maxprice);

    const stockInput = document.querySelectorAll(`.stock-range .price-input input`) as unknown as HTMLInputElement[];
    let minstock = stockInput[0].value;
    let maxstock = stockInput[1].value;
    url = updateQueryStringParameter(url, 'minstock', minstock);
    url = updateQueryStringParameter(url, 'maxstock', maxstock);

    let filterSearch: string = (document.querySelector('.product-search') as HTMLInputElement).value.toLowerCase();
    let filterSort: string = (document.querySelector('.product-sort') as HTMLSelectElement).value;
    url = updateQueryStringParameter(url, 'search', filterSearch);
    url = updateQueryStringParameter(url, 'sort', filterSort);

    let view: string = (document.querySelector('.product-view') as HTMLSelectElement).value;
    url = updateQueryStringParameter(url, 'view', view);

    window.history.pushState({ path: url }, '', url);
}

export function restoreFiltersFromQS(params: URLSearchParams) {
    //restore 'search' from QS
    let searchParam = params.has('search') ? params.get('search') : '';
    (document.querySelector('.product-search') as HTMLInputElement).value = searchParam as string;

    //restore 'sort' from QS
    let sortParam = params.has('sort') ? params.get('sort') : '';
    (document.querySelector('.product-sort') as HTMLSelectElement).value = sortParam as string;

    //restore 'view' from QS
    let viewParam = params.has('view') ? params.get('view') : '';
    (document.querySelector('.product-view') as HTMLSelectElement).value = viewParam as string;

    //restore 'category' from QS
    let categoryParam = params.has('category') ? params.get('category') : '';
    if (categoryParam !== '') {
        let filterCategory = Array.from(document.querySelectorAll('.filter-category-list .filter-check') as unknown as HTMLInputElement[]);
        let filterCategoryValues = categoryParam!.split('|');
        filterCategory.forEach((element) => {
            if (filterCategoryValues.includes(element.id)) element.checked = true;
        });
    }

    //restore 'brand' from QS
    let brandParam = params.has('brand') ? params.get('brand') : '';
    if (brandParam !== '') {
        let filterBrand = Array.from(document.querySelectorAll('.filter-brand-list .filter-check') as unknown as HTMLInputElement[]);
        let filterBrandValues = brandParam!.split('|');
        filterBrand.forEach((element) => {
            if (filterBrandValues.includes(element.id)) element.checked = true;
        });
    }

    //restore min & max 'price' from QS
    const minpriceParam = params.has('minprice') ? params.get('minprice') : '';
    const maxpriceParam = params.has('maxprice') ? params.get('maxprice') : '';
    let priceInput = document.querySelectorAll(`.price-range .price-input input`) as unknown as HTMLInputElement[];
    let rangeInput = document.querySelectorAll(`.price-range .range-input input`) as unknown as HTMLInputElement[];
    let range = document.querySelector(`.price-range .slider .progress`) as HTMLDivElement;
    if (minpriceParam !== '') {
        priceInput[0].value = minpriceParam!.toString();
        rangeInput[0].value = minpriceParam!.toString();
        range!.style.left = (Number(minpriceParam!) / Number(rangeInput[0].max)) * 100 + '%';
    }
    if (maxpriceParam !== '') {
        priceInput[1].value = maxpriceParam!.toString();
        rangeInput[1].value = maxpriceParam!.toString();
        range!.style.right = 100 - (Number(maxpriceParam) / Number(rangeInput[1].max)) * 100 + '%';
    }

    //restore min & max 'in stock' from QS
    const minstockParam = params.has('minstock') ? params.get('minstock') : '';
    const maxstockParam = params.has('maxstock') ? params.get('maxstock') : '';
    priceInput = document.querySelectorAll(`.stock-range .price-input input`) as unknown as HTMLInputElement[];
    rangeInput = document.querySelectorAll(`.stock-range .range-input input`) as unknown as HTMLInputElement[];
    range = document.querySelector(`.stock-range .slider .progress`) as HTMLDivElement;
    if (minstockParam !== '') {
        priceInput[0].value = minstockParam!.toString();
        rangeInput[0].value = minstockParam!.toString();
        range!.style.left = (Number(minstockParam!) / Number(rangeInput[0].max)) * 100 + '%';
    }
    if (maxstockParam !== '') {
        priceInput[1].value = maxstockParam!.toString();
        rangeInput[1].value = maxstockParam!.toString();
        range!.style.right = 100 - (Number(maxstockParam) / Number(rangeInput[1].max)) * 100 + '%';
    }
}
