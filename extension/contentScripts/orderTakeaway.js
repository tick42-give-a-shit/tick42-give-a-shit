const gotContext = "GOT_Extension";

const getCurrentRestaurantForCheckout = (currUrl = window.location.href) => {
    const urlElements = currUrl.split("/");
    const restaurant = urlElements[urlElements.length - 1].replace('#', '');
    return restaurant.substring("checkout-order-".length);
};

const domContentLoadedCallback = () => {
    // on click of basket

    chrome.runtime.sendMessage({ type: "getTakeawayCart" }, (cart) => {
        const restaurant = getCurrentRestaurantForCheckout()

        const map = JSON.parse(localStorage.getItem("restaurantMap"));
        const orderId = map[restaurant];

        const basket = JSON.parse(localStorage.getItem("Basket"));

        const currentProducts = Object.keys(cart).reduce((productsArray, machineId, index, self) => {
            const products = self[machineId];
            productsArray.push(...products);
            return productsArray
        }, []);

        basket.products[orderId] = currentProducts;

        localStorage.setItem("Basket", basket);
        window.location.reload();
    });
};

// chrome.webRequest.onCompleted.addListener((details) => {
//     if(details.url === ""){
//
//     }
//
//     return {cancel: false}
// });

document.addEventListener("DOMContentLoaded", domContentLoadedCallback);
