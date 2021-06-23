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
    FB.getLoginStatus();
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
