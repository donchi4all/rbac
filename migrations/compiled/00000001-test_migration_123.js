'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Grants", deps: []
 * createTable "GrantTypes", deps: []
 * createTable "Permissions", deps: []
 * createTable "Roles", deps: []
 * createTable "RolePrivileges", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "test_migration_123",
    "created": "2021-04-01T09:50:23.092Z",
    "comment": ""
};

var migrationCommands = [

    {
        fn: "createTable",
        params: [
            "Grants",
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
                "slug": {
                    "allowNull": false,
                    "type": Sequelize.STRING(48)
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
            "GrantTypes",
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
            "Permissions",
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
                "slug": {
                    "allowNull": false,
                    "type": Sequelize.STRING(48)
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
            "Roles",
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
                "slug": {
                    "allowNull": false,
                    "type": Sequelize.STRING(48)
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
            "RolePrivileges",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "idRole": {
                    "allowNull": false,
                    "type": Sequelize.INTEGER
                },
                "idPermission": {
                    "allowNull": false,
                    "type": Sequelize.INTEGER
                },
                "idGrant": {
                    "allowNull": false,
                    "type": Sequelize.INTEGER
                },
                "idGrantType": {
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
        params: ["Grants"]
    },
    {
        fn: "dropTable",
        params: ["GrantTypes"]
    },
    {
        fn: "dropTable",
        params: ["Permissions"]
    },
    {
        fn: "dropTable",
        params: ["Roles"]
    },
    {
        fn: "dropTable",
        params: ["RolePrivileges"]
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
