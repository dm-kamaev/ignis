import { AxiosError } from "axios";

export default class HttpError extends Error {

  constructor(private readonly err: AxiosError) {
    super(err.message);
    this.name = 'HttpError';
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  getError() {
    return this.err;
  }

  getResponse() {
    return this.err.response;
  }

  getData() {
    return this.getResponse()?.data;
  }
}
