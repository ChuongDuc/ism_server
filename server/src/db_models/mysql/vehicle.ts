import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface vehicleAttributes {
    id: number;
    driverId: number;
    typeVehicle: string;
    weight: number;
    licensePlates: string;
    note?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type vehiclePk = 'id';
export type vehicleId = vehicle[vehiclePk];
export type vehicleOptionalAttributes = 'id' | 'note' | 'createdAt' | 'updatedAt';
export type vehicleCreationAttributes = Optional<vehicleAttributes, vehicleOptionalAttributes>;

export type VehicleEdge = TRDBEdge<vehicle>;
export type VehicleConnection = TRDBConnection<vehicle>;

export class vehicle extends Model<vehicleAttributes, vehicleCreationAttributes> implements vehicleAttributes {
    id!: number;

    driverId!: number;

    typeVehicle!: string;

    weight!: number;

    licensePlates!: string;

    note?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // vehicle belongsTo user via driverId
    driver!: user;

    getDriver!: Sequelize.BelongsToGetAssociationMixin<user>;

    setDriver!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createDriver!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static initModel(sequelize: Sequelize.Sequelize): typeof vehicle {
        return vehicle.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                driverId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                    unique: 'fk_vehicle_1',
                },
                typeVehicle: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                weight: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                licensePlates: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    unique: 'licensePlates_UNIQUE',
                },
                note: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'vehicle',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'licensePlates_UNIQUE',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'licensePlates' }],
                    },
                    {
                        name: 'driverId_UNIQUE',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'driverId' }],
                    },
                ],
            }
        );
    }
}
