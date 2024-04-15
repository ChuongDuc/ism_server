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
};
