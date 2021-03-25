export interface DbEnvInterface {
  driver: string,
  host: string,
  port: number,
  database: string,
  user: string,
  password: string,
  multipleStatements?: boolean,
  dateStrings?: boolean,
}