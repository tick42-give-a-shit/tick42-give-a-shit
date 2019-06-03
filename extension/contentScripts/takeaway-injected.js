// think of shared place for this constant
const gotContext = "GOT_Extension";
const restaurantMapStorage = "restaurantMap";
let orders = {};

const getCurrentRestaurant = (currUrl = window.location.href) => {
    const urlElements = currUrl.split("/");
    return urlElements[urlElements.length - 1];
};


const domContentLoadedCallback = () => {
    // on click of basket
    const getCurrentRestaurant = (currUrl) => {
        const urlElements = currUrl.split("/");
        return urlElements[urlElements.length - 1];
    };

    window.addEventListener("storage", (key, oldValue, newValue, url, storageArea) => {
        if (storageArea === "sessionStorage") {
            return;
        }

        if (key === "Basket") {
            const oldBasket = JSON.parse(oldValue);
            const basket = JSON.parse(newValue);

            const newOrderId = Object.keys(basket).find(id => !Object.keys(oldBasket).includes(id));

            const restaurant = getCurrentRestaurant();

            const currentRestaurantMap = JSON.parse(localStorage.getItem(restaurantMapStorage));

            localStorage.setItem(restaurantMapStorage, { ...currentRestaurantMap, [restaurant]: newOrderId });
        }
    });

    chrome.runtime.sendMessage({ type: "getEats" }, (response) => {
        const { takeaway } = response;

        orders = takeaway;
    });
};


const startOrder = () => {
    // take takeaway id !
    window.glue.contexts.subscribe(gotContext, (data, delta, removed, unbsub) => {
        const restaurant = getCurrentRestaurant();
        const currentRestaurantMap = JSON.parse(localStorage.getItem(restaurantMapStorage));

        const takeawayOrderId = currentRestaurantMap[restaurant];

        const products = JSON.parse(localStorage.getItem("Basket"))[takeawayOrderId];

        chrome.runtime.sentMessage({
            type: "startOrder",
            site: "takeaway",
            orderId: takeawayOrderId,
            machineId: window.glue.agm.instance.machine,
            products,
            restaurant
        });

        unbsub();
    });
};

const onOrder = (machineId, products, orderId) => {
    chrome.runtime.sentMessage({
        type: "onOrder",
        site: "takeaway",
        orderId,
        machineId,
        products,
    })
};

if (document.readyState !== 'loading') {
    domContentLoadedCallback();
} else {
    document.addEventListener("DOMContentLoaded", domContentLoadedCallback);
}
