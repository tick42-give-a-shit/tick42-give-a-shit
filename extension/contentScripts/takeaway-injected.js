Storage.prototype.setItem = (key, value) => {
    const oldValue = localStorage.getItem(key);
    localStorage.setItem(key, value);
    const newValue = localStorage.getItem(key);
    window.dispatchEvent(new Event('storage', [key, oldValue, newValue]));
}

// think of shared place for this constant
const gotContext = "GOT_Extension";
const restaurantMapStorage = "restaurantMap";
let orders = {};

const mockOrders = [
    {
        restaurant: 'Boom Burgers',
        platform: 'Takeaway',
        name: 'Georgi Georgiev',
        time: '12:30'
    },
    {
        restaurant: 'Cactus',
        platform: 'Foodpanda',
        name: 'Svetozar Mateev',
        time: '13:30'
    },
    {
        restaurant: 'Cactus',
        platform: 'Takeaway',
        name: 'Martin Donevski',
        time: '13:30'
    }
];

const newDropdownContent = `
<nav>
  <ul class="drop-down closed">
    <li><a href="#" class="nav-button">Order with a colleague (Tick42 Eats)</a></li>
    ${mockOrders.map(({ restaurant, platform, name, time }) => `<li><a href="#" class="nav-button tick42-order">${restaurant} (${platform}) ${name} ${time}</a></li>`)}
  </ul>
</nav>`;
const newDropdown = document.createElement('div');
newDropdown.innerHTML = newDropdownContent;
const cartbuttonElement = document.getElementsByClassName('cartbutton')[0];
const menuCartFixedElement = document.getElementsByClassName('menu-cart-fixed')[0];
if (typeof menuCartFixedElement !== 'undefined') {
    menuCartFixedElement.insertBefore(newDropdown, cartbuttonElement);
}

const newTick42EatsButtonContent = `
<section class="cartbutton">
	<a href="#" class="cartbutton-button">New order (Tick42 Eats)</a>
</section>`;
const newTick42EatsButton = document.createElement('div');
newTick42EatsButton.innerHTML = newTick42EatsButtonContent;
if (typeof menuCartFixedElement !== 'undefined') {
    menuCartFixedElement.insertBefore(newTick42EatsButton, cartbuttonElement);
}

document.getElementsByClassName('nav-button')[0].addEventListener('click', function () {
    this.parentNode.parentNode.classList.toggle('closed');
}, false);

const tick42OrderElements = document.getElementsByClassName('tick42-order');
Array.from(tick42OrderElements).forEach((tick42OrderElement) => {
    tick42OrderElement.addEventListener('click', function () {
        tick42OrderElement.parentNode.parentNode.classList.toggle('closed');
        console.log(this.innerHTML);
    }, false);
});

const getCurrentRestaurant = (currUrl = window.location.href) => {
    const urlElements = currUrl.split("/");
    return urlElements[urlElements.length - 1];
};

const domContentLoadedCallback = () => {
    // on click of basket

    const injectDropdown = () => {
        // This might actually work
        const container = document.getElementsByClassName("cartbutton")[0];
        if (!container) {
            return;
        }
        const selectElement = document.createElement("SELECT");
        const restaurantName = getCurrentRestaurant(window.location.href);

        orders.filter(o => o.restaurant === restaurantName).forEach((o) => {
            const optionElement = document.createElement("OPTION", { value: o.initiator });
            selectElement.appendChild(optionElement);
        });
        container.innerHTML = selectElement;
    }

    const getCurrentRestaurant = (currUrl) => {
        const urlElements = currUrl.split("/");
        return urlElements[urlElements.length - 1];
    };

    window.addEventListener("storage", (key, oldValue, newValue) => {
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

        chrome.runtime.sendMessage({
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
    chrome.runtime.sendMessage({
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
