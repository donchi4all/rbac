/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "role", deps: []
 * createTable "platform", deps: []
 * createTable "business", deps: []
 * createTable "workflow", deps: []
 * createTable "permission", deps: []
 * createTable "rolePermission", deps: []
 * createTable "workflowRequest", deps: []
 * createTable "BusinessUserRole", deps: []
 * createTable "workflowablePermission", deps: []
 *
 **/

const info = {
  'revision': 1,
  'name': 'rbac-workflow',
  'created': '2021-08-23T13:40:09.427Z',
  'comment': ''
};

const migrationCommands = [
  /**
   * CREATE
   * <table_name> TABLE
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
        'businessId': {
          'type': Sequelize.STRING
        },
        'title': {
          'type': Sequelize.STRING
        },
        'slug': {
          'type': Sequelize.STRING
        },
        'description': {
          'allowNull': true,
          'type': Sequelize.STRING
        },
        'isActive': {
          'type': Sequelize.STRING
        },
        'createdAt': {
          'type': Sequelize.DATE
        },
        'updatedAt': {
          'type': Sequelize.DATE
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * <table_name> TABLE
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
          'type': Sequelize.STRING
        },
        'slug': {
          'type': Sequelize.STRING
        },
        'description': {
          'allowNull': true,
          'type': Sequelize.STRING
        },
        'isActive': {
          'type': Sequelize.BOOLEAN
        },
        'createdAt': {
          'type': Sequelize.DATE
        },
        'updatedAt': {
          'type': Sequelize.DATE
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * <table_name> TABLE
   */
  {
    fn: 'createTable',
    params: [
      'business',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'platformId': {
          'type': Sequelize.INTEGER
        },
        'name': {
          'type': Sequelize.STRING
        },
        'slug': {
          'type': Sequelize.STRING
        },
        'description': {
          'allowNull': true,
          'type': Sequelize.STRING
        },
        'isActive': {
          'type': Sequelize.BOOLEAN
        },
        'createdAt': {
          'type': Sequelize.DATE
        },
        'updatedAt': {
          'type': Sequelize.DATE
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * <table_name> TABLE
   */
  {
    fn: 'createTable',
    params: [
      'workflow',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'businessId': {
          'type': Sequelize.STRING
        },
        'title': {
          'type': Sequelize.STRING
        },
        'slug': {
          'type': Sequelize.STRING
        },
        'description': {
          'allowNull': true,
          'type': Sequelize.STRING
        },
        'process': {
          'type': Sequelize.STRING
        },
        'createdAt': {
          'type': Sequelize.DATE
        },
        'updatedAt': {
          'type': Sequelize.DATE
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * <table_name> TABLE
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
        'platformId': {
          'type': Sequelize.INTEGER
        },
        'title': {
          'type': Sequelize.STRING
        },
        'slug': {
          'type': Sequelize.STRING
        },
        'description': {
          'allowNull': true,
          'type': Sequelize.STRING
        },
        'isActive': {
          'type': Sequelize.BOOLEAN
        },
        'createdAt': {
          'type': Sequelize.DATE
        },
        'updatedAt': {
          'type': Sequelize.DATE
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * <table_name> TABLE
   */
  {
    fn: 'createTable',
    params: [
      'rolePermission',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'roleId': {
          'type': Sequelize.INTEGER
        },
        'permissionId': {
          'type': Sequelize.INTEGER
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * <table_name> TABLE
   */
  {
    fn: 'createTable',
    params: [
      'workflowRequest',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'userId': {
          'type': Sequelize.STRING
        },
        'businessId': {
          'type': Sequelize.STRING
        },
        'businessUserRoleId': {
          'type': Sequelize.STRING
        },
        'workflowId': {
          'type': Sequelize.STRING
        },
        'permissionId': {
          'type': Sequelize.STRING
        },
        'workflowableType': {
          'type': Sequelize.STRING
        },
        'workflowableId': {
          'type': Sequelize.STRING
        },
        'previousStep': {
          'type': Sequelize.STRING
        },
        'nextStep': {
          'type': Sequelize.STRING
        },
        'action': {
          'type': Sequelize.ENUM('approved', 'rejected', 'flagged', 'created', 'edited', 'deleted')
        },
        'createdAt': {
          'type': Sequelize.DATE
        },
        'updatedAt': {
          'type': Sequelize.DATE
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * <table_name> TABLE
   */
  {
    fn: 'createTable',
    params: [
      'BusinessUserRole',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'userId': {
          'type': Sequelize.STRING
        },
        'businessId': {
          'type': Sequelize.STRING
        },
        'roleId': {
          'type': Sequelize.INTEGER
        },
        'status': {
          'type': Sequelize.ENUM('pending', 'active')
        },
        'createdAt': {
          'type': Sequelize.DATE
        },
        'updatedAt': {
          'type': Sequelize.DATE
        }
      },
      {}
    ]
  },

  /**
   * CREATE
   * <table_name> TABLE
   */
  {
    fn: 'createTable',
    params: [
      'workflowablePermission',
      {
        'id': {
          'autoIncrement': true,
          'primaryKey': true,
          'type': Sequelize.INTEGER
        },
        'businessId': {
          'type': Sequelize.STRING
        },
        'permissionId': {
          'type': Sequelize.INTEGER
        },
        'workflowId': {
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
    params: ['role']
  },
  {
    fn: 'dropTable',
    params: ['platform']
  },
  {
    fn: 'dropTable',
    params: ['business']
  },
  {
    fn: 'dropTable',
    params: ['workflow']
  },
  {
    fn: 'dropTable',
    params: ['permission']
  },
  {
    fn: 'dropTable',
    params: ['rolePermission']
  },
  {
    fn: 'dropTable',
    params: ['workflowRequest']
  },
  {
    fn: 'dropTable',
    params: ['BusinessUserRole']
  },
  {
    fn: 'dropTable',
    params: ['workflowablePermission']
  }
];

module.exports = {
  pos: 0,
  info: info,

  /**
   * <comment>
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
   * <comment>
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
