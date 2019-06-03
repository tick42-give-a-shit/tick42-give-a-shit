# Tick42Hackathon/GiveAShit

GW URL: ws://35.242.253.103:5000/gw


Future considerations:
- changes in WiFi password will break IoT

Context:

````js
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
````
