import { ErrorInterface } from './IError';

export class BaseError extends Error {
  public status: number;

  /**
   * Constructor
   * @param args - Object of Error Interface: { code, message }
   */
  constructor (args: ErrorInterface) {
    super(args.message);
    this.name = this.constructor.name;
    this.status = args.status;
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}

export class HttpRequestError extends BaseError {
  /**
   * Constructor
   * @param message - Error message
   * @param code - Error code
   */
  constructor (public message: string, public status: number = 400) {
    super({ message, status });
  }
}