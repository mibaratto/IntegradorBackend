import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(
        message: string = "No permissions"
    ) {
        super(403, message)
    }
}