const productsList = document.querySelector('.products-list');
let trigger = true;
let nextPaging = 1;
let typeOfQuery = 'all';
const mainContent = document.querySelector('.main-content');
const myStorage = window.localStorage;
if (myStorage.cart === undefined) {
    myStorage.setItem('cart', JSON.stringify([]));
}

function showProductsList(productsData) {
    for (let i = 0; i < productsData.length; i++) {
        const colorBoxes = document.createElement('DIV');
        colorBoxes.className = 'color-boxes';
        for (let j = 0; j < productsData[i].colors.length; j++) {
            colorBoxes.innerHTML += `<div class="color-box" style="background-color: #${productsData[i].colors[j].code}"></div>`;
        }
        const newProduct = document.createElement('DIV');
        newProduct.className = 'product';
        newProduct.innerHTML = `
        <a href="./product.html?id=${productsData[i].id}" class="product-details">
            <img src="${productsData[i].main_image}" alt="${productsData[i].title}">
            <h3>${productsData[i].title}</h3>
            <p>TWD. ${productsData[i].price}</p>
        </a>`;
        productsList.append(newProduct);
        const productImage = newProduct.querySelector(
            '.product .product-details img'
        );
        productImage.insertAdjacentElement('afterend', colorBoxes);
    }
}

function fetchData(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function ({ data, next_paging }) {
            showProductsList(data);
            nextPaging = next_paging;
            trigger = true;
        });
}

function checkTypeOfQuery(url) {
    const saperation = url.split('=');
    return saperation[saperation.length - 1];
}

function checkURL() {
    const input = document.querySelectorAll('input');
    input.value = '';
    const myURL = window.location.href;
    const allClothesType = document.querySelectorAll('.clothes-type');
    allClothesType.forEach((type) =>
        type.classList.remove('clothes-type--active')
    );
    const allClothesType_sm = document.querySelectorAll('.sm-clothes-type');
    allClothesType_sm.forEach((type) =>
        type.classList.remove('sm-clothes-type--active')
    );
    // show how many products in the cart
    const cartCircle = document.querySelectorAll('.cart-num');
    cartCircle.forEach((cart) => {
        cart.innerText = JSON.parse(myStorage.cart).length;
    });

    if (window.location.search) {
        typeOfQuery = checkTypeOfQuery(myURL);
        if (
            typeOfQuery === 'women' ||
            typeOfQuery === 'men' ||
            typeOfQuery === 'accessories'
        ) {
            fetchData(
                `https://api.appworks-school.tw/api/1.0/products/${typeOfQuery}`
            );
            const triggerTypeColor = document.getElementById(`${typeOfQuery}`);
            triggerTypeColor.classList.add('clothes-type--active');
            const triggerTypeColor_sm = document.getElementById(
                `sm-${typeOfQuery}`
            );
            triggerTypeColor_sm.classList.add('sm-clothes-type--active');
        } else if (typeOfQuery === '') {
            mainContent.innerHTML = '<p>搜尋不到產品喔</p>';
            trigger = false;
        } else {
            const checkKeywordApi = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${typeOfQuery}`;
            fetch(checkKeywordApi)
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    const { data, next_paging } = result;
                    if (data.length > 0) {
                        showProductsList(data);
                        nextPaging = next_paging;
                        trigger = true;
                    } else {
                        mainContent.innerHTML = '<p>搜尋不到產品喔</p>';
                        trigger = false;
                    }
                });
        }
    } else {
        fetchData(
            `https://api.appworks-school.tw/api/1.0/products/${typeOfQuery}`
        );
    }
}

window.onload = checkURL();

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const bodyShow = document.querySelector('body');
    const footer = document.querySelector('footer');
    const windowHeight = window.innerHeight;
    let bodyHeight = bodyShow.offsetHeight;
    if (y + windowHeight >= bodyHeight - footer.scrollHeight) {
        if (trigger && nextPaging) {
            if (
                typeOfQuery === 'women' ||
                typeOfQuery === 'men' ||
                typeOfQuery === 'accessories' ||
                typeOfQuery === 'all'
            ) {
                trigger = false;
                const url = `https://api.appworks-school.tw/api/1.0/products/${typeOfQuery}?paging=${nextPaging}`;
                fetchData(url);
            } else {
                return;
            }
        } else {
            return;
        }
    }
});

// 輪播器功能

let heroIndex = 0;
let dataLength;
const tryThis = document.getElementById('tryThis');
const dotsNum = document.getElementById('dots-num');
const heros = document.querySelector('.heros');
const heroDots = document.querySelector('.hero-dots');

function checkHero() {
    if (heroIndex > dataLength - 1) {
        heroIndex = heroIndex % dataLength;
    }
    const checkHerosArray = heros.querySelectorAll('.hero');
    const checkDotsArray = heroDots.querySelectorAll('.hero-dot');
    checkHerosArray.forEach((hero) => {
        const dataSetNum = parseInt(hero.dataset.tag);
        if (dataSetNum === heroIndex) {
            hero.classList.add('hero--active');
        } else {
            hero.classList.remove('hero--active');
        }
    });
    checkDotsArray.forEach((dot) => {
        const dataSetNum = parseInt(dot.dataset.tag);
        if (dataSetNum === heroIndex) {
            dot.classList.add('hero-dot--active');
        } else {
            dot.classList.remove('hero-dot--active');
        }
    });
}

let startCounting = setInterval(() => {
    heroIndex++;
    checkHero();
}, 5000);

fetch('https://api.appworks-school.tw/api/1.0/marketing/campaigns')
    .then(function (response) {
        return response.json();
    })
    .then(function ({ data }) {
        dataLength = data.length;
        const dataTry = data.forEach((heroContent, index) => {
            const clone = tryThis.content.cloneNode(true);
            const hero = clone.querySelector('.hero');
            const heroText = clone.querySelector('.hero-text');
            hero.style.backgroundImage = `url(${heroContent.picture})`;
            hero.href = `./product.html?id=${heroContent.product_id}`;
            hero.dataset.tag = index;
            heroText.textContent = heroContent.story;
            heros.appendChild(clone);

            const clone2 = dotsNum.content.cloneNode(true);
            const heroDot = clone2.querySelector('.hero-dot');
            heroDot.dataset.tag = index;
            heroDots.appendChild(clone2);
        });
        return dataTry;
    })
    .then(function () {
        checkHero();
        const dotsArray = heroDots.querySelectorAll('.hero-dot');
        const herosArray = heros.querySelectorAll('.hero');
        dotsArray.forEach((dot) => {
            dot.addEventListener('click', () => {
                const dataSetNum = parseInt(dot.dataset.tag);
                heroIndex = dataSetNum;
                checkHero();
                clearInterval(startCounting);
                startCounting = setInterval(() => {
                    heroIndex++;
                    checkHero();
                }, 5000);
            });
        });
        herosArray.forEach((hero) => {
            hero.addEventListener('mouseover', () => {
                clearInterval(startCounting);
            });
            hero.addEventListener('mouseout', () => {
                startCounting = setInterval(() => {
                    heroIndex++;
                    checkHero();
                }, 5000);
            });
        });
    });
