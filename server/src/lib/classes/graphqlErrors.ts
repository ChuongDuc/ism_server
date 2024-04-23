import { GraphQLError } from 'graphql';

// eslint-disable-next-line no-shadow
export enum ISM_ERROR_CODE {
    /**
     * Invalid access token passed
     */
    Unauthenticated = 'Unauthenticated',
    /**
     * User not found.
     */
    UserNotFound = 'UserNotFound',
    InValidRole = 'InValidRole',
    Permission = 'Permission',
    UserAlreadyExist = 'UserAlreadyExist',
    /**
     * Customer not found.
     */
    CustomerNotFound = 'CustomerNotFound',
    CustomerAlreadyExist = 'CustomerAlreadyExist',
    /**
     * Error query in mysql.
     */
    MySQL = 'MySQL',
    /**
     * pagination Error
     */
    InvalidPaginationArgument = 'InvalidPaginationArgument',
}

export class AuthenticationError extends GraphQLError {
    constructor(message: string | null) {
        super(message || 'Lỗi xác thực quyền truy cập của người dùng', {
            extensions: {
                code: ISM_ERROR_CODE.Unauthenticated,
            },
        });
    }
}

export class UserNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Người dùng không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.UserNotFound,
            },
        });
    }
}

export class InValidRoleError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Không xác định được quyền truy cập của người dùng', {
            extensions: {
                code: ISM_ERROR_CODE.InValidRole,
            },
        });
    }
}

export class PermissionError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Không có quyền truy cập và thực hiện chức năng này', {
            extensions: {
                code: ISM_ERROR_CODE.Permission,
            },
        });
    }
}

export class UserAlreadyExistError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Người dùng có email, tài khoản đã tồn tại. Hãy đăng nhập hoặc chọn email, tài khoản khác', {
            extensions: {
                code: ISM_ERROR_CODE.UserAlreadyExist,
            },
        });
    }
}

export class MySQLError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Lỗi bất thường khi thao tác trong cơ sở dữ liệu', {
            extensions: {
                code: ISM_ERROR_CODE.MySQL,
            },
        });
    }
}

export class InvalidPaginationArgumentError extends GraphQLError {
    constructor(message: string) {
        super(message, {
            extensions: {
                code: ISM_ERROR_CODE.InvalidPaginationArgument,
            },
        });
    }
}

export class CustomerAlreadyExistError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'khách hàng không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.CustomerAlreadyExist,
            },
        });
    }
}
