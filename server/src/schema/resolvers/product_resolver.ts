import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import path from 'path';
import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import XLSX from 'xlsx';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import {
    formTypeToIFormType,
    iTypeProductToTypeProduct,
    ITypeProductTypeResolve,
    iUnitToUnit,
    typeProductITypeResolve,
    UnitStringToIUnit,
} from '../../lib/resolver_enum';
import { checkAuthentication } from '../../lib/utils/permision';
import { SmContext } from '../../server';
import { ismDb, sequelize } from '../../loader/mysql';
import { productCreationAttributes } from '../../db_models/mysql/product';
import { CategoryNotFoundError, MySQLError, ProductNotFoundError } from '../../lib/classes/graphqlErrors';

const product_resolver: IResolvers = {
    ProductEdge: rdbEdgeResolver,

    ProductConnection: rdbConnectionResolver,

    Product: {
        formType: (parent) => (parent.formType ? formTypeToIFormType(parent.formType) : null),

        unit: (parent) => (parent.unit ? UnitStringToIUnit(parent.unit) : null),

        type: (parent) => ITypeProductTypeResolve(parent.type),

        category: async (parent) => parent.category_category ?? (await parent.getCategory_category()),
    },

    Query: {
        listAllProducts: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { name, unit, category, typeProduct, args } = input;
            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const option: FindAndCountOptions = {
                limit,
                offset,
                include: [
                    {
                        model: ismDb.categories,
                        as: 'category_category',
                        required: true,
                    },
                ],
                order: [['id', 'DESC']],
            };

            const whereOpt: WhereOptions<ismDb.product> = {};

            if (name) {
                whereOpt['$product.name$'] = {
                    [Op.like]: `%${name.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (unit) {
                whereOpt.$unit$ = {
                    [Op.eq]: iUnitToUnit(unit),
                };
            }

            if (category) {
                whereOpt.$category$ = {
                    [Op.eq]: category,
                };
            }

            if (typeProduct) {
                whereOpt.$type$ = {
                    [Op.eq]: iTypeProductToTypeProduct(typeProduct),
                };
            }

            option.where = whereOpt;
            const result = await ismDb.product.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },

        productDetail: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { id } = input;
            return await ismDb.product.findByPk(id, { rejectOnEmpty: new ProductNotFoundError() });
        },
    },
    Mutation: {
        importFileExcelProducts: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { fileExcelProducts } = input;

            const { createReadStream, filename } = await fileExcelProducts.file;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const productProcess: Promise<ismDb.product>[] = [];
                    const pathFileExcel = '../../files/upload_excel/';
                    const pathFolderUploadExcel = '/app/src/files/upload_excel';

                    if (!existsSync(pathFolderUploadExcel)) {
                        mkdirSync(pathFolderUploadExcel, { recursive: true });
                    }

                    await new Promise((res) =>
                        createReadStream()
                            .pipe(createWriteStream(path.join(__dirname, pathFileExcel, filename)))
                            .on('close', res)
                    );

                    const workbook = XLSX.readFile(path.join(__dirname, pathFileExcel, filename));
                    const sheet_name_list = workbook.SheetNames;
                    const xlData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

                    const getAllProduct = await ismDb.product.findAll();
                    for (let i = 0; i < xlData?.length; i += 1) {
                        let isDuplicate = false;
                        for (let j = 0; j < getAllProduct.length; j += 1) {
                            if (xlData) {
                                if (
                                    xlData[i]['Tên'] === getAllProduct[j].name &&
                                    xlData[i]['Độ dài'] === getAllProduct[j].height &&
                                    xlData[i]['Trọng lượng'] === getAllProduct[j].weight
                                ) {
                                    isDuplicate = true;
                                    break;
                                }
                            }
                        }
                        if (isDuplicate) {
                            xlData.splice(i, 1);
                            i -= 1; // move the index back one step after removing an item
                        }
                    }

                    const findCategory = await ismDb.categories.findOne({
                        where: {
                            name: xlData[0]['Danh mục'],
                        },
                        rejectOnEmpty: new CategoryNotFoundError(),
                    });

                    xlData.forEach((productData) => {
                        const createProductAttribute: productCreationAttributes = {
                            name: productData['Tên'],
                            weight: productData['Trọng lượng'],
                            price: productData['Giá chưa VAT'],
                            priceWithoutVAT: productData['Giá chưa VAT'],
                            priceWithVAT: productData['Giá có VAT'],
                            formType: productData['Loại hình'] ?? undefined,
                            width: productData['Chiều rộng'] ?? undefined,
                            height: productData['Độ dài'],
                            unit: productData['Đơn vị'] ?? undefined,
                            type: productData['Loại'],
                            category: Number(findCategory.id),
                            subCategory: productData['Danh mục phụ'] ?? undefined,
                            code: productData['Mã sản phẩm'] ?? undefined,
                            available: productData['Tồn kho'] ?? undefined,
                            description: productData['Mô tả'] ?? undefined,
                        };
                        const newProduct = ismDb.product.create(createProductAttribute, { transaction: t });
                        productProcess.push(newProduct);
                    });

                    unlinkSync(path.join(__dirname, pathFileExcel, filename));

                    return await Promise.all(productProcess);
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi tạo sản phẩm trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        updateProductPriceById: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { productId, priceWithVAT, priceWithoutVAT } = input;

            const productArray = await ismDb.product.findAll({
                where: {
                    id: productId,
                },
            });

            if (productArray.length !== productId.length && productArray.length < 1) {
                throw new ProductNotFoundError();
            }

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    if (priceWithoutVAT) {
                        const priceProductWithoutVAT: Promise<ismDb.product>[] = [];

                        productArray.forEach((e) => {
                            e.priceWithoutVAT = priceWithoutVAT;
                            e.price = priceWithoutVAT;
                            priceProductWithoutVAT.push(e.save({ transaction: t }));
                        });

                        if (priceProductWithoutVAT.length > 0) await Promise.all(priceProductWithoutVAT);
                    }

                    if (priceWithVAT) {
                        const priceProductWithVAT: Promise<ismDb.product>[] = [];

                        productArray.forEach((e) => {
                            e.priceWithVAT = priceWithVAT;
                            priceProductWithVAT.push(e.save({ transaction: t }));
                        });

                        if (priceProductWithVAT.length > 0) await Promise.all(priceProductWithVAT);
                    }

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        updateProductById: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { productId, productName, height, weight, priceWithVAT, priceWithoutVAT, categoryId, unit } = input;

            const productArray = await ismDb.product.findByPk(productId, { rejectOnEmpty: new ProductNotFoundError() });

            if (productName) {
                productArray.name = productName;
            }

            if (height) {
                productArray.height = height;
            }

            if (weight) {
                productArray.weight = weight;
            }

            if (priceWithVAT) {
                productArray.priceWithVAT = priceWithVAT;
            }

            if (priceWithoutVAT) {
                productArray.priceWithoutVAT = priceWithoutVAT;
                productArray.price = priceWithoutVAT;
            }

            if (categoryId) {
                productArray.category = categoryId;
            }

            if (unit) {
                productArray.unit = iUnitToUnit(unit);
            }

            await productArray.save();
            return ISuccessResponse.Success;
        },

        deleteProductById: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { productId } = input;

            const productArray = await ismDb.product.findAll({
                where: {
                    id: productId,
                },
            });

            if (productArray.length !== productId.length && productArray.length < 1) {
                throw new ProductNotFoundError();
            }

            const orderDetail = await ismDb.orderDetail.findAll({
                where: {
                    productId,
                },
            });

            if (orderDetail.length > 0) {
                throw new Error('Sản phẩm đang thuộc một đơn hàng');
            }

            await ismDb.product.destroy({ where: { id: productId } });

            return ISuccessResponse.Success;
        },

        createProduct: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);

            const { productName, height, productType, weight, priceWithVAT, priceWithoutVAT, categoryId, unit } = input;

            const productExist = await ismDb.product.findAll({
                where: {
                    name: productName,
                    height,
                    weight,
                },
            });

            if (productExist.length > 0) {
                throw new Error('Sản phẩm đã tồn tại');
            }

            const productAttribute: productCreationAttributes = {
                name: productName,
                weight,
                price: priceWithoutVAT,
                priceWithoutVAT,
                priceWithVAT,
                height,
                type: typeProductITypeResolve(productType),
                category: categoryId,
                unit: unit ? iUnitToUnit(unit) : undefined,
            };

            return await ismDb.product.create(productAttribute);
        },
    },
};

export default product_resolver;
