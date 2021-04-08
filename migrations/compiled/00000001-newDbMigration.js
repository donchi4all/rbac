'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "grant", deps: []
 * createTable "grantType", deps: []
 * createTable "permission", deps: []
 * createTable "role", deps: []
 * createTable "rolePrivilege", deps: [role, permission, grant, grantType]
 *
 **/

var info = {
    "revision": 1,
    "name": "newDbMigration",
    "created": "2021-04-07T08:55:08.024Z",
    "comment": ""
};

var migrationCommands = [

    {
        fn: "createTable",
        params: [
            "grant",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "title": {
                    "allowNull": false,
                    "type": Sequelize.STRING(255)
                },
                "description": {
                    "type": Sequelize.STRING(255)
                },
                "active": {
                    "allowNull": false,
                    "type": Sequelize.BOOLEAN
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "grantType",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "name": {
                    "allowNull": false,
                    "type": Sequelize.STRING(48)
                },
                "createdAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "permission",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "title": {
                    "allowNull": false,
                    "type": Sequelize.STRING(255)
                },
                "description": {
                    "type": Sequelize.STRING(255)
                },
                "active": {
                    "allowNull": false,
                    "type": Sequelize.BOOLEAN
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "role",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "title": {
                    "allowNull": false,
                    "type": Sequelize.STRING(255)
                },
                "description": {
                    "type": Sequelize.STRING(255)
                },
                "active": {
                    "allowNull": false,
                    "type": Sequelize.BOOLEAN
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "rolePrivilege",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "idRole": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "role",
                        "key": "id"
                    },
                    "allowNull": false,
                    "type": Sequelize.INTEGER
                },
                "idPermission": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "permission",
                        "key": "id"
                    },
                    "allowNull": false,
                    "type": Sequelize.INTEGER
                },
                "idGrant": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "grant",
                        "key": "id"
                    },
                    "allowNull": false,
                    "type": Sequelize.INTEGER
                },
                "idGrantType": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "grantType",
                        "key": "id"
                    },
                    "allowNull": false,
                    "type": Sequelize.INTEGER
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    }
];

var rollbackCommands = [{
        fn: "dropTable",
        params: ["rolePrivilege"]
    },
    {
        fn: "dropTable",
        params: ["grant"]
    },
    {
        fn: "dropTable",
        params: ["grantType"]
    },
    {
        fn: "dropTable",
        params: ["permission"]
    },
    {
        fn: "dropTable",
        params: ["role"]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    down: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < rollbackCommands.length)
                {
                    let command = rollbackCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
