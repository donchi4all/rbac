import { Sequelize } from 'sequelize-typescript';
import { SequelizeTypescriptMigration } from 'sequelize-typescript-migration';

import * as Models from '../../api/models';
import Secret from '../secret';
import { LoggerDecorator, LoggerInterface } from '../logger';


export class Database {
  @LoggerDecorator('Database')
  private log: LoggerInterface;
  private sequelize: Sequelize;

  public init (): void {
    this.sequelize = new Sequelize({
      ...Secret.Db,
      pool: { max: 1 },
      models: Object.values(Models),
    });
    this.log.info('Sequelize ORM with mariaDb has been created successfully.');
  }

  public async makeMigration(migrationName: string): Promise<{ msg: string }> {
    try {
      console.log('SEQUALIZE: ', this.sequelize.connectionManager);
      const test = await SequelizeTypescriptMigration.makeMigration(this.sequelize, {
        outDir: Secret.getPath('migrations'),
        migrationName,
      });
      console.log('TEST: ', test);
      return test;
    } catch (err) {
      console.log('TEST_ERROR: ', err);
      return Promise.reject(err);
    }
  }

  public async query (queryString: string, params: unknown[]): Promise<unknown> {
    try {
      // TEMPORARY
      // const res = await this.pool.query(queryString, params);
      // delete res.meta;
  
      // return res;
      return new Promise<unknown>((resolve) => { return resolve(null); });
    } catch (err) {
      this.log.error(`Query error: ${err.message}`);
      throw err;
    }
  }

  public async transaction (queryString: string, params: unknown[]): Promise<unknown> {
    // TEMPORARY
    // const connection = await this.pool.getConnection();

    try {
      // await connection.query('START TRANSACTION');
      // const result = await connection.query(queryString, params);
  
      // await connection.query('COMMIT');
      // connection.release();
  
      // return result;
      return new Promise<unknown>((resolve) => { return resolve(null); });
    } catch (err) {
      // await connection.query('ROLLBACK');
      // connection.release();

      this.log.error(`Transaction error: ${err.message}`);
      throw err;
    }
  }
}

export default new Database;