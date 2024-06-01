import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { product, productId } from './product';

export interface categoriesAttributes {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type categoriesPk = 'id';
export type categoriesId = categories[categoriesPk];
export type categoriesOptionalAttributes = 'id' | 'createdAt' | 'updatedAt';
export type categoriesCreationAttributes = Optional<categoriesAttributes, categoriesOptionalAttributes>;

export class categories extends Model<categoriesAttributes, categoriesCreationAttributes> implements categoriesAttributes {
    id!: number;

    name!: string;

    createdAt?: Date;

    updatedAt?: Date;

    // categories hasMany product via category
    products!: product[];

    getProducts!: Sequelize.HasManyGetAssociationsMixin<product>;

    setProducts!: Sequelize.HasManySetAssociationsMixin<product, productId>;

    addProduct!: Sequelize.HasManyAddAssociationMixin<product, productId>;

    addProducts!: Sequelize.HasManyAddAssociationsMixin<product, productId>;

    createProduct!: Sequelize.HasManyCreateAssociationMixin<product>;

    removeProduct!: Sequelize.HasManyRemoveAssociationMixin<product, productId>;

    removeProducts!: Sequelize.HasManyRemoveAssociationsMixin<product, productId>;

    hasProduct!: Sequelize.HasManyHasAssociationMixin<product, productId>;

    hasProducts!: Sequelize.HasManyHasAssociationsMixin<product, productId>;

    countProducts!: Sequelize.HasManyCountAssociationsMixin;

    // categories hasMany product via categoryId
    category_products!: product[];

    getCategory_products!: Sequelize.HasManyGetAssociationsMixin<product>;

    setCategory_products!: Sequelize.HasManySetAssociationsMixin<product, productId>;

    addCategory_product!: Sequelize.HasManyAddAssociationMixin<product, productId>;

    addCategory_products!: Sequelize.HasManyAddAssociationsMixin<product, productId>;

    createCategory_product!: Sequelize.HasManyCreateAssociationMixin<product>;

    removeCategory_product!: Sequelize.HasManyRemoveAssociationMixin<product, productId>;

    removeCategory_products!: Sequelize.HasManyRemoveAssociationsMixin<product, productId>;

    hasCategory_product!: Sequelize.HasManyHasAssociationMixin<product, productId>;

    hasCategory_products!: Sequelize.HasManyHasAssociationsMixin<product, productId>;

    countCategory_products!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof categories {
        return categories.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'categories',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                ],
            }
        );
    }
}
