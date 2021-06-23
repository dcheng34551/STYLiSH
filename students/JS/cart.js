// initialize localStorage if there is no item in the cart list
const myStorage = window.localStorage;
if (myStorage.cart === undefined) {
    myStorage.setItem('cart', JSON.stringify([]));
}

// get cart number beside cart icon
const cartCircle = document.querySelectorAll('.cart-num');
const cartHeaderTitleSpan = document.querySelector('.cart__header__title span');

//check out button
const payBtn = document.querySelector('.payBtn');

// render number beside cart icon
function showCartNum() {
    cartCircle.forEach((cart) => {
        cart.innerText = JSON.parse(myStorage.cart).length;
    });
    cartHeaderTitleSpan.innerText = JSON.parse(myStorage.cart).length;
}
showCartNum();

// get cart item from localStorage and render in the list
const cartLists = document.querySelector('.cart__lists');
function renderList() {
    console.log();
    cartLists.innerHTML = '';
    const cartData = JSON.parse(myStorage.getItem('cart'));
    const cartLength = cartData.length;
    const shipmentSelect = document.querySelector('.shipment__select__pay');
    let transportFee = parseInt(shipmentSelect.value);

    if (cartLength === 0) {
        cartLists.innerHTML =
            '<div class="no__items" style="text-align: center ;padding: 20px 0; font-weight: bold">購物車裡面沒有東西喔!!!</div>';
        // if no item in the list no additional fee
        transportFee = 0;
        payBtn.classList.add('payBtn--disable');
        payBtn.style.pointerEvents = 'none';
    } else {
        payBtn.classList.remove('payBtn--disable');
        payBtn.style.pointerEvents = 'auto';
        for (let i = 0; i < cartLength; i++) {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart__item';
            let cartOptions = '';
            for (let j = 1; j <= cartData[i].stock; j++) {
                cartOptions += `<option data-index="${i}" value="${j}">${j}</option>`;
            }
            cartItem.innerHTML = `
            <img src="${cartData[i].image}">
            <div class="cart__item__details__left__column">
                <div class="cart__item__title">${cartData[i].name}</div>
                <div class="cart__item__id">${cartData[i].id}</div>
                <div class="cart__item__color">顏色 <span>${
                    cartData[i].color.name
                }</span></div>
                <div class="cart__item__size">尺寸 <span>${
                    cartData[i].size
                }</span></div>
            </div>
            <div class="cart__item__header__qty">數量</div>
            <div class="cart__item__header__price">單價</div>
            <div class="cart__item__header__total">小計</div>
            <div class="cart__item__selector__container">
                <select class="cart__item__select">
                    ${cartOptions}
                </select>
            </div>
            <div class="cart__item__price">NT.${cartData[i].price}</div>
            <div class="cart__item__total">NT.${
                cartData[i].price * cartData[i].qty
            }</div>
            <div class="cart__remove"></div>
            `;
            cartLists.append(cartItem);
            const checkOptions = cartItem.querySelectorAll('option');
            checkOptionSelected(checkOptions, cartData[i]);
        }
    }
    // 購物車刪除功能
    const removeBtn = document.querySelectorAll('.cart__remove');

    removeBtn.forEach((remove, index) => {
        remove.addEventListener('click', () => {
            alert('購物車商品已移除');
            // const cartDataArr = JSON.parse(myStorage.getItem('cart'));
            // cartDataArr.splice(index, 1);
            cartData.splice(index, 1);
            myStorage.setItem('cart', JSON.stringify(cartData));
            renderList();
        });
    });

    const selects = document.querySelectorAll('.cart__item__select');
    selects.forEach((select, index) => {
        select.addEventListener('change', (e) => {
            cartData[index].qty = e.target.value;
            myStorage.setItem('cart', JSON.stringify(cartData));
            renderList();
        });
    });

    shipmentSelect.addEventListener('change', (e) => {
        transportFee = parseInt(e.target.value);
        renderList();
    });

    const subtotal = document.querySelector('.subtotal span');
    const total = document.querySelector('.total span');
    const transport = document.querySelector('.transport span');
    const sum = function (arr) {
        let summary = 0;
        for (let i = 0; i < arr.length; i++) {
            summary += parseInt(arr[i].qty) * arr[i].price;
        }
        return summary;
    };

    subtotal.innerText = sum(cartData);
    transport.innerText = transportFee;
    total.innerText = sum(cartData) + transportFee;
    showCartNum();
}

renderList();

function checkOptionSelected(options, checkTarget) {
    options.forEach((option) => {
        let checkValue = option.value;
        if (checkValue === checkTarget.qty) {
            option.selected = true;
        } else {
            option.selected = false;
        }
    });
}
