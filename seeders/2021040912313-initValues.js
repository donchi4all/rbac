/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

module.exports = {
  /**
   * INITIAL BULK INSERT:
   * MIGRATION UP
   */
  up: (queryInterface, Sequelize) => {
    const insertGrants = queryInterface.bulkInsert('grant', [
      {
        title: 'create',
        active: true,
      },
      {
        title: 'read',
        active: true,
      },
      {
        title: 'update',
        active: true,
      },
      {
        title: 'delete',
        active: true,
      },
    ]);

    const insertGrantTypes = queryInterface.bulkInsert('grantType', [
      {
        name: 'own',
      },
      {
        name: 'any',
      },
    ]);

    const insertRoles = queryInterface.bulkInsert('role', [
      {
        title: 'admin',
        active: true,
      },
      {
        title: 'initiator',
        active: true,
      },
      {
        title: 'approver',
        active: true,
      },
      {
        title: 'executioner',
        active: true,
      },
      {
        title: 'viewer',
        active: true,
      },
      {
        title: 'it_admin',
        active: true,
      },
    ]);

    const insertPermissions = queryInterface.bulkInsert('permission', [
      {
        title: 'user',
        active: true,
      },
      {
        title: 'transaction',
        active: true,
      },
      {
        title: 'transaction_pin',
        active: true,
      },

      {
        title: 'transaction_history',
        active: true,
      },
      {
        title: 'loan',
        active: true,
      },
      {
        title: 'payment',
        active: true,
      },
      {
        title: 'beneficiary',
        active: true,
      },
      {
        title: 'group',
        active: true,
      },
      {
        title: 'report',
        active: true,
      },
      {
        title: 'analytic',
        active: true,
      },
      {
        title: 'request',
        active: true,
      },
      {
        title: 'notification',
        active: true,
      },
      {
        title: 'log',
        active: true,
      },
    ]);

    const insertRolePrivileges = queryInterface.bulkInsert('rolePrivilege', [
      {
        idRole: 1,
        idPermission: 1,
        idGrant: 1,
        idGrantType: 2,
      },
      {
        idRole: 1,
        idPermission: 1,
        idGrant: 2,
        idGrantType: 2,
      },
      {
        idRole: 1,
        idPermission: 1,
        idGrant: 3,
        idGrantType: 2,
      },
      {
        idRole: 1,
        idPermission: 1,
        idGrant: 4,
        idGrantType: 2,
      },
    ]);

    const bulkInsert = Promise.all([
      insertGrants,
      insertGrantTypes,
      insertRoles,
      insertPermissions,
      insertRolePrivileges,
    ]);

    return bulkInsert;
  },

  /**
   * INITIAL BULK DELETE:
   * MIGRATION DOWN
   */
  down: (queryInterface, Sequelize) => {
    const deleteRolePrivileges = queryInterface.bulkDelete('rolePrivilege', null, {});
    
    const deletePermissions = queryInterface.bulkDelete('permission', null, {});
    
    const deleteRoles = queryInterface.bulkDelete('role', null, {});
    
    const deleteGrantTypes = queryInterface.bulkDelete('grantType', null, {});
    
    const deleteGrants = queryInterface.bulkDelete('grant', null, {});

    const bulkDelete = Promise.all([
      deleteRolePrivileges,
      deletePermissions,
      deleteRoles,
      deleteGrantTypes,
      deleteGrants,
    ]);

    return bulkDelete;
  }
};