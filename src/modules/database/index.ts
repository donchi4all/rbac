import mariadb from 'mariadb';

import Secret from '../secret';
import { LoggerDecorator, LoggerInterface } from '../logger';

class Database {
  @LoggerDecorator('Database')
  private log: LoggerInterface;
  private pool: mariadb.Pool;

  public init (): void {
    this.pool = mariadb.createPool(Secret.Db);
    this.log.info('MariaDB pool has been created successfully.');
  }

  public async query (queryString: string, params: unknown[]): Promise<unknown> {
    try {
      const res = await this.pool.query(queryString, params);
      delete res.meta;
  
      return res;
    } catch (err) {
      this.log.error(`Query error: ${err.message}`);
      throw err;
    }
  }

  public async transaction (queryString: string, params: unknown[]): Promise<unknown> {
    const connection = await this.pool.getConnection();

    try {
      await connection.query('START TRANSACTION');
      const result = await connection.query(queryString, params);
  
      await connection.query('COMMIT');
      connection.release();
  
      return result;
    } catch (err) {
      await connection.query('ROLLBACK');
      connection.release();

      this.log.error(`Transaction error: ${err.message}`);
      throw err;
    }
  }
}

export default new Database;