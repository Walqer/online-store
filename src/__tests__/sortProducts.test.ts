import { sortProducts } from '../ts/helpers/search';

let testProductCards = [
    {
        product: {
            brand: '',
            category: '',
            description: '',
            discountPercentage: 10,
            id: 0,
            images: [''],
            price: 500,
            rating: 6,
            stock: 40,
            thumbnail: '',
            title: '',
        },
    },
    {
        product: {
            brand: '',
            category: '',
            description: '',
            discountPercentage: 10,
            id: 3,
            images: [''],
            price: 105,
            rating: 5,
            stock: 5,
            thumbnail: '',
            title: '',
        },
    },
    {
        product: {
            brand: '',
            category: '',
            description: '',
            discountPercentage: 10,
            id: 15,
            images: [''],
            price: 1000,
            rating: 10,
            stock: 96,
            thumbnail: '',
            title: '',
        },
    },
    {
        product: {
            brand: '',
            category: '',
            description: '',
            discountPercentage: 10,
            id: 84,
            images: [''],
            price: 10,
            rating: 1,
            stock: 80,
            thumbnail: '',
            title: '',
        },
    },
];
const testProductCardsOriginal = [...testProductCards];
test('check sort function - ASC, DESC and different fields', () => {
    testProductCards = sortProducts(testProductCards, 'price.asc');
    expect(testProductCards[0]).toStrictEqual(testProductCardsOriginal[3]);
    expect(testProductCards[3]).toStrictEqual(testProductCardsOriginal[2]);
    testProductCards = [...testProductCardsOriginal];

    testProductCards = sortProducts(testProductCards, 'price.desc');
    expect(testProductCards[0]).toStrictEqual(testProductCardsOriginal[2]);
    expect(testProductCards[3]).toStrictEqual(testProductCardsOriginal[3]);
    testProductCards = [...testProductCardsOriginal];

    testProductCards = sortProducts(testProductCards, 'rating.asc');
    expect(testProductCards[0]).toStrictEqual(testProductCardsOriginal[3]);
    expect(testProductCards[3]).toStrictEqual(testProductCardsOriginal[2]);
    testProductCards = [...testProductCardsOriginal];

    testProductCards = sortProducts(testProductCards, 'rating.desc');
    expect(testProductCards[0]).toStrictEqual(testProductCardsOriginal[2]);
    expect(testProductCards[3]).toStrictEqual(testProductCardsOriginal[3]);
    testProductCards = [...testProductCardsOriginal];
});
