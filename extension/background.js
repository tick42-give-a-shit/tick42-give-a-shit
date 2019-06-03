const gotContext = "GOT_Extension";
let credentials;

const contextShape = {
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
        takeaway: [
            {
                initiator: 'userId',
                restaurant: '',
                orderTime: Date.now(),
                cart: {
                    ['userId']: {}
                }
            }
        ]
    }
};


chrome.runtime.onInstalled.addListener(() => {
    // Ask for credentials
    credentials = prompt('Tell us your name')
    // popup --> it returns credentials
});


chrome.runtime.onStartup.addListener(() => {
    // remote gateway ?
    const glueConfig = {
        agm: true,
        context: true,
        auth: {
            username: "Tick42_GOT",
            password: "glue_extension"
        },
        gateway: {
            ws: "ws://35.242.253.103:5000/gw",
        }
    };

    console.log(glueConfig);

    GlueCore(glueConfig)
        .then(glue => {
            console.log("GLUE", glue);
            window.glue = glue;
            const unsubPromise = glue.contexts.subscribe(gotContext, (data, delta, removed, unsub) => {


                const p = document.getElementById('contextP');
                p.text = JSON.stringify(data)
                // chrome.runtime.sendMessage({ greeting: 'hello' }, (response) => {
                //     console.log(response.farewell);
                // });
            });

        });

    // message to popup on change of context
});
