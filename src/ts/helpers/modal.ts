export function isNameOk(name: string): boolean {
    name = name.trim();
    const names = name.split(' ');
    if (names.length < 2) return false;
    if (names.filter((i) => i.length > 0).filter((i) => i.length < 3).length > 0) return false;
    return true;
}

export function isPhoneOk(phone: string): boolean {
    phone = phone.trim();
    if (phone.length < 10) return false;
    if (isNaN(Number(phone.slice(1)))) return false;
    if (phone.slice(0, 1) !== '+') return false;
    return true;
}

export function isAddressOk(address: string): boolean {
    address = address.trim();
    const adressArr = address.split(' ');
    if (adressArr.length < 3) return false;
    if (adressArr.filter((i) => i.length > 0).filter((i) => i.length < 5).length > 0) return false;
    return true;
}

export function isEmailOk(email: string): boolean {
    email = email.trim();
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    if (!EMAIL_REGEXP.test(email)) return false;
    return true;
}

export function isExpiryOk(expiry: string): boolean {
    if (expiry.length !== 5) return false;

    const expiryArrStr = expiry.split('/');
    if (expiryArrStr[0].length !== 2 || expiryArrStr[1].length !== 2) return false;

    const expiryArr = expiry.split('/').map((i) => Number(i));
    if (expiryArr[0] > 12 || expiryArr[0] === 0) return false;
    if (expiryArr[1] < 23 || expiryArr[1] === 0) return false;
    return true;
}

export function isCreditNumberOk(creditNumber: string): boolean {
    if (creditNumber.length < 19) return false;
    return true;
}

export function isCVCOk<Type>(cvv: Type): boolean {
    if ((cvv as string).length !== 3) return false;
    return true;
}

function ccWorker() {
    let ccNumberInput = document.querySelector('.cc-number-input'),
        ccNumberPattern = /^\d{0,16}$/g,
        ccNumberSeparator = ' ',
        ccNumberInputOldValue: string,
        ccNumberInputOldCursor: number,
        ccExpiryInput = document.querySelector('.cc-expiry-input'),
        ccExpiryPattern = /^\d{0,4}$/g,
        ccExpirySeparator = '/',
        ccExpiryInputOldValue: string,
        ccExpiryInputOldCursor,
        ccCVCInput = document.querySelector('.cc-cvc-input'),
        ccCVCPattern = /^\d{0,3}$/g,
        ccCVCInputOldValue: string,
        ccCVCInputOldCursor,
        mask = (value: string, limit: number, separator: string) => {
            var output = [];
            for (let i = 0; i < value.length; i++) {
                if (i !== 0 && i % limit === 0) {
                    output.push(separator);
                }
                output.push(value[i]);
            }
            return output.join('');
        },
        unmask = (value: string) => value.replace(/[^\d]/g, ''),
        checkSeparator = (position: number, interval: number) => Math.floor(position / (interval + 1)),
        ccNumberInputKeyDownHandler = (e: Event) => {
            let el = e.target as HTMLInputElement;
            ccNumberInputOldValue = el.value;
            ccNumberInputOldCursor = el.selectionEnd !== null ? el.selectionEnd : 0;
        },
        ccNumberInputInputHandler = (e: Event) => {
            let el = e.target as HTMLInputElement,
                newValue = unmask(el.value),
                newCursorPosition;

            if (newValue.match(ccNumberPattern)) {
                newValue = mask(newValue, 4, ccNumberSeparator);

                newCursorPosition =
                    ccNumberInputOldCursor -
                    checkSeparator(ccNumberInputOldCursor, 4) +
                    checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4) +
                    (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

                el.value = newValue !== '' ? newValue : '';
            } else {
                el.value = ccNumberInputOldValue;
                newCursorPosition = ccNumberInputOldCursor;
            }

            el.setSelectionRange(newCursorPosition, newCursorPosition);

            highlightCC(el.value);
        },
        highlightCC = (ccValue: string) => {
            let ccCardType = '';
            let ccCardTypePatterns = {
                amex: /^3/,
                visa: /^4/,
                mastercard: /^5/,
                disc: /^6/,
                genric: /(^1|^2|^7|^8|^9|^0)/,
            };

            if (ccCardTypePatterns['amex'].test(ccValue)) ccCardType = 'amex';
            if (ccCardTypePatterns['visa'].test(ccValue)) ccCardType = 'visa';
            if (ccCardTypePatterns['mastercard'].test(ccValue)) ccCardType = 'mastercard';
            if (ccCardTypePatterns['disc'].test(ccValue)) ccCardType = 'disc';
            if (ccCardTypePatterns['genric'].test(ccValue)) ccCardType = 'genric';

            let activeCC = document.querySelector('.cc-types__img--active'),
                newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

            if (activeCC) activeCC.classList.remove('cc-types__img--active');
            if (newActiveCC) newActiveCC.classList.add('cc-types__img--active');
        },
        ccExpiryInputKeyDownHandler = (e: Event) => {
            let el = e.target as HTMLInputElement;
            ccExpiryInputOldValue = el.value;
            ccExpiryInputOldCursor = el.selectionEnd;
        },
        ccExpiryInputInputHandler = (e: Event) => {
            let el = e.target as HTMLInputElement,
                newValue = el.value;

            newValue = unmask(newValue);
            if (newValue.match(ccExpiryPattern)) {
                newValue = mask(newValue, 2, ccExpirySeparator);
                el.value = newValue;
            } else {
                el.value = ccExpiryInputOldValue;
            }
        },
        ccCVCInputKeyDownHandler = (e: Event) => {
            let el = e.target as HTMLInputElement;
            ccCVCInputOldValue = el.value;
            ccCVCInputOldCursor = el.selectionEnd;
        },
        ccCVCInputInputHandler = (e: Event) => {
            let el = e.target as HTMLInputElement,
                newValue = el.value;

            newValue = unmask(newValue);
            if (newValue.match(ccCVCPattern)) {
                el.value = newValue;
            } else {
                el.value = ccCVCInputOldValue;
            }
        };

    ccNumberInput!.addEventListener('keydown', ccNumberInputKeyDownHandler);
    ccNumberInput!.addEventListener('input', ccNumberInputInputHandler);

    ccExpiryInput!.addEventListener('keydown', ccExpiryInputKeyDownHandler);
    ccExpiryInput!.addEventListener('input', ccExpiryInputInputHandler);

    ccCVCInput!.addEventListener('keydown', ccCVCInputKeyDownHandler);
    ccCVCInput!.addEventListener('input', ccCVCInputInputHandler);
}

export function openModal() {
    const modalContent = `
      <div class="modal-header">
          <h3>Personal Details</h3>
      </div>
      <div class="modal-body">
          <form class="modal-form">
              <input class="modal-input modal-name" type="text" placeholder="Firstname Lastname" size="50" required>
              <input class="modal-input modal-tel" type="tel" placeholder="Phone Number" size="50" minlength="10" pattern="^\\+?\\d*$" required>
              <input class="modal-input modal-address" type="text" placeholder="Delivery Address" size="50" required value=>
              <input class="modal-input modal-email" type="email" placeholder="EMail" size="50" required>
              <h4 class="modal-h4">Credit Card</h4>
              <div class="cc-wrapper">	
                  <div class="cc-types">
                      <img class="cc-types__img cc-types__img--amex">
                      <img class="cc-types__img cc-types__img--visa">
                      <img class="cc-types__img cc-types__img--mastercard">
                      <img class="cc-types__img cc-types__img--disc">
                      <img class="cc-types__img cc-types__img--genric">
                  </div>
                  <div class="modal-credit">
                      <input type="text" maxlength="19" class="cc-number-input" placeholder="Credit Card Number" required>
                  </div>
                  <div class="modal-credit">
                      <input type="text" maxlength="5" class="cc-expiry-input" placeholder="ExpDate" required>
                      <input type="text" maxlength="3" class="cc-cvc-input" placeholder="CVC" required>
                  </div>
              </div>
              <div class="confirm">
                  <input class="confirm-button" type="submit" value="Confirm">
              </div>
              <div class="errors">Errors in selected fields!</div>
          </form>
      </div>
      <div class="modal-footer" style="display:none;">
          <h3>Thanks for shopping!</h3>
      </div>
    `;

    const modal = document.querySelector('.modal') as HTMLElement;
    const element: HTMLElement = document.createElement('div');
    element.classList.add('modal-content');
    element.innerHTML = modalContent;
    modal.append(element);
    modal.style.display = 'block';
    const modalError = document.querySelector('.errors') as HTMLDivElement;
    modalError.style.display = 'none';

    ccWorker();

    document.querySelector('.modal-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        let res = true;

        if (!isNameOk((document.querySelector('.modal-name') as HTMLInputElement).value)) {
            (document.querySelector('.modal-name') as HTMLInputElement).style.backgroundColor = '#ee7777';
            res = false;
        } else {
            (document.querySelector('.modal-name') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }

        if (!isPhoneOk((document.querySelector('.modal-tel') as HTMLInputElement).value)) {
            (document.querySelector('.modal-tel') as HTMLInputElement).style.backgroundColor = '#ee7777';
            res = false;
        } else {
            (document.querySelector('.modal-tel') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }

        if (!isAddressOk((document.querySelector('.modal-address') as HTMLInputElement).value)) {
            (document.querySelector('.modal-address') as HTMLInputElement).style.backgroundColor = '#ee7777';
            res = false;
        } else {
            (document.querySelector('.modal-address') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }

        if (!isEmailOk((document.querySelector('.modal-email') as HTMLInputElement).value)) {
            (document.querySelector('.modal-email') as HTMLInputElement).style.backgroundColor = '#ee7777';
            res = false;
        } else {
            (document.querySelector('.modal-email') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }

        if (!isCreditNumberOk((document.querySelector('.cc-number-input') as HTMLInputElement).value)) {
            (document.querySelector('.cc-number-input') as HTMLInputElement).style.backgroundColor = '#ee7777';
            res = false;
        } else {
            (document.querySelector('.cc-number-input') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }

        if (!isExpiryOk((document.querySelector('.cc-expiry-input') as HTMLInputElement).value)) {
            (document.querySelector('.cc-expiry-input') as HTMLInputElement).style.backgroundColor = '#ee7777';
            res = false;
        } else {
            (document.querySelector('.cc-expiry-input') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }

        if (!isCVCOk<String>((document.querySelector('.cc-cvc-input') as HTMLInputElement).value)) {
            (document.querySelector('.cc-cvc-input') as HTMLInputElement).style.backgroundColor = '#ee7777';
            res = false;
        } else {
            (document.querySelector('.cc-cvc-input') as HTMLInputElement).style.backgroundColor = '#ffffff';
        }

        if (res) {
            modalError.style.display = 'none';
            (document.querySelector('.modal-footer') as HTMLDivElement).style.display = 'flex';
            localStorage.clear();
            setTimeout(() => {
                window.location.href = '/';
            }, 5000);
        } else {
            modalError.style.display = 'flex';
        }
    });
}

export function closeModal() {
    const modal = document.querySelector('.modal') as HTMLDivElement;
    modal.innerHTML = '';
    modal.style.display = 'none';
}
