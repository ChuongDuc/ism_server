import { isEmpty } from 'lodash';

export const extractFirstName = (firstName: string): string => {
    const parts = firstName.split(' ').filter((name) => !isEmpty(name));
    if (parts.length > 1) {
        return parts[parts.length - 1];
    }
    return parts[0];
};
