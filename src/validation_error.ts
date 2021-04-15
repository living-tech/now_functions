type Location = {
  line: number;
  column: number;
};

type ValidationMessage = {
  targetKey: string; // "email",
  messages: string; // "メールアドレスが不正です"
};

type Response = {
  statusCode: number; // 400,
  error: string; // "errorUpdateMeForApplication",
  message: string; // "ユーザー情報を更新できませんでした。時間を置いて今一度お試しください。",
  messages: ValidationMessage[];
};

type Extensions = {
  code: string; // "INTERNAL_SERVER_ERROR",
  exception: {
    response: Response;
    status: number; // 400,
    message: Response;
    stacktrace: string[]; // ↓↓
    // [
    //   "Error: [object Object]",
    //   "    at UsersService.execUpdateForApplication (/node/src/users/users.service.ts:333:15)",
    //   "    at processTicksAndRejections (internal/process/task_queues.js:97:5)",
    //   "    at UsersService.updateForApplication (/node/src/users/users.service.ts:273:16)",
    //   "    at UserResolver.updateForApplication (/node/src/users/user.resolver.ts:104:12)"
    // ]
  };
  validationMessages: ValidationMessage[];
};

type ValidationError = {
  message: string; // "ユーザー情報を更新できませんでした。時間を置いて今一度お試しください。",
  locations: Location[];
  path: string[]; // ["updateForApplication"]
  extensions: Extensions;
};

export type ValidationErrorResponse = {
  errors: ValidationError[];
  data: null;
};

export const getErrorMessage = (
  response: ValidationErrorResponse
): string | null => {
  if (response.errors.length === 0) {
    return null;
  }
  return response.errors[0].message;
};

export const getValidationMessages = (
  response: ValidationErrorResponse
): ValidationMessage[] => {
  if (response.errors.length === 0) {
    return [];
  }
  return response.errors[0].extensions.validationMessages;
};
