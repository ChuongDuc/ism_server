const adminAccount = 'admin';
const password = 'demo1234';

export const variables = {
    // getMessage: {
    //     userId: 1,
    // },
    login: {
        input: {
            account: adminAccount,
            password,
        },
    },
    createUser: {
        input: {
            userName: 'testUser1',
            phoneNumber: '0944721996',
            password: '12345678a',
            firstName: 'Nguyễn ',
            lastName: 'Minh Trí',
            role: 'Director',
        },
    },
    updateUser: {
        input: {
            id: 1,
            userName: 'testUser1',
            phoneNumber: '0944721998',
            firstName: 'Nguyễn',
            lastName: 'Minh Trí',
            role: 'Director',
        },
    },
    deleteUser: {
        input: {
            ids: [],
        },
    },
    users: {
        input: {
            searchQuery: '',
        },
    },
    listAllCustomer: {
        input: {
            searchQuery: '0384686880',
        },
    },
    createCustomer: {
        input: {
            name: 'khach hang 1',
            phoneNumber: '0384686880',
            email: 'khachhang1@gmail.com',
            address: 'ha noi',
            company: 'cong ty 1',
        },
    },
    updateCustomer: {
        input: {
            id: 1,
            name: 'khach hang 1',
            phoneNumber: '0384686880',
            email: 'khachhang1@gmail.com',
            address: 'ha noi',
            company: 'cong ty 1',
        },
    },
    deleteCustomer: {
        input: {
            ids: [],
        },
    },
    listAllInventory: {
        input: {
            searchQuery: '',
        },
    },
    importFileExcelInventory: {
        input: {
            fileExcelInventory: '',
            fileName: 'Tonkho.xlsx',
        },
    },
    createCategory: {
        input: {
            name: 'category_1',
        },
    },
    updateCategory: {
        input: {
            id: 1,
            name: 'category_1',
        },
    },
    listAllProducts: {
        input: {
            name: '',
        },
    },
    importFileExcelProducts: {
        input: {
            fileExcelProducts: '',
        },
    },
    createProduct: {
        input: {
            categoryId: 1,
            productName: 'product1',
            code: 'prd1',
            price: 10000,
            unit: '',
            height: 10,
            weight: 12,
            description: 'abc',
        },
    },
    updateProductById: {
        input: {
            productId: 1,
            categoryId: 1,
            name: 'san pham 1',
            price: 100001,
            unit: '',
            height: 110,
            weight: 112,
        },
    },
    updateProductPriceById: {
        input: {
            productId: 1,
            price: 150000,
        },
    },
    deleteProduct: {
        input: {
            productId: [1],
        },
    },
    createOrder: {
        input: {
            customerId: 1,
            saleUserId: 5,
        },
    },
    updateOrder: {
        input: {
            orderId: 1,
            saleUserId: 5,
        },
    },
    filterAllOrder: {
        input: {
            queryString: '',
        },
    },
};
