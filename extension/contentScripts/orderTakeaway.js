const getCurrentRestaurantForCheckout = (currUrl = window.location.href) => {
    const urlElements = currUrl.split("/");
    const restaurant = urlElements[urlElements.length - 1].replace('#', '');
    return restaurant.substring("checkout-order-".length);
};

const domContentLoadedCallback1 = () => {
    // on click of basket

    chrome.runtime.sendMessage({ type: "getTakeawayCart" }, (cart) => {
        const restaurant = getCurrentRestaurantForCheckout()

        const map = JSON.parse(localStorage.getItem("restaurantMap"));
        const orderId = map[restaurant];

        const basket = JSON.parse(localStorage.getItem("Basket"));

        console.log("1...", cart, basket);
        const currentProducts = Object.keys(cart).reduce((productsArray, username, index, self) => {
            const products = self[username];
            productsArray.push(...products);
            return productsArray
        }, []);

        console.log("2...", orderId, currentProducts);

        basket.products[orderId] = currentProducts;

        localStorage.setItem("Basket", basket);
        window.location.reload();
    });
};

if (document.readyState !== 'loading') {
    domContentLoadedCallback1();
} else {
    document.addEventListener("DOMContentLoaded", domContentLoadedCallback1);
}
