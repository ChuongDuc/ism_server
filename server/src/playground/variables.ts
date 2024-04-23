const adminAccount = 'admin';
const password = 'demo1234';

export const variables = {
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
};
