import Database from '../../../modules/database';

class DbMigrationService {
  public async createNewMigration (name: string): Promise<{ msg: string }> {
    try {
      return await Database.makeMigration(name);
    } catch (err) {
      throw err;
    }
  }
}

const dbMigrationService = new DbMigrationService();
export default dbMigrationService;