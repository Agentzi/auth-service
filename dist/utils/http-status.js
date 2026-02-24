class HttpStatus {
    constructor() {
        this.CONTINUE = 100;
        this.SWITCHING_PROTOCOLS = 101;
        // 2xx Success
        this.OK = 200;
        this.CREATED = 201;
        this.ACCEPTED = 202;
        this.NO_CONTENT = 204;
        this.RESET_CONTENT = 205;
        this.PARTIAL_CONTENT = 206;
        // 3xx Redirection
        this.MULTIPLE_CHOICES = 300;
        this.MOVED_PERMANENTLY = 301;
        this.FOUND = 302;
        this.SEE_OTHER = 303;
        this.NOT_MODIFIED = 304;
        this.TEMPORARY_REDIRECT = 307;
        this.PERMANENT_REDIRECT = 308;
        // 4xx Client Error
        this.BAD_REQUEST = 400;
        this.UNAUTHORIZED = 401;
        this.FORBIDDEN = 403;
        this.NOT_FOUND = 404;
        this.METHOD_NOT_ALLOWED = 405;
        this.CONFLICT = 409;
        this.GONE = 410;
        this.UNPROCESSABLE_ENTITY = 422;
        this.TOO_MANY_REQUESTS = 429;
        // 5xx Server Error
        this.INTERNAL_SERVER_ERROR = 500;
        this.NOT_IMPLEMENTED = 501;
        this.BAD_GATEWAY = 502;
        this.SERVICE_UNAVAILABLE = 503;
        this.GATEWAY_TIMEOUT = 504;
    }
}
export default new HttpStatus();
