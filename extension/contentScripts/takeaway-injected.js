// think of shared place for this constant
const gotContext = "GOT_Extension";
const restaurantMapStorage = "restaurantMap";
let orders = {};
let shouldInvoke = true;
const updateOrders = () => {
    chrome.runtime.sendMessage({
        type: "getOrdersForRestaurant",
        site: "takeaway",
        restaurant: getCurrentRestaurant()
    }, (response) => {
        orders = response || {};
        if (shouldInvoke) {
            updateDropdownOptions();
        }

    });
};

// const mockOrders = [
//     {
//         restaurant: 'Boom Burgers',
//         platform: 'Takeaway',
//         name: 'Georgi Georgiev',
//         time: '12:30'
//     },
//     {
//         restaurant: 'Cactus',
//         platform: 'Foodpanda',
//         name: 'Svetozar Mateev',
//         time: '13:30'
//     },
//     {
//         restaurant: 'Cactus',
//         platform: 'Takeaway',
//         name: 'Martin Donevski',
//         time: '13:30'
//     }

const updateDropdownOptions = () => {
    shouldInvoke = false;
    let newDropdownContent;
    console.log(orders);
    if (Object.values(orders).length > 0) {
        newDropdownContent = `
    <nav>
      <ul class="drop-down closed">
        <li><a href="#" class="nav-button">Order with a colleague (Tick42 Eats)</a></li>
        ${Object.keys(orders).map((orderId) => `<li><a href="#" class="nav-button tick42-order" id="${orderId}" >${orders[orderId].restaurant} (${orders[orderId].platform}) ${orders[orderId].name} ${orders[orderId].time}</a></li>`)}
      </ul>
    </nav>`;
    } else {
        newDropdownContent = `
    <section class="cartbutton">
      <div id="no-orders" class="cartbutton-button">There are no active orders (Tick42 Eats)</div>
    </section>`;
    }

    const newDropdown = document.createElement('div');
    newDropdown.innerHTML = newDropdownContent;
    const cartbuttonElement = document.getElementsByClassName('cartbutton')[0];
    const menuCartFixedElement = document.getElementsByClassName('menu-cart-fixed')[0];
    if (menuCartFixedElement) {
        menuCartFixedElement.insertBefore(newDropdown, cartbuttonElement);
    }

    const newTick42EatsButtonContent = `
            <section class="cartbutton" >
                <a id="new-tick42-eats" class="cartbutton-button"><input id="time" type="time" value="12:30" required>New order (Tick42 Eats)</a>
    </section>`;
    const newTick42EatsButton = document.createElement('div');
    newTick42EatsButton.innerHTML = newTick42EatsButtonContent;
    if (menuCartFixedElement) {
        menuCartFixedElement.insertBefore(newTick42EatsButton, cartbuttonElement);
    }

    const navButtonElement = document.getElementsByClassName('nav-button')[0];
    if (navButtonElement) {
        navButtonElement.addEventListener('click', function () {
            this.parentNode.parentNode.classList.toggle('closed');
        }, false);
    }

    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.addEventListener('click', (event) => {
            event.stopPropagation();
        }, false);
    }

    const newTick42EatsElement = document.getElementById('new-tick42-eats');
    if (newTick42EatsElement) {
        newTick42EatsElement.addEventListener('click', () => {
            const timeElement = document.getElementById('time');
            const newTick42EatsOrderTime = timeElement.value;
            console.log("TCL: newTick42EatsOrderTime", newTick42EatsOrderTime)

            startOrder();
        }, false);
    }

    const tick42OrderElements = document.getElementsByClassName('tick42-order');
    if (tick42OrderElements) {
        Array.from(tick42OrderElements).forEach((tick42OrderElement) => {
            tick42OrderElement.addEventListener('click', function (e) {
                tick42OrderElement.parentNode.parentNode.classList.toggle('closed');
                console.log(this.innerHTML);
                const restaurant = getCurrentRestaurant();
                const currentRestaurantMap = JSON.parse(localStorage.getItem(restaurantMapStorage));

                const takeawayOrderId = currentRestaurantMap[restaurant];

                const productsFromCart = JSON.parse(localStorage.getItem("Basket"))[takeawayOrderId];
                onOrder(undefined, productsFromCart, e.target.id);
            }, false);
        });
    }
}

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
    let lastBasket = localStorage.getItem("Basket") || "{}";

    setInterval(() => {
        updateOrders();
        const currentBasket = localStorage.getItem("Basket");

        if (lastBasket === "{}" && currentBasket === null) {
            return;
        }
        console.log("asdads", lastBasket, currentBasket);

        if (lastBasket !== currentBasket) {
            const currentRestaurantMap = JSON.parse(localStorage.getItem(restaurantMapStorage) || "{}");

            const restaurant = getCurrentRestaurant(window.location.href);
            let currentRestaurant = currentRestaurantMap[restaurant];

            if (!currentRestaurant) {
                const oldBasket = JSON.parse(lastBasket);
                const basket = JSON.parse(currentBasket);
                lastBasket = currentBasket;

                const newOrderId = Object.keys(basket).find(id => !Object.keys(oldBasket).includes(id));

                localStorage.setItem(restaurantMapStorage, JSON.stringify({
                    ...currentRestaurantMap,
                    [restaurant]: newOrderId
                }));
            }
        }
        lastBasket = currentBasket;
    }, 1000);

    // chrome.runtime.sendMessage({ type: "getEats" }, (response) => {
    //     const { takeaway } = response;

    //     orders = takeaway;
    // });
};


const startOrder = () => {
    // take takeaway id !
    const restaurant = getCurrentRestaurant();
    const currentRestaurantMap = JSON.parse(localStorage.getItem(restaurantMapStorage));

    const takeawayOrderId = currentRestaurantMap[restaurant];

    const productsFromCart = JSON.parse(localStorage.getItem("Basket"))[takeawayOrderId];

    console.log("StartORdrer", takeawayOrderId, JSON.parse(localStorage.getItem("Basket")));

    chrome.runtime.sendMessage({
        type: "startOrder",
        site: "takeaway",
        orderId: takeawayOrderId,
        products: productsFromCart.products,
        restaurant
    });
};

const onOrder = (machineId, products, orderId) => {
    chrome.runtime.sendMessage({
        type: "onOrder",
        site: "takeaway",
        orderId,
        products,
    })
};

if (document.readyState !== 'loading') {
    domContentLoadedCallback();
} else {
    document.addEventListener("DOMContentLoaded", domContentLoadedCallback);
}
