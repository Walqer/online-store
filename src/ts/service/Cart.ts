import { IProductCard, IcartItem } from '../types/interface';

export class Cart {
    private counter = 0;
    cartList: IcartItem[];
    constructor() {
        const saved = JSON.parse(localStorage.getItem('cart')!) || null;
        this.cartList = saved || [];
        this.counter = saved ? saved.length : 0;
    }
    add(product: IProductCard) {
        for (let item in this.cartList) {
            if (this.cartList[item].id === product.id) {
                this.cartList[item].count += 1;
                return;
            }
        }
        this.cartList.push({
            id: product.id,
            count: 1,
        });
        this.counter++;
    }
    remove(product: IProductCard, hard: boolean = false) {
        for (let item of this.cartList) {
            if (item.id === product.id) {
                item.count -= 1;
                if (item.count < 1 || hard) {
                    const index = this.cartList.indexOf(item);
                    this.cartList.splice(index, 1);
                }
            }
            this.counter--;
        }
    }
    show() {
        return this.cartList;
    }
    clear() {
        this.cartList = [];
    }
    length() {
        return this.cartList.reduce((acc, item) => acc + item.count, 0);
    }
    unicItems(): number {
        return this.cartList.length;
    }
}
