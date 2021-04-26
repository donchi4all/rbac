import * as Models from '../../models';
import Database from '../../../modules/database';

// TEMPORARY class realisation
export default class Test {
  public async addValuesToGrantTable (): Promise<void> {
    try {
      const gCreate = new Models.Grant({ title: 'create', active: true });
      const gRead = new Models.Grant({ title: 'read', active: true });
      const gUpdate = new Models.Grant({ title: 'update', active: true });
      const gDelete = new Models.Grant({ title: 'delete', active: true });
      
      await gCreate.save();
      await gRead.save();
      await gUpdate.save();
      await gDelete.save();
    } catch (err) {
      throw err;
    }
  }

  public async addValuesToRoleTable (): Promise<void> {
    try {
      const rAdmin = new Models.Role({ title: 'admin', active: true });
      const rInitiator = new Models.Role({ title: 'initiator', active: true });
      const rApprover = new Models.Role({ title: 'approver', active: true });
      const rExecutioner = new Models.Role({ title: 'executioner', active: true });
      const rViewer = new Models.Role({ title: 'viewer', active: true });
      const rItAdmin = new Models.Role({ title: 'it_admin', active: true });
      
      await rAdmin.save();
      await rInitiator.save();
      await rApprover.save();
      await rExecutioner.save();
      await rViewer.save();
      await rItAdmin.save();
    } catch (err) {
      throw err;
    }
  }

  public async addValuesToPermissionTable (): Promise<void> {
    try {
      const pUser = new Models.Permission({ title: 'user', active: true });
      const pTransaction = new Models.Permission({ title: 'transaction', active: true });
      const pTransactionPin = new Models.Permission({ title: 'transaction_pin', active: true });
      const pTransactionHistory = new Models.Permission({ title: 'transaction_history', active: true });
      const pLoan = new Models.Permission({ title: 'loan', active: true });
      const pPayment = new Models.Permission({ title: 'payment', active: true });
      const pBeneficiary = new Models.Permission({ title: 'beneficiary', active: true });
      const pGroup = new Models.Permission({ title: 'group', active: true });
      const pReport = new Models.Permission({ title: 'report', active: true });
      const pAnalytic = new Models.Permission({ title: 'analytic', active: true });
      const pRequest = new Models.Permission({ title: 'request', active: true });
      const pNotification = new Models.Permission({ title: 'notification', active: true });
      const pLog = new Models.Permission({ title: 'log', active: true });
      
      await pUser.save();
      await pTransaction.save();
      await pTransactionPin.save();
      await pTransactionHistory.save();
      await pLoan.save();
      await pPayment.save();
      await pBeneficiary.save();
      await pGroup.save();
      await pReport.save();
      await pAnalytic.save();
      await pRequest.save();
      await pNotification.save();
      await pLog.save();
    } catch (err) {
      throw err;
    }
  }

  public async addValuesToGrantTypeTable (): Promise<void> {
    try {
      const gtOwn = new Models.GrantType({ name: 'own' });
      const gtAny = new Models.GrantType({ name: 'any' });
      
      await gtOwn.save();
      await gtAny.save();
    } catch (err) {
      throw err;
    }
  }

  public async addValuesToRolePrivilegeTable (): Promise<void> {
    try {
      const aRole = await Models.Role.findOne({ where: { title: 'admin' } });
      const aGrantType = await Models.GrantType.findOne({ where: { name: 'any' } });
      const aPermission = await Models.Permission.findOne({ where: { title: 'user' } });

      const aGrantCreate = await Models.Grant.findOne({ where: { title: 'create' } });
      const aGrantRead = await Models.Grant.findOne({ where: { title: 'read' } });
      const aGrantUpdate = await Models.Grant.findOne({ where: { title: 'update' } });
      const aGrantDelete = await Models.Grant.findOne({ where: { title: 'delete' } });
      const aGrantApprove = await Models.Grant.findOne({ where: { title: 'approve' } });

      const rpUserCreate = new Models.RolePrivilege({
        idRole: aRole.id,
        idGrant: aGrantCreate.id,
        idGrantType: aGrantType.id,
        idPermission: aPermission.id,
      });

      const rpUserRead = new Models.RolePrivilege({
        idRole: aRole.id,
        idGrant: aGrantRead.id,
        idGrantType: aGrantType.id,
        idPermission: aPermission.id,
      });

      const rpUserUpdate = new Models.RolePrivilege({
        idRole: aRole.id,
        idGrant: aGrantUpdate.id,
        idGrantType: aGrantType.id,
        idPermission: aPermission.id,
      });

      const rpUserDelete = new Models.RolePrivilege({
        idRole: aRole.id,
        idGrant: aGrantDelete.id,
        idGrantType: aGrantType.id,
        idPermission: aPermission.id,
      });

      const rpUserApprove = new Models.RolePrivilege({
        idRole: aRole.id,
        idGrant: aGrantApprove.id,
        idGrantType: aGrantType.id,
        idPermission: aPermission.id,
      });
      
      await rpUserCreate.save();
      await rpUserRead.save();
      await rpUserUpdate.save();
      await rpUserDelete.save();
      await rpUserApprove.save();
    } catch (err) {
      throw err;
    }
  }

  public createNewMigration (name: string): Promise<{ msg: string }> {
    try {
      return Database.makeMigration(name);
    } catch (err) {
      throw err;
    }
  }
}