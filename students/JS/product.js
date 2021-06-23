const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const checkId = urlParams.get('id');
const url = `https://api.appworks-school.tw/api/1.0/products/details?id=${checkId}`;

// variable for product details
let colorIndex = 0;
let sizeIndex = 0;
let maxQuantity = 0;
let quantity = 1;
let needToReplace = { check: false, index: 0 };

// get data from api
async function getData() {
    const res = await fetch(url);
    const parsedData = await res.json();
    const { data } = parsedData;
    return data;
}

// increment function
function increment(quantityNum) {
    quantity++;
    if (quantity >= maxQuantity) {
        quantity = maxQuantity;
    }
    quantityNum.innerText = quantity;
}

// decrement function
function decrement(quantityNum) {
    quantity--;
    if (quantity <= 1) {
        quantity = 1;
    }
    quantityNum.innerText = quantity;
}

// check how many quantity of specific product remain in the stock
function checkStock(variants, colorsArr, sizesArr) {
    for (let i = 0; i < variants.length; i++) {
        if (
            variants[i].color_code === colorsArr[colorIndex].dataset.color &&
            variants[i].size === sizesArr[sizeIndex].innerText
        ) {
            return variants[i].stock;
        }
    }
}

// my storage
const myStorage = window.localStorage;
if (myStorage.cart === undefined) {
    myStorage.setItem('cart', JSON.stringify([]));
}

// show data function and add event to elements
async function showData() {
    const data = await getData();
    let colorboxColors = '';
    let sizeCircles = '';
    const {
        main_image,
        title,
        id,
        price,
        colors,
        sizes,
        note,
        texture,
        description,
        wash,
        place,
        story,
        images,
        variants,
    } = data;

    // product main img
    const product = document.getElementById('product');
    const mainImage = document.createElement('img');
    mainImage.classList.add('product__main-image');
    mainImage.src = main_image;
    product.append(mainImage);
    //product details
    const productDetails = document.createElement('div');
    productDetails.classList.add('product__details');
    const colorBox = document.createElement('div');
    colorBox.classList.add('product__details__type__colorbox');
    colors.forEach((color, index) => {
        colorboxColors += `<div class="product__details__type__colorbox__color" data-color="${color.code}" data-index="${index}" style="background-color: #${color.code}"></div>`;
    });
    sizes.forEach((size, index) => {
        sizeCircles += `<div class="product__details__type__size__circle" data-index="${index}">${size}</div>`;
    });
    productDetails.innerHTML = `<div class="product__title">${title}</div>
    <div class="product__id">${id}</div>
    <div class="product__price">TWD.${price}</div>
    <div class="product__details__types">
        <div class="product__details__type product__details__type-first">
            <div class="product__details__type-name">顏色</div>
            <div class="product__details__type__colorbox">
                ${colorboxColors}
            </div>
        </div>
        <div class="product__details__type">
            <div class="product__details__type-name">尺寸</div>
            <div class="product__details__type__size">
                ${sizeCircles}
            </div>
        </div>
        <div class="product__details__type product__details__type-thrid">
            <div class="product__details__type-name product__details__type-name--disable">數量</div>
            <div class="product__details__type__quantity">
                <button class="decrement">-</button>
                <div class="product__details__type__quantity__num">${quantity}</div>
                <button class="increment">+</button>
            </div>
        </div>
    </div>
    <button class="cart">加入購物車</button>
    <div class="note">*${note}</div>
    <div class="texture">${texture}</div>
    <pre class="description">${description}</pre>
    <div class="wash">清洗: ${wash}</div>
    <div class="place">產地: ${place}</div>`;
    product.append(productDetails);
    const separate = document.createElement('div');
    // separator
    separate.classList.add('separate');
    separate.innerText = '細部說明';
    product.append(separate);
    const line = document.createElement('div');
    line.classList.add('line');
    product.append(line);
    const productStory = document.createElement('div');
    // product story
    productStory.classList.add('product__story');
    productStory.innerText = story;
    product.append(productStory);
    // product images
    images.forEach((img) => {
        const productImage = document.createElement('img');
        productImage.classList.add('product__image');
        productImage.src = img;
        product.append(productImage);
    });

    // color Array (selector all color box convert them to an array)
    const colorsArr = document.querySelectorAll(
        '.product__details__type__colorbox__color'
    );

    // size Array (selector all size circle convert them to an array)
    const sizesArr = document.querySelectorAll(
        '.product__details__type__size__circle'
    );

    // quantity of specific product
    const quantityNum = document.querySelector(
        '.product__details__type__quantity__num'
    );

    changeSizeIndex(colorsArr[colorIndex], sizes, variants);

    // render defualt color-active and size-active from global variable
    activeSelectDetails(colorsArr, sizesArr, variants, quantityNum);

    // add click event to the individual color box & change the size if out of stock & render again
    colorsArr.forEach((color, index) => {
        color.addEventListener('click', () => {
            colorIndex = index;
            if (
                [...sizesArr[sizeIndex].classList].includes(
                    'product__details__type__size__circle--active'
                ) &&
                checkStock(variants, colorsArr, sizesArr) === 0
            ) {
                changeSizeIndex(color, sizes, variants);
            }
            activeSelectDetails(colorsArr, sizesArr, variants, quantityNum);
        });
    });

    // add click event to the individual size circle & render again
    sizesArr.forEach((size, index) => {
        size.addEventListener('click', () => {
            sizeIndex = index;
            activeSelectDetails(colorsArr, sizesArr, variants, quantityNum);
        });
    });

    // add increment action to the btn
    const incrementBtn = document.querySelector('.increment');
    incrementBtn.addEventListener('click', () => {
        increment(quantityNum);
    });

    // add decrement action to the btn
    const decrementBtn = document.querySelector('.decrement');
    decrementBtn.addEventListener('click', () => {
        decrement(quantityNum);
    });

    const cartCircle = document.querySelectorAll('.cart-num');
    cartCircle.forEach((cart) => {
        cart.innerText = JSON.parse(myStorage.cart).length;
    });

    // add localstorage functionality
    const cartBtn = document.querySelector('.cart');
    cartBtn.addEventListener('click', () => {
        alert('已加入購物車');
        const newCart = new NewCart(
            id,
            title,
            price,
            colors[colorIndex],
            main_image,
            quantityNum.innerText,
            sizes[sizeIndex],
            maxQuantity
        );

        const localCart = JSON.parse(myStorage.getItem('cart'));
        // ============check==============
        function checkNeedToReplace() {
            localCart.forEach((cartItem, index) => {
                if (
                    cartItem.id === newCart.id &&
                    cartItem.color.code === newCart.color.code &&
                    cartItem.size === newCart.size
                ) {
                    needToReplace.check = true;
                    needToReplace.index = index;
                }
            });
        }
        checkNeedToReplace();

        if (needToReplace.check) {
            localCart[needToReplace.index] = newCart;
            needToReplace.check = false;
        } else {
            localCart.push(newCart);
        }
        // ============check==============
        myStorage.setItem('cart', JSON.stringify(localCart));

        cartCircle.forEach((cart) => {
            cart.innerText = JSON.parse(myStorage.cart).length;
        });
    });
}

// render product variants (color box--active, color box--disable,  size circle--active)
function activeSelectDetails(colorsArr, sizesArr, variants, quantityNum) {
    for (let i = 0; i < variants.length; i++) {
        if (
            variants[i].color_code === colorsArr[colorIndex].dataset.color &&
            variants[i].size === sizesArr[sizeIndex].innerText
        ) {
            maxQuantity = variants[i].stock;
            colorsArr.forEach((color, index) => {
                if (index === colorIndex) {
                    color.classList.add(
                        'product__details__type__colorbox__color--active'
                    );
                } else {
                    color.classList.remove(
                        'product__details__type__colorbox__color--active'
                    );
                }
            });
            sizesArr.forEach((size, index) => {
                if (index === sizeIndex) {
                    size.classList.add(
                        'product__details__type__size__circle--active'
                    );
                } else {
                    size.classList.remove(
                        'product__details__type__size__circle--active'
                    );
                }
            });
        } else if (
            variants[i].color_code === colorsArr[colorIndex].dataset.color &&
            variants[i].stock === 0
        ) {
            sizesArr.forEach((size) => {
                if (size.innerText === variants[i].size) {
                    size.classList.remove(
                        'product__details__type__size__circle--active'
                    );
                    size.classList.add(
                        'product__details__type__size__circle--disable'
                    );
                    size.style.pointerEvents = 'none';
                }
            });
        } else if (
            variants[i].color_code === colorsArr[colorIndex].dataset.color &&
            variants[i].stock > 0
        ) {
            sizesArr.forEach((size) => {
                if (size.innerText === variants[i].size) {
                    size.classList.remove(
                        'product__details__type__size__circle--disable'
                    );
                    size.style.pointerEvents = 'auto';
                }
            });
        }
    }
    quantity = 1;
    quantityNum.innerText = quantity;
}

// show the page
showData();

// add to cart event
class NewCart {
    constructor(id, name, price, color, image, qty, size, stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.color = color;
        this.image = image;
        this.qty = qty;
        this.size = size;
        this.stock = stock;
    }
}

// function changeSizeIndex(colorsArr, sizes, variants) {
//     let checkStockArr = [];
//     for (let i = 0; i < variants.length; i++) {
//         if (
//             variants[i].color_code === colorsArr[colorIndex].dataset.color &&
//             variants[i].stock > 0
//         ) {
//             checkStockArr.push(variants[i]);
//         }
//     }

//     const checkedsizeIndex = sizes.indexOf(checkStockArr[0].size);
//     sizeIndex = checkedsizeIndex;
// }

function changeSizeIndex(checkedColor, sizes, variants) {
    let checkStockArr = [];
    for (let i = 0; i < variants.length; i++) {
        if (
            variants[i].color_code === checkedColor.dataset.color &&
            variants[i].stock > 0
        ) {
            checkStockArr.push(variants[i]);
        }
    }

    const checkedsizeIndex = sizes.indexOf(checkStockArr[0].size);
    sizeIndex = checkedsizeIndex;
}
