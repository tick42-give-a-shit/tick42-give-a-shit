// KNOWN bug: when two orders happen at the same time one of them might get overriden. Solution: design the context shape to be one level only

const gotContext = "GOT_Extension";
let username;

const contextShape = {
    users: [
        "username"
    ],
    restrooms: {
        ["2MLEFT"]: false
    },
    milk: true,
    eats: {
        takeaway: {
            ["orderId"]: {
                initiator: 'userId',
                restaurant: '',
                orderTime: Date.now(),
                cart: {
                    ['userId']: []
                }
            }
        }
    },
    air: 20
};


chrome.runtime.onInstalled.addListener(() => {
    username = prompt('Tell us your name');

    const glueConfig = {
        agm: true,
        context: true,
        auth: {
            username: "tick42_got",
            password: "glue_extension"
        },
        gateway: {
            ws: "ws://35.242.253.103:5000/gw",
        }
    };

    console.log(glueConfig);

    GlueCore(glueConfig)
        .then(glue => {
            window.glue = glue;
            window.machineId = username;
            trySeedInitialState();
            // tryMapUsernameToMachine();
            saveUsername();

            handleContextChanged()
        });
});

const handleContextChanged = () => {
    glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
        window.context = data;

        const views = chrome.extension.getViews({
            type: "popup"
        });

        console.log("updated", views, window.context);
        views.forEach(view => {
            view.updateEats(window);
            view.updateRestrooms(window);
            view.updateMilk(window);
            view.updateAirConditioner(window);
        });
    });
};

chrome.runtime.onStartup.addListener(() => {
    // message to popup on change of context
});

const handleT42WndCreate = ({ windows }) => windows.forEach(({ name, url, title, mode, tabGroupId }) => glue.agm.invoke('T42.Wnd.Create', {
    name,
    url,
    title,
    mode,
    tabGroupId,
    top: 200,
    left: 200
}));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "getEats":
            sendResponse(window.context.eats);
            break;
        case "executeOrder":
            executeOrder(message);
            break;
        case "getTakeawayCart":
            sendResponse(window.context.eats.takeaway[window.nextToExecute].cart);
            break;
        case "getOrdersForRestaurant":
            const { site, restaurant } = message;
            const ordersAsObjects = window.context.eats[site];
            const orders = Object.keys(ordersAsObjects).filter((k) => {

                if (restaurant[restaurant.length - 1] == "#") {
                    return ordersAsObjects[k].restaurant === restaurant.slice(0, -1);
                }
                return ordersAsObjects[k].restaurant === restaurant;
            });
            let resultObject = {};

            orders.forEach(k => resultObject = { ...resultObject, [k]: ordersAsObjects[k] });
            sendResponse(resultObject);
            break;

        case "setAir":
            const { value } = message;
            window.glue.contexts.update(gotContext, { air: value })

            break;

        // case "getMachineId":
        //     sendResponse(window.glue.agm.instance.machine);
        //     break;
        case "startOrder":
            handleStartOrder(message);
            break;
        case "onOrder":
            handleOrder(message);
            break;
        case "T42WndCreate":
            handleT42WndCreate(message);
            break;
    }
});


const trySeedInitialState = () => {
    window.glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
        console.log("TCL: trySeedInitialState -> data", data)
        if (!data.users) {
            window.glue.contexts.update(gotContext, {
                users: {}
            });
        }
        if (!data.eats) {
            window.glue.contexts.update(gotContext, {
                eats: {
                    takeaway: {},
                    foodpanda: {}
                }
            });
        }
        if (!data.restrooms) {
            window.glue.contexts.update(gotContext, {
                restrooms: {
                    ["2MLEFT"]: undefined,
                    ["2MRIGHT"]: undefined,
                    ["2FLEFT"]: undefined,
                    ["2FRIGHT"]: undefined,
                    ["3MLEFT"]: false,
                    ["3MRIGHT"]: false,
                    ["3FLEFT"]: false,
                    ["3FRIGHT"]: false,
                    ["4MLEFT"]: false,
                    ["4MRIGHT"]: false,
                    ["4FLEFT"]: false,
                    ["4FRIGHT"]: false,
                }
            });
        }
        if (data.milk === undefined) {
            window.glue.contexts.update(gotContext, {
                milk: true
            });
        }
        if (data.air === undefined) {
            window.glue.contexts.update(gotContext, {
                air: 20
            });
        }
    });
};

// const tryMapUsernameToMachine = () => {
//     window.glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
//         const isMyMachineRegisted = data.users && data.users[username];
//
//         if (!isMyMachineRegisted) {
//             window.glue.contexts.update(gotContext, {
//                 users: {
//                     [username]: window.glue.agm.instance.machine
//                 }
//             });
//         }
//         unsub();
//     });
// };

const saveUsername = () => {
    window.glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
        console.log("TCL: saveUsername -> data", data)
        console.log("TCL: saveUsername -> JSON.stringify(data) === '{}'", JSON.stringify(data) === '{}')
        if (JSON.stringify(data) === '{}') {
            console.log('returning');
            return;
        }

        if (Object.keys(data.users).includes(username)) {
            console.error("ALREDY TAKEN")
            return;
        }

        window.glue.contexts.update(gotContext, {
            users: {
                [username]: username
            }
        });

        unsub();
    });
};

const handleStartOrder = (message) => {
    const { site, orderId, products, orderTime = Date.now(), restaurant } = message;

    const machineId = username;
    console.log("Message", message)
    switch (site) {
        case "takeaway":
        case "foodpanda":
            glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
                unsub();

                const newEats = JSON.parse(JSON.stringify({ ...data.eats }));

                newEats[site][orderId] = {
                    initiator: machineId,
                    restaurant,
                    orderTime,
                    cart: {
                        [machineId]: products
                    }
                };
                console.log("currentState", newEats);

                window.glue.contexts.update(gotContext, { eats: newEats });
            });
            break;
    }
};

const handleOrder = (message) => {
    const { site, orderId, products, } = message;
    debugger;
    const machineId = username;

    switch (site) {
        case "takeaway":
        case "foodpanda":
            glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
                unsub();
                const currentState = JSON.parse(JSON.stringify({ ...data }));

                const currentProducts = currentState.eats[site][orderId].cart;
                currentProducts[machineId] = products;

                window.glue.contexts.update(gotContext, currentState);
            });
            break;
    }
};


const executeOrder = (message) => {
    const { restaurant, orderId } = message;
    window.nextToExecute = orderId;

    const url = "https://www.takeaway.com/bg/" + "checkout-order-" + restaurant;

    window.orderId = orderId;

    chrome.tabs.create({ url }, (tab) => {
        chrome.tabs.executeScript(tab.id, {
            file: 'contentScripts/orderTakeaway.js'
        })
    });

};
