let accessToken;
let checkedPrime; //在 onupdate 時，當信用卡條件符合時傳入
let checkoutDetails = {
    prime: '',
    order: {
        shipping: '',
        payment: '',
        subtotal: 0,
        freight: 0,
        total: 0,
        recipient: {
            name: '',
            phone: '',
            email: '',
            address: '',
            time: '',
        },
        list: [],
    },
};
let statusNum;
let statusExp;
let statusCcv;

// 畫面 重新loading時 先 check 是否登入

// eslint-disable-next-line no-undef
FB.getLoginStatus(function (res) {
    statusCheckCallback(res);
});

function statusCheckCallback(response) {
    if (response.status === 'connected') {
        const token = {
            provider: 'facebook',
            access_token: response.authResponse.accessToken,
        };
        fetchProfileData(token);
        // eslint-disable-next-line no-undef
        needToSignIn = false;
    } else {
        // eslint-disable-next-line no-undef
        needToSignIn = true;
    }
}

async function fetchProfileData(object) {
    const fetcheddata = await fetch(
        'https://api.appworks-school.tw/api/1.0//user/signin',
        {
            body: JSON.stringify(object),
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
        }
    ).then((res) => res.json());
    const parsedData = fetcheddata.data;
    accessToken = parsedData.access_token;
}

// eslint-disable-next-line no-undef
TPDirect.setupSDK(
    '12348',
    'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
    'sandbox'
);

let fields = {
    number: {
        element: '#card-number',
        placeholder: '**** **** **** ****',
    },
    expirationDate: {
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY',
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv',
    },
};

// eslint-disable-next-line no-undef
TPDirect.card.setup({
    fields: fields,
    styles: {
        input: {
            color: 'gray',
        },
        'input.ccv': {
            'font-size': '12px',
        },
        'input.expiration-date': {
            'font-size': '12px',
        },
        'input.card-number': {
            'font-size': '12px',
        },
        ':focus': {
            color: 'black',
        },
        '.valid': {
            color: 'green',
        },
        '.invalid': {
            color: 'red',
        },
        '@media screen and (max-width: 400px)': {
            input: {
                color: 'orange',
            },
        },
    },
});

const submitButton = document.querySelector('.payBtn');

// eslint-disable-next-line no-undef
TPDirect.card.onUpdate(function (update) {
    if (update.canGetPrime) {
        submitButton.removeAttribute('disabled');
        // eslint-disable-next-line no-undef
        TPDirect.card.getPrime((response) => {
            checkedPrime = response.card.prime;
            // checkTest.prime = checkedPrime;
        });
    } else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true);
        checkedPrime = '';
    }

    if (update.status.number === 2) {
        statusNum = 2;
    } else if (update.status.number === 0) {
        statusNum = 0;
    } else {
        statusNum = 1;
    }

    if (update.status.expiry === 2) {
        statusExp = 2;
    } else if (update.status.expiry === 0) {
        statusExp = 0;
    } else {
        statusExp = 1;
    }

    if (update.status.ccv === 2) {
        statusCcv = 2;
    } else if (update.status.ccv === 0) {
        statusCcv = 0;
    } else {
        statusCcv = 1;
    }
});

submitButton.addEventListener('click', () => {
    checkFormValidation();
    // fetchCheckOutData(checkoutDetails, accessToken);
});

const formName = document.getElementById('name');
const formEmail = document.getElementById('email');
const formPhone = document.getElementById('phone');
const formAddress = document.getElementById('address');

function checkFormValidation() {
    if (formName.value === '') {
        alert('請輸入收件人姓名');
    } else if (formEmail.validity.valid === false) {
        alert('Email有誤');
    } else if (formPhone.value.length != 10) {
        alert('手機號碼有誤');
    } else if (formAddress.value === '') {
        alert('請輸入收件地址');
    } else if (statusNum !== 0) {
        alert('請輸入信用卡號碼');
    } else if (statusExp !== 0) {
        alert('有效期限有誤');
    } else if (statusCcv !== 0) {
        alert('安全碼有誤');
        // eslint-disable-next-line no-undef
    } else if (needToSignIn) {
        alert('請先登入會員');
    } else {
        insertCheckoutDetails();
        fetchCheckOutData(checkoutDetails, accessToken);
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

async function fetchCheckOutData(object, token) {
    const fetchedData = await fetch(
        'https://api.appworks-school.tw/api/1.0/order/checkout',
        {
            body: JSON.stringify(object), // must match 'Content-Type' header
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
        }
    ).then((res) => res.json());
    console.log(fetchedData);
    sessionStorage.setItem('order', JSON.stringify(fetchedData));
    window.location.replace('./thanks.html');
}

function insertCheckoutDetails() {
    checkoutDetails.prime = checkedPrime;
    checkoutDetails.order.shipping = 'delivery';
    checkoutDetails.order.payment = 'credit_card';
    checkoutDetails.order.subtotal = +document.querySelector('.subtotal span')
        .innerText;
    checkoutDetails.order.freight = +document.querySelector(
        '.shipment__select__pay'
    ).value;
    checkoutDetails.order.total = +document.querySelector('.total span')
        .innerText;
    checkoutDetails.order.recipient.name = document.querySelector(
        '#name'
    ).value;
    checkoutDetails.order.recipient.phone = document.querySelector(
        '#phone'
    ).value;
    checkoutDetails.order.recipient.email = document.querySelector(
        '#email'
    ).value;
    checkoutDetails.order.recipient.address = document.querySelector(
        '#address'
    ).value;
    // document.querySelector('.time')
    checkoutDetails.order.recipient.time = 'morning';
    checkoutDetails.order.list = JSON.parse(localStorage.cart);
    return checkoutDetails;
}
