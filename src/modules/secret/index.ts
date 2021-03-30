import dotenv from 'dotenv';
import fs from 'fs';
import { join } from 'path';

import { AppEnvInterface } from './IAppEnv';
import { DbEnvInterface } from './IDbEnv';
import { LoggerDecorator, LoggerInterface } from '../logger';

class Secret {
  @LoggerDecorator('Env')
  private log: LoggerInterface;

  public init (): void {
    if (fs.existsSync('.env')) {
      dotenv.config({ path: '.env' });
      this.log.info('Environment variables have been loaded successfully.');
    } else {
      const err = new Error('Could not find .env file to supply config environment variables.');
      this.log.error(err.message);
      throw err;
    }
  }

  private getOsEnv (key: string): string {
    if (typeof process.env[key] === 'undefined') {
      throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key] as string;
  }

  private toNumber (value: string): number {
    return parseInt(value, 10);
  }

  private toBool (value: string): boolean {
    return value === 'true';
  }

  /**
   * Get full an element path from the project root folder
   * @param path - Path to a file or directory
   */
  public getPath (path: string): string {
    return (['production', 'prod'].some((env) => env === this.getOsEnv('APP_ENVIRONMENT')))
      ? join(process.cwd(), path.replace('src/', 'dist/').slice(0, -3) + '.js')
      : join(process.cwd(), path);
  }

  /**
   * App environment
   */
  public get App (): AppEnvInterface {
    try {
      return {
        env: this.getOsEnv('APP_ENVIRONMENT'),
        host: this.getOsEnv('APP_HOST'),
        port: this.toNumber(this.getOsEnv('APP_PORT')),
      };
    } catch (err) {
      this.log.error(`App env error: ${err.message}`);
      throw err;
    }
  }

  /**
   * DB environment
   */
  public get Db (): DbEnvInterface {
    try {
      return {
        driver: this.getOsEnv('DB_CONNECTION'),
        host: this.getOsEnv('DB_HOST'),
        port: this.toNumber(this.getOsEnv('DB_PORT')),
        database: this.getOsEnv('DB_DATABASE'),
        user: this.getOsEnv('DB_USERNAME'),
        password: this.getOsEnv('DB_PASSWORD'),
        multipleStatements: this.toBool(this.getOsEnv('DB_MULTI_STATEMENT')),
        dateStrings: this.toBool(this.getOsEnv('DB_DATE_STRINGS')),
      };
    } catch (err) {
      this.log.error(`Database env error: ${err.message}`);
      throw err;
    }
  }
}

export default new Secret;
