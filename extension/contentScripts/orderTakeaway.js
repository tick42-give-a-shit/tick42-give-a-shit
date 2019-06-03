const gotContext = "GOT_Extension";

const domContentLoadedCallback = () => {
    // on click of basket
    const getCurrentRestaurant = (currUrl) => {
        const urlElements = currUrl.split("/");
        return urlElements[urlElements.length - 1];
    };

    chrome.extension.getBackgroundPage((backgroundWindow) => {
        let orderId = backgroundWindow.orderId;

        backgroundWindow.glue.contexts.subscribe(gotContext, (data, delta, removed, unbsub) => {
            const basket = JSON.parse(localStorage.getItem("Basket"));

            const currentState = data;

            const currentProducts = Object.keys(currentState.eats["takeaway"][orderId].cart).reduce((productsArray, machineId, index, self) => {
                const products = self[machineId];
                productsArray.push(...products);
                return productsArray
            }, []);

            basket.products[orderId] = currentProducts;

            localStorage.setItem("Basket", basket);
            unbsub();
        });
    });
};

document.addEventListener("DOMContentLoaded", domContentLoadedCallback);
