// KNOWN bug: when two orders happen at the same time one of them might get overriden. Solution: design the context shape to be one level only

const gotContext = "GOT_Extension";
let username;

const contextShape = {
    users: {
        ["id"]: "username"
    },
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
    }
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
            window.machineId = window.glue.agm.instance.machine;
            trySeedInitialState();
            tryMapUsernameToMachine();

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
        });
    });
};

chrome.runtime.onStartup.addListener(() => {
    // message to popup on change of context
});

const handleT42WndCreate = ({ windows }) => windows.forEach(({ name, url, title, mode, tabGroupId }) => glue.agm.invoke('T42.Wnd.Create', { name, url, title, mode, tabGroupId, top: 200, left: 200 }));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "getEats":
            sendResponse(window.context.eats);
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
    });
};

const tryMapUsernameToMachine = () => {
    window.glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
        const isMyMachineRegisted = data.users && data.users[username];

        if (!isMyMachineRegisted) {
            window.glue.contexts.update(gotContext, {
                users: {
                    [username]: window.glue.agm.instance.machine
                }
            });
        }
        unsub();
    });
};

const handleStartOrder = (message) => {
    const { site, orderId, machineId, products, orderTime, restaurant } = message;

    switch (site) {
        case "takeaway":
        case "foodpanda":
            glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
                const currentState = data;

                currentState.eats[site][orderId] = {
                    initiator: machineId,
                    restaurant,
                    orderTime,
                    cart: {
                        [machineId]: products
                    }
                };

                window.glue.contexts.update(gotContext, currentState);

                unsub();
            });
            break;
    }
};

const handleOrder = (message) => {
    const { site, orderId, machineId, products, } = message;

    switch (site) {
        case "takeaway":
        case "foodpanda":
            glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {
                const currentState = data;

                const currentProducts = currentState.eats[site][orderId].cart;
                currentProducts[machineId] = products;

                window.glue.contexts.update(gotContext, currentState);

                unsub();
            });
            break;
    }
};

const executeOrder = (message) => {
    const { restaurant, orderId, site, machineId, products, } = message;

    const url = "https://www.takeaway.com/bg/" + "checkout-order-" + restaurant;

    window.orderId = orderId;

    chrome.tabs.create({ url }, (tab) => {
        chrome.tabs.executeScript(tab.id, {
            file: 'contentScripts/orderTakeaway.js'
        })
    });

};
