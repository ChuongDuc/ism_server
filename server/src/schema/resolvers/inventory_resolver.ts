import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';
import { isEmpty } from 'lodash';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { IResolvers } from '../../__generated__/graphql';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { checkAuthentication } from '../../lib/utils/permision';
import { ismDb } from '../../loader/mysql';
import { SmContext } from '../../server';
import { inventoryCreationAttributes } from '../../db_models/mysql/inventory';

const inventory_resolver: IResolvers = {
    InventoryEdge: rdbEdgeResolver,

    InventoryConnection: rdbConnectionResolver,

    Query: {
        listAllInventory: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { searchQuery, args } = input;
            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const getInventoryLastUpdated = await ismDb.inventory.findOne({
                order: [['updatedAt', 'DESC']],
                rejectOnEmpty: false,
            });

            const present = new Date();

            const option: FindAndCountOptions = {
                limit,
                offset,
            };

            const whereOpt: WhereOptions<ismDb.inventory> = {};
            const whereOptUpdateAt: WhereOptions<ismDb.inventory> = {};

            if (searchQuery) {
                whereOpt['$inventory.productName$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
                whereOpt['$inventory.code$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (getInventoryLastUpdated) {
                const date = new Date(String(getInventoryLastUpdated.updatedAt));
                whereOptUpdateAt['$inventory.updatedAt$'] = {
                    [Op.between]: [date, present],
                };
            }

            option.where = isEmpty(whereOpt)
                ? whereOptUpdateAt
                : {
                      [Op.and]: whereOptUpdateAt,
                      [Op.or]: whereOpt,
                  };

            const result = await ismDb.inventory.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },
    },

    Mutation: {
        importFileExcelInventory: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { fileExcelInventory, fileName } = input;

            const { createReadStream, filename } = await fileExcelInventory;

            const inventoryProcess: Promise<ismDb.inventory>[] = [];
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
            const xlData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { range: 1 });

            xlData.forEach((productData) => {
                const createInventoryAttribute: inventoryCreationAttributes = {
                    code: productData['Mã hàng'],
                    productName: productData['Tên Hàng'],
                    unit: productData['Đơn vị'] ?? undefined,
                    quantity: productData['Số lượng'],
                    weight: productData['Đơn trọng'] ?? undefined,
                    fileName: fileName ?? filename,
                };
                const newInventory = ismDb.inventory.create(createInventoryAttribute);
                inventoryProcess.push(newInventory);
            });

            unlinkSync(path.join(__dirname, pathFileExcel, filename));

            return await Promise.all(inventoryProcess);
        },
    },
};

export default inventory_resolver;
