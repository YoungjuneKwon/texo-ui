export enum StorageErrorCode {
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  NOT_FOUND = 'NOT_FOUND',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RATE_LIMITED = 'RATE_LIMITED',
  INVALID_DATA = 'INVALID_DATA',
}

export class StorageError extends Error {
  readonly code: StorageErrorCode;
  readonly driver: string;
  readonly cause?: Error;

  constructor(message: string, code: StorageErrorCode, driver: string, cause?: Error) {
    super(message);
    this.name = 'StorageError';
    this.code = code;
    this.driver = driver;
    this.cause = cause;
  }
}
