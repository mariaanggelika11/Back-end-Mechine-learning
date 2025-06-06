const ClientError = require("./ClientError");

class InputError extends ClientError {
  constructor(message) {
    super(message, 413); // Payload too large
    this.name = "InputError";
  }
}

module.exports = InputError;
