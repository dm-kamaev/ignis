import { AxiosError } from "axios";
export default class HttpError extends Error {
    private readonly err;
    constructor(err: AxiosError);
    getError(): AxiosError<unknown, any>;
    getResponse(): import("axios").AxiosResponse<unknown, any> | undefined;
    getData(): unknown;
}
