module.exports.commands = [
    {
        name: `setup`,
        description: `ArikenCompany setup command`,
        options: [
            {
                type: `SUB_COMMAND`,
                name: `panel`,
                description: `setup command panel`
            },
            {
                type: `SUB_COMMAND`,
                name: `template`,
                description: `setup command value templates`,
                options: [
                    {
                        type: `STRING`,
                        name: `command`,
                        description: `target command name`,
                        required: true
                    }
                ]
            }
        ]
    }
];
