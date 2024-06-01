import { IFormType, INotificationEvent, IRole, IStatusOrder, ITypeProduct, IUnit } from '../__generated__/graphql';
import { formType, RoleList, StatusOrder, TypeProduct, Unit } from './enum';
import { InValidRoleError, InValidValueError } from './classes/graphqlErrors';
import { NotificationEvent } from './classes/PubSubService';

export const iRoleToNumber = (role: IRole) => {
    switch (role) {
        case IRole.Director:
            return RoleList.director;
        case IRole.Admin:
            return RoleList.admin;
        case IRole.Manager:
            return RoleList.manager;
        case IRole.Accountant:
            return RoleList.accountant;
        case IRole.Sales:
            return RoleList.sales;
        case IRole.TransporterManager:
            return RoleList.transporterManager;
        case IRole.Driver:
            return RoleList.driver;
        case IRole.AssistantDriver:
            return RoleList.assistantDriver;
        default:
            throw new InValidRoleError();
    }
};

export const roleNumberToIRole = (roleNumber: RoleList) => {
    switch (roleNumber) {
        case RoleList.director:
            return IRole.Director;
        case RoleList.admin:
            return IRole.Admin;
        case RoleList.manager:
            return IRole.Manager;
        case RoleList.accountant:
            return IRole.Accountant;
        case RoleList.sales:
            return IRole.Sales;
        case RoleList.transporterManager:
            return IRole.TransporterManager;
        case RoleList.driver:
            return IRole.Driver;
        case RoleList.assistantDriver:
            return IRole.AssistantDriver;
        default:
            throw new InValidRoleError();
    }
};

export const UnitStringToIUnit = (unitString: string | undefined) => {
    switch (unitString) {
        case Unit.pipe:
            return IUnit.Pipe;
        case Unit.plate:
            return IUnit.Plate;
        case Unit.cai:
            return IUnit.Cai;
        case Unit.chiec:
            return IUnit.Chiec;
        case Unit.m:
            return IUnit.M;
        case Unit.kg:
            return IUnit.Kg;
        default:
            throw new InValidValueError();
    }
};

export const iUnitToUnit = (unitInput: IUnit) => {
    switch (unitInput) {
        case IUnit.Pipe:
            return Unit.pipe;
        case IUnit.Plate:
            return Unit.plate;
        case IUnit.Cai:
            return Unit.cai;
        case IUnit.Chiec:
            return Unit.chiec;
        case IUnit.M:
            return Unit.m;
        case IUnit.Kg:
            return Unit.kg;
        default:
            throw new InValidValueError();
    }
};

// eslint-disable-next-line consistent-return
export const iNotificationEventToValueResolve = (event: INotificationEvent) => {
    // eslint-disable-next-line default-case
    switch (event) {
        case INotificationEvent.Common:
            return NotificationEvent.Common;
        case INotificationEvent.NewMessage:
            return NotificationEvent.NewMessage;
        case INotificationEvent.NewCustomer:
            return NotificationEvent.NewCustomer;
        case INotificationEvent.NewOrder:
            return NotificationEvent.NewOrder;
        case INotificationEvent.OrderStatusChanged:
            return NotificationEvent.OrderStatusChanged;
        case INotificationEvent.NewProduct:
            return NotificationEvent.NewProduct;
        case INotificationEvent.ProductUpdated:
            return NotificationEvent.ProductUpdated;
        case INotificationEvent.Payment:
            return NotificationEvent.Payment;
        case INotificationEvent.PaymentChanged:
            return NotificationEvent.PaymentChanged;
        case INotificationEvent.NewDeliverResolver:
            return NotificationEvent.NewDeliverResolver;
        case INotificationEvent.DeliverResolverUpdated:
            return NotificationEvent.DeliverResolverUpdated;
        case INotificationEvent.DeliverResolverDelete:
            return NotificationEvent.DeliverResolverDelete;
        // case INotificationEvent.NewVehicle:
        //     return NotificationEvent.NewVehicle;
        // case INotificationEvent.VehicleUpdated:
        //     return NotificationEvent.VehicleUpdated;
        // case INotificationEvent.VehicleDeleted:
        //     return NotificationEvent.VehicleDeleted;
        // case INotificationEvent.NewRepairVehicle:
        //     return NotificationEvent.NewRepairVehicle;
        // case INotificationEvent.RepairVehicleUpdated:
        //     return NotificationEvent.RepairVehicleUpdated;
        // case INotificationEvent.RepairVehicleDeleted:
        //     return NotificationEvent.RepairVehicleDeleted;
        // case INotificationEvent.NewDeliverRoute:
        //     return NotificationEvent.NewDeliverRoute;
        // case INotificationEvent.DeliverRouteUpdate:
        //     return NotificationEvent.DeliverRouteUpdate;
        // case INotificationEvent.NewCollectionOrder:
        //     return NotificationEvent.NewCollectionOrder;
        // case INotificationEvent.CollectionOrderUpdate:
        //     return NotificationEvent.CollectionOrderUpdate;
        // case INotificationEvent.SalesWithoutQuotes:
        //     return NotificationEvent.SalesWithoutQuotes;
    }
};

export const IStatusOrderTypeResolve = (input: string | undefined) => {
    switch (input) {
        case StatusOrder.creatNew:
            return IStatusOrder.CreatNew;
        case StatusOrder.priceQuotation:
            return IStatusOrder.PriceQuotation;
        case StatusOrder.createExportOrder:
            return IStatusOrder.CreateExportOrder;
        case StatusOrder.delivery:
            return IStatusOrder.Delivery;
        case StatusOrder.successDelivery:
            return IStatusOrder.SuccessDelivery;
        case StatusOrder.paymentConfirmation:
            return IStatusOrder.PaymentConfirmation;
        case StatusOrder.paid:
            return IStatusOrder.Paid;
        case StatusOrder.done:
            return IStatusOrder.Done;
        default:
            throw new InValidValueError();
    }
};

export const iStatusOrderToStatusOrder = (iStatusOrderInput: IStatusOrder) => {
    switch (iStatusOrderInput) {
        case IStatusOrder.CreatNew:
            return StatusOrder.creatNew;
        case IStatusOrder.PriceQuotation:
            return StatusOrder.priceQuotation;
        case IStatusOrder.CreateExportOrder:
            return StatusOrder.createExportOrder;
        case IStatusOrder.Delivery:
            return StatusOrder.delivery;
        case IStatusOrder.SuccessDelivery:
            return StatusOrder.successDelivery;
        case IStatusOrder.PaymentConfirmation:
            return StatusOrder.paymentConfirmation;
        case IStatusOrder.Paid:
            return StatusOrder.paid;
        case IStatusOrder.Done:
            return StatusOrder.done;
        default:
            throw new InValidRoleError();
    }
};

export const iTypeProductToTypeProduct = (input: ITypeProduct) => {
    switch (input) {
        case ITypeProduct.Shape:
            return TypeProduct.shape;
        case ITypeProduct.Plate:
            return TypeProduct.plate;
        default:
            throw new InValidValueError();
    }
};

export const typeProductITypeResolve = (input: ITypeProduct) => {
    switch (input) {
        case ITypeProduct.Shape:
            return TypeProduct.shape;
        case ITypeProduct.Plate:
            return TypeProduct.plate;
        default:
            return TypeProduct.shape;
    }
};

export const ITypeProductTypeResolve = (input: string) => {
    switch (input) {
        case TypeProduct.shape:
            return ITypeProduct.Shape;
        case TypeProduct.plate:
            return ITypeProduct.Plate;
        default:
            throw new InValidValueError();
    }
};

export const formTypeToIFormType = (formTypeString: string | undefined) => {
    switch (formTypeString) {
        case formType.VAT:
            return IFormType.Vat;
        case formType.tonnage:
            return IFormType.Tonnage;
        default:
            throw new InValidValueError();
    }
};
