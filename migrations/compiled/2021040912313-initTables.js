/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const Sequelize = require('sequelize');

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

const info = {
  'revision': 1,
  'name': 'initTables',
  'created': '2021-04-09T13:23:13.011Z',
  'comment': ''
};

const migrationCommands = [
  /**
   * CREATE
   * GRANT TABLE
   */
  {
    fn: 'createTable',
    params: [
      'grant',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'title': {
          'allowNull': false,
          'type': Sequelize.STRING(255)
        },
        'description': {
          'type': Sequelize.STRING(255),
          'defaultValue': ''
        },
        'active': {
          'allowNull': false,
          'type': Sequelize.BOOLEAN
        },
        'createdAt': {
          'type': Sequelize.DATE,
          'defaultValue': Sequelize.fn('now')
        },
        'updatedAt': {
          'type': Sequelize.DATE,
          'defaultValue': Sequelize.fn('now')
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * GRANT TYPE TABLE
   */
  {
    fn: 'createTable',
    params: [
      'grantType',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'name': {
          'allowNull': false,
          'type': Sequelize.STRING(48)
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * PERMISSON TABLE
   */
  {
    fn: 'createTable',
    params: [
      'permission',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'title': {
          'allowNull': false,
          'type': Sequelize.STRING(255)
        },
        'description': {
          'type': Sequelize.STRING(255),
          'defaultValue': ''
        },
        'active': {
          'allowNull': false,
          'type': Sequelize.BOOLEAN
        },
        'createdAt': {
          'type': Sequelize.DATE,
          'defaultValue': Sequelize.fn('now')
        },
        'updatedAt': {
          'type': Sequelize.DATE,
          'defaultValue': Sequelize.fn('now')
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * ROLE TABLE
   */
  {
    fn: 'createTable',
    params: [
      'role',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'title': {
          'allowNull': false,
          'type': Sequelize.STRING(255)
        },
        'description': {
          'type': Sequelize.STRING(255),
          'defaultValue': ''
        },
        'active': {
          'allowNull': false,
          'type': Sequelize.BOOLEAN
        },
        'createdAt': {
          'type': Sequelize.DATE,
          'defaultValue': Sequelize.fn('now')
        },
        'updatedAt': {
          'type': Sequelize.DATE,
          'defaultValue': Sequelize.fn('now')
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * ROLE PRIVILEGE TABLE
   */
  {
    fn: 'createTable',
    params: [
      'rolePrivilege',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'idRole': {
          'onDelete': 'CASCADE',
          'onUpdate': 'CASCADE',
          'references': {
              'model': 'role',
              'key': 'id'
          },
          'allowNull': false,
          'type': Sequelize.INTEGER
        },
        'idPermission': {
          'onDelete': 'CASCADE',
          'onUpdate': 'CASCADE',
          'references': {
              'model': 'permission',
              'key': 'id'
          },
          'allowNull': false,
          'type': Sequelize.INTEGER
        },
        'idGrant': {
          'onDelete': 'CASCADE',
          'onUpdate': 'CASCADE',
          'references': {
              'model': 'grant',
              'key': 'id'
          },
          'allowNull': false,
          'type': Sequelize.INTEGER
        },
        'idGrantType': {
          'onDelete': 'CASCADE',
          'onUpdate': 'CASCADE',
          'references': {
              'model': 'grantType',
              'key': 'id'
          },
          'allowNull': false,
          'type': Sequelize.INTEGER
        },
        'createdAt': {
          'type': Sequelize.DATE,
          'defaultValue': Sequelize.fn('now')
        },
        'updatedAt': {
          'type': Sequelize.DATE,
          'defaultValue': Sequelize.fn('now')
        }
      },
      {}
    ]
  }
];

const rollbackCommands = [
  {
    fn: 'dropTable',
    params: ['rolePrivilege']
  },
  {
    fn: 'dropTable',
    params: ['grant']
  },
  {
    fn: 'dropTable',
    params: ['grantType']
  },
  {
    fn: 'dropTable',
    params: ['permission']
  },
  {
    fn: 'dropTable',
    params: ['role']
  }
];

module.exports = {
  pos: 0,
  info: info,

  /**
   * INITIAL BULK CREATE
   * MIGRATION UP
   */
  up: function(queryInterface, Sequelize)
  {
    let index = this.pos;
    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length)
        {
          const command = migrationCommands[index];
          console.log('[#' + index + '] execute: ' + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        }
        else
          resolve();
      }
      next();
    });
  },

  /**
   * INITIAL BULK DELETE
   * MIGRATION DOWN
   */
  down: function(queryInterface, Sequelize)
  {
    let index = this.pos;
    return new Promise(function(resolve, reject) {
      function next() {
        if (index < rollbackCommands.length)
        {
          const command = rollbackCommands[index];
          console.log('[#' + index + '] execute: ' + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        }
        else
          resolve();
      }
      next();
    });
  },
};
