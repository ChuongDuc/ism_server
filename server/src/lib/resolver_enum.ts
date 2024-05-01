import { IRole, IUnit } from '../__generated__/graphql';
import { RoleList, Unit } from './enum';
import { InValidRoleError, InValidValueError } from './classes/graphqlErrors';

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
