GlueCore({
    agm: true,
    context: true,
    auth: {
        username: "tick42_got",
        password: "glue_extension"
    },
    gateway: {
        ws: "ws://35.242.253.103:5000/gw",
    }
}).then((glue) => {
    window.glue = glue;
    return Glue4Office({
        application: 'Office Interop',
        excel: false,		// enable Excel interop
        word: false,		// enable Word interop
        outlook: true	// disable Outlook interop
    })
}).then((g4o) => {
    window.g40 = g4o;
    glue.agm.register("GOT.SendMilkEmail", () => {
        g4o.outlook.newEmail({
            to: 'milk@man.com',
            cc: ['another@domain.com', 'yetanother@domain.com'],
            subject: 'Plis give us milk',
            body: 'We want milk.'
        })
    });
}).catch(console.log);