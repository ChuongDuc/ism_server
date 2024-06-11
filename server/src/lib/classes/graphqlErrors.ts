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
    InValidValueError = 'InValidValueError',
    /**
     * Customer.
     */
    CustomerNotFound = 'CustomerNotFound',
    CustomerAlreadyExist = 'CustomerAlreadyExist',
    /**
     * Order.
     */
    OrderNotFound = 'OrderNotFound',
    /**
     * Category.
     */
    CategoryNotFound = 'CategoryNotFound',
    CategoryAlreadyExistError = 'CategoryAlreadyExistError',
    /**
     * Product.
     */
    ProductNotFound = 'ProductNotFound',
    /**
     * Error query in mysql.
     */
    MySQL = 'MySQL',
    /**
     * pagination Error
     */
    InvalidPaginationArgument = 'InvalidPaginationArgument',
    UserNotificationNotFound = 'UserNotificationNotFound',
    DeliverOrderNotFound = 'DeliverOrderNotFound',
    DuplicateCategoryProduct = 'DuplicateCategoryProduct',
    EmptyValue = 'EmptyValue',
    PaymentInfoNotFound = 'PaymentInfoNotFound Error',
    DriverAlreadyExist = 'DriverAlreadyExistError',
    LicensePlatesAlreadyExist = 'LicensePlatesAlreadyExistError',
    VehicleNotExist = 'VehicleNotExist',
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

export class CategoryAlreadyExistError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'khách hàng không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.CategoryAlreadyExistError,
            },
        });
    }
}

export class InValidValueError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Không xác định được giá trị truyền vào', {
            extensions: {
                code: ISM_ERROR_CODE.InValidValueError,
            },
        });
    }
}

export class CategoryNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Không tìm thấy danh mục', {
            extensions: {
                code: ISM_ERROR_CODE.CategoryNotFound,
            },
        });
    }
}

export class ProductNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Sản phẩm không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.ProductNotFound,
            },
        });
    }
}

export class CustomerNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Khách hàng không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.CustomerNotFound,
            },
        });
    }
}

export class OrderNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Hoá đơn không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.OrderNotFound,
            },
        });
    }
}

export class UserNotificationNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Thông báo không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.UserNotificationNotFound,
            },
        });
    }
}

export class DeliverOrderNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Lệnh xuất hàng không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.DeliverOrderNotFound,
            },
        });
    }
}

export class DuplicateCategoryProductError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Tên hạng mục trong đơn hàng bị trùng', {
            extensions: {
                code: ISM_ERROR_CODE.DuplicateCategoryProduct,
            },
        });
    }
}

export class EmptyValueError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Giá trị không được để trống!', {
            extensions: {
                code: ISM_ERROR_CODE.EmptyValue,
            },
        });
    }
}

export class PaymentInfoNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Thông tin thanh toán không tồn tại', {
            extensions: {
                code: ISM_ERROR_CODE.PaymentInfoNotFound,
            },
        });
    }
}

export class DriverAlreadyExistError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Phương tiện của lái xe đã tồn tại. Hãy chọn lái xe khác', {
            extensions: {
                code: ISM_ERROR_CODE.DriverAlreadyExist,
            },
        });
    }
}

export class LicensePlatesAlreadyExistError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Biển số xe của lái xe đã tồn tại. Hãy chọn biển số xe khác', {
            extensions: {
                code: ISM_ERROR_CODE.LicensePlatesAlreadyExist,
            },
        });
    }
}

export class VehicleNotExistError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Xe - Phương tiện không tồn tại.', {
            extensions: {
                code: ISM_ERROR_CODE.VehicleNotExist,
            },
        });
    }
}
