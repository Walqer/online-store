import { Promocodes } from '../types/interface';
export async function loadPromocodes() {
    const res = await fetch(`data/promocodes.json`);
    const data = await res.json();
    return data.promocodes;
}

export async function checkPromocode(promocode: string) {
    let isCorrect = false;
    const promocodesList: Promocodes[] = await loadPromocodes();
    promocodesList.forEach(function (el) {
        if (el.code === promocode) {
            isCorrect = true;
        }
    });
    return isCorrect;
}
export async function getPromocode(promocode: string, list: Promocodes[]) {
    const promocodesList: Promocodes[] = await loadPromocodes();
    if (await checkPromocode(promocode)) {
        let result = null;
        promocodesList.forEach(function (el) {
            if (el.code === promocode) {
                result = el;
            }
        });
        list.forEach(function (el) {
            if (el.code === promocode) {
                result = null;
            }
        });
        return result;
    }
}

export function generatePromoItem(list: Promocodes[], domElement: HTMLElement) {
    domElement.innerHTML = '';
    for (let key of list) {
        const newCode = `<div class="summary__promocodes-item" data-promoid="${key.id}">${key.description} 
        ${key.discountPercentage}%<button>DROP</button></div>`;
        domElement!.insertAdjacentHTML('beforeend', newCode);
        localStorage.setItem('promo', JSON.stringify(list));
    }
}

export function removePromo(list: Promocodes[], promoId: number) {
    for (let item of list) {
        if (item.id == promoId) {
            list.splice(list.indexOf(item), 1);
        }
    }
    localStorage.setItem('promo', JSON.stringify(list));
}

export function getPromoDiscount(list: Promocodes[]) {
    return list.reduce((acc, item) => acc + item.discountPercentage, 0);
}
