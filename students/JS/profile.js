const cartCircle = document.querySelectorAll('.cart-num');
const myStorage = window.localStorage;
cartCircle.forEach((cart) => {
    cart.innerText = JSON.parse(myStorage.cart).length;
});

async function fetchProfileData(object) {
    const fetcheddata = await fetch(
        'https://api.appworks-school.tw/api/1.0//user/signin',
        {
            body: JSON.stringify(object), // must match 'Content-Type' header
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
        }
    ).then((res) => res.json());
    const parsedData = fetcheddata.data;
    renderProfile(parsedData);
}

function renderProfile(data) {
    const profileImg = document.querySelector('.profile__img');
    profileImg.src = data.user.picture;
    const profileName = document.querySelector('.profile__name');
    profileName.innerText = data.user.name;
    const profileEmail = document.querySelector('.profile__email');
    profileEmail.innerText = data.user.email;
}

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        const token = {
            provider: 'facebook',
            access_token: response.authResponse.accessToken,
        };
        fetchProfileData(token);
    } else {
        window.location.replace('./index.html');
    }
}

window.fbAsyncInit = async function () {
    // eslint-disable-next-line no-undef
    FB.init({
        appId: '499684754555842',
        cookie: true,
        xfbml: true,
        version: 'v10.0',
    });

    // eslint-disable-next-line no-undef
    FB.AppEvents.logPageView();

    // eslint-disable-next-line no-undef
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

(function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');
