export enum DefaultHashValue {
    saltRounds = 10,
}

export const defaultPwReset = 'demo1234';

export enum RoleList {
    director = 999,
    admin = 99,
    manager = 9,
    accountant = 5,
    sales = 1,
    transporterManager = 2,
    driver = 3,
    assistantDriver = 4,
}

export enum BucketValue {
    DEVTEAM = 'dev-team',
}

export enum Unit {
    pipe = 'Cây',
    plate = 'Tấm',
    cai = 'Cái',
    chiec = 'Chiếc',
    m = 'Mét',
    kg = 'kg',
}

export enum StatusOrder {
    creatNew = 'Tạo mới',
    priceQuotation = 'Báo giá - Chăm sóc KH',
    createExportOrder = 'Chốt đơn - Tạo lệnh xuất hàng',
    delivery = 'Đang giao hàng',
    successDelivery = 'Giao hàng thành công',
    paymentConfirmation = 'Xác nhận thanh toán và hồ sơ',
    paid = 'Đã thanh toán',
    done = 'Đơn hàng hoàn thành',
}

export enum TypeProduct {
    shape = 'Thép hình',
    plate = 'Thép tấm',
}

export enum formType {
    VAT = 'Thuế VAT',
    tonnage = 'Đơn trọng',
}

export enum TypeVehicle {
    container = 'Container',
    truck = 'Xe tải',
}
