import { ProductCard } from '../service/StoreService';
import { IProductCard } from '../types/interface';

export function sortProducts(productCards: ProductCard[], sortString: string): ProductCard[] {
    if (sortString !== '') {
        let sortField: string = sortString.split('.')[0];
        let sortDirection: string = sortString.split('.')[1];
        productCards.sort((a, b) => {
            if (sortDirection === 'asc')
                return (a.product[sortField as keyof IProductCard] as number) - (b.product[sortField as keyof IProductCard] as number);
            else if (sortDirection === 'desc')
                return (b.product[sortField as keyof IProductCard] as number) - (a.product[sortField as keyof IProductCard] as number);
            return a.product.id - b.product.id;
        });
    }
    return productCards;
}

function searchProducts(productCards: ProductCard[], searchText: string): ProductCard[] {
    let searchProductCards: ProductCard[] = [];
    for (let item in productCards) {
        const card = productCards[item];
        if (
            card.product.title.toLowerCase().includes(searchText) ||
            card.product.description.toLowerCase().includes(searchText) ||
            card.product.price.toString().includes(searchText) ||
            card.product.rating.toString().includes(searchText) ||
            card.product.brand.toLowerCase().includes(searchText) ||
            card.product.category.toLowerCase().includes(searchText)
        ) {
            searchProductCards.push(card);
        }
    }
    return searchProductCards;
}

export function search(productCards: ProductCard[], searchText: string, sortString: string): ProductCard[] {
    productCards = sortProducts(productCards, sortString);
    productCards = searchProducts(productCards, searchText);
    return productCards;
}
