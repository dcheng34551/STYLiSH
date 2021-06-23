let needToSignIn = false;

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        window.location.replace('./profile.html');
        needToSignIn = false;
    } else {
        // eslint-disable-next-line no-undef
        FB.login(
            (res) => {
                if (res.status === 'connected') {
                    // eslint-disable-next-line no-unused-vars
                    needToSignIn = false;
                }
            },
            {
                scope: 'email',
                return_scopes: true,
            }
        );
    }
}

const memberBtn = document.querySelectorAll('.member');
memberBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        // eslint-disable-next-line no-undef
        FB.getLoginStatus(function (res) {
            statusChangeCallback(res);
        });
    });
});
