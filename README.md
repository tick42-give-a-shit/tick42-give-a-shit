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
    restrooms: [
        {
            floor: 2,
            side: 'LEFT',
            gender: 'M',
            taken: true
        }
    ],
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
