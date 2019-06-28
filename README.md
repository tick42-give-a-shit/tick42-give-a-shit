# Tick42Hackathon/GiveAShit

GW URL: ws://35.242.253.103:5000/gw

# To install:
1. Locate the ZIP file on your computer and unzip it.
2. Go back to the chrome://extensions/ page and click the Load unpacked extension button and select the unzipped folder for your extension to install it.

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
