const GlueCore = require('./tick42-glue-core-4.3.7');
let credentials;


chrome.runtime.onInstalled.addListener(() => {
    // Ask for credentials
    prompt("Tell us your name")
    // popup --> it returns credentials
});


chrome.runtime.onStartup.addListener(() => {
    // remote gateway ?
    const glueConfig = {
        agm: true,
        context: true,
        gateway: {}
    };

    GlueCore(glueConfig)
        .then(glue => {
            window.glue = glue;


        });

    // message to popup on change of context
});


