const thankOrder = document.querySelector('.thank__order');

const sessionOrder = sessionStorage.getItem('order');
const parsedOrder = JSON.parse(sessionOrder);

if (!sessionOrder) {
    window.location.replace('./index.html');
} else {
    thankOrder.innerText = parsedOrder.data.number;
}
