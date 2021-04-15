"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidationMessages = exports.getErrorMessage = void 0;
exports.getErrorMessage = (response) => {
    if (response.errors.length === 0) {
        return null;
    }
    return response.errors[0].message;
};
exports.getValidationMessages = (response) => {
    if (response.errors.length === 0) {
        return [];
    }
    return response.errors[0].extensions.validationMessages;
};
//# sourceMappingURL=validation_error.js.map