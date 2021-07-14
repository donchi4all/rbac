/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "entity", deps: []
 * createTable "platform", deps: []
 * createTable "userPlatform", deps: [platform]
 * createTable "userRole", deps: [role]
 *
 **/

const info = {
  'revision': 2,
  'name': 'addJoinTables',
  'created': '2021-07-13T14:01:34.070Z',
  'comment': ''
};

const migrationCommands = [
  /**
   * CREATE
   * entity TABLE
   */
  {
    fn: 'createTable',
    params: [
      'entity',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'entityId': {
          'allowNull': false,
          'type': Sequelize.INTEGER
        },
        'entityType': {
          'allowNull': false,
          'type': Sequelize.STRING(255)
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * platform TABLE
   */
  {
    fn: 'createTable',
    params: [
      'platform',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'name': {
          'type': Sequelize.STRING(255),
          'defaultValue': '',
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * userPlatform TABLE
   */
  {
    fn: 'createTable',
    params: [
      'userPlatform',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'userId': {
          'allowNull': false,
          'type': Sequelize.INTEGER
        },
        'platformId': {
          'onDelete': 'CASCADE',
          'onUpdate': 'CASCADE',
          'references': {
            'model': 'platform',
            'key': 'id'
          },
          'allowNull': false,
          'type': Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * userRole TABLE
   */
  {
    fn: 'createTable',
    params: [
      'userRole',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'userId': {
          'allowNull': false,
          'type': Sequelize.INTEGER
        },
        'roleId': {
          'onDelete': 'CASCADE',
          'onUpdate': 'CASCADE',
          'references': {
            'model': 'role',
            'key': 'id'
          },
          'allowNull': false,
          'type': Sequelize.INTEGER
        }
      },
      {}
    ]
  }
];

const rollbackCommands = [
  {
    fn: 'dropTable',
    params: ['userPlatform']
  },
  {
    fn: 'dropTable',
    params: ['userRole']
  },
  {
    fn: 'dropTable',
    params: ['entity']
  },
  {
    fn: 'dropTable',
    params: ['platform']
  },
];

module.exports = {
  pos: 0,
  info: info,

  /**
   * <comment>
   * MIGRATION UP
   */
  up: function (queryInterface, Sequelize) {
    let index = this.pos;
    return new Promise(function (resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
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
   * <comment>
   * MIGRATION DOWN
   */
  down: function (queryInterface, Sequelize) {
    let index = this.pos;
    return new Promise(function (resolve, reject) {
      function next() {
        if (index < rollbackCommands.length) {
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
