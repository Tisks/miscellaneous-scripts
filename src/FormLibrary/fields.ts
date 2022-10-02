import { IFormInput, useFormInput } from './useFormInput';
/* eslint-disable @typescript-eslint/no-explicit-any */
export type TextFieldTypes =
  | 'date'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url'
  | 'time'
  | 'week'
  | 'month'
  | 'datetime-local';

export type TFieldTypes = keyof typeof FieldTypes;

export enum FieldTypes {
    INPUT = 'INPUT',
    TEXTAREA = 'TEXTAREA',
    SELECT = 'SELECT',
    SLIDER = 'SLIDER',
    CHECKBOX = 'CHECKBOX',
    DATETIME = 'DATETIME',
    RADIO = 'RADIO',
}
export interface IFieldInput {
    id: string;
    label: string;
    required: boolean;
    validators?: ((fieldValue: unknown, ...validatorsExtraArgs: any[]) => boolean | string)[];
    errorLabels?: string[];
    errorStyle?: Record<
        string,
        {
            label?: Record<string, any>;
            input?: Record<string, any>;
            text?: Record<string, any>;
        }
    >;
    isTextArea?: boolean;
    type?: TFieldTypes;
    validatorsExtraArgs?: number[][];
    interpolateExtraArgs?: Record<string, any>;
    input: TInput;
}

export type TInput = {
    props: TInputProps;
    state: IFormInput;
};

export type TInputProps = {
    type: TextFieldTypes;
    placeholder?: string;
};

export type IFieldInputTextArea = Omit<IFieldInput, 'input'> & {
    input: {
        props: TInputProps;
        state: Omit<IFormInput, 'value'> & { value: TFieldValueTextArea };
    };
};

export type TFieldValue = string | number | null | undefined;
export type TFieldValueTextArea = string | null | undefined;
export type TFieldError = Record<string, string>;

const isEmpty = (fieldValue: unknown) => {
    if (
        !fieldValue ||
        (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
        (typeof fieldValue === 'object' && Object.keys(fieldValue).length === 0)
    ) {
        return true;
    }
    return false;
};

const isEmail = (fieldValue: unknown) => {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!isEmpty(fieldValue) && typeof fieldValue === 'string' && !regex.test(fieldValue)) {
        return true;
    }
    return false;
};

const isString = (fieldValue: unknown) => {
    if (!isEmpty(fieldValue) && (typeof fieldValue !== 'string' || /[^a-zA-Z -]/.test(fieldValue))) {
        return true;
    }
    return false;
};

const isMinLength = (fieldValue: unknown, validLength?: number) => {
    if (!isEmpty(fieldValue) && validLength !== undefined && String(fieldValue).trim().length < validLength) {
        return true;
    }
    return false;
};

const isPasswordError = (fieldValue: unknown) => {
    switch (fieldValue) {
        case 'auth/wrong-password':
            return 'Incorrect password, try again';
        case 'auth/too-many-requests':
            return 'Too many login requests, try later';
        default:
            break;
    }
    return false;
};

/*
const isMaxLength = (fieldValue: unknown, validLength?: number) => {
    if (!isEmpty(fieldValue) && validLength !== undefined && String(fieldValue).trim().length > validLength) {
        return true;
    }
    return false;
};

const isNumber = (fieldValue: unknown) => {
    if (
        (!isEmpty(fieldValue) &&
            typeof fieldValue === 'string' &&
            !/^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/.test(fieldValue)) ||
        isNaN(fieldValue as number)
    ) {
        return true;
    }
    return false;
};
*/

/**
 * A function that allows to replace arguments directly to a string
 * @param str string to replace with properties surrounded by brackets
 * @param obj object that has the properties to replace in the string
 * @returns an string with the object properties replaced.
 * Eg:
 *
 * **input** -> str: `'Hello {name}, welcome to {place}'`, obj: `{ name: 'John', place: 'your home' }`
 *
 * **output** -> `'Hello John, welcome to your home'`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const interpolate = (str: string, obj: any): string => {
    return str.replace(/{([^{}]*)}/g, (a, b) => {
        const r: any = obj[b];
        return typeof r !== 'object' ? r : a;
    });
};

const getFieldsValues = (fields: IFieldInput[]) => {
    const values: Record<string, TFieldValue> = fields.reduce((prev, curr) => {
        return { ...prev, [curr.id]: curr.input.state.value };
    }, {});
    return values;
};

export const useSignupFields = (): {
    fields: IFieldInput[];
    values: Record<string, TFieldValue>;
} => {
    const fields = [
        {
            id: 'name',
            label: 'Name',
            required: true,
            validators: [isString, isEmpty],
            errorLabels: ['Names cannot contain numbers', 'Please enter a name'],
            input: {
                props: {
                    type: 'text' as TextFieldTypes,
                    placeholder: 'Joe Bloggs',
                },
                state: useFormInput(''),
            },
        },
        {
            id: 'email',
            label: 'Email',
            required: true,
            validators: [isEmail, isEmpty],
            errorLabels: ['Malformed email, please check it', 'Please enter an email'],
            input: {
                props: {
                    type: 'email' as TextFieldTypes,
                    placeholder: 'joe@bloggs.com',
                },
                state: useFormInput(''),
            },
        },
        {
            id: 'password',
            label: 'Password',
            required: true,
            interpolateExtraArgs: { nOfChar: '4' },
            validatorsExtraArgs: [[4]],
            validators: [isMinLength, isEmpty],
            errorLabels: ['Password has to be of at least {nOfChar} characters', 'This field is required'],
            input: {
                props: {
                    type: 'password' as TextFieldTypes,
                    placeholder: '*********',
                },
                state: useFormInput(''),
            },
        },
    ];

    const values = getFieldsValues(fields);

    return { fields, values };
};

export const useLoginFields = (): {
    fields: IFieldInput[];
    values: Record<string, TFieldValue>;
} => {
    const fields = [
        {
            id: 'email',
            label: 'Email',
            required: true,
            validators: [isEmail, isEmpty],
            errorLabels: ['Malformed email, please check it', 'Please enter an email'],
            input: {
                props: {
                    type: 'email' as TextFieldTypes,
                    placeholder: 'joe@bloggs.com',
                },
                state: useFormInput(''),
            },
        },
        {
            id: 'password',
            label: 'Password',
            required: true,
            validators: [isEmpty, isPasswordError],
            errorLabels: ['Please enter a password'],
            errorStyle: {
                isPasswordError: {
                    input: {
                        textAlign: 'start',
                        border: '1px solid red',
                        borderRadius: '5px',
                    },
                    label: {
                        color: 'red',
                    },
                },
            },
            input: {
                props: {
                    type: 'password' as TextFieldTypes,
                    placeholder: '*******',
                },
                state: useFormInput(''),
            },
        },
    ];

    const values = getFieldsValues(fields);

    return { fields, values };
};

export const useNewGroupFields = (): {
    fields: IFieldInput[];
    values: Record<string, TFieldValue>;
} => {
    const fields = [
        {
            id: 'name',
            label: 'Name',
            required: true,
            validators: [isEmpty],
            errorLabels: ['Please enter a name'],
            input: {
                props: {
                    type: 'text' as TextFieldTypes,
                    placeholder: 'Family',
                },
                state: useFormInput(''),
            },
        },
        {
            id: 'description',
            label: 'Description',
            required: true,
            validators: [isEmpty],
            errorLabels: ['Please enter a name'],
            isTextArea: true,
            input: {
                props: {
                    type: 'text' as TextFieldTypes,
                    placeholder: 'In this group only family members are allowed',
                },
                state: useFormInput(''),
            },
        },
    ];

    const values = getFieldsValues(fields);

    return { fields, values };
};
