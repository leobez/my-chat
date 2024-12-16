class CustomError extends Error {
    constructor(status, message, details=[]) {
        super(message)
        this.status = status
        this.details = details
        this.name = this.constructor.name
    }
}

module.exports = CustomError