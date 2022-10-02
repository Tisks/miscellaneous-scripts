import { useState } from 'react';
import { TFieldError, IFieldInput, interpolate } from './fields';
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IFormInputHandlers {
    reset: (newValue: any) => void;
    onIonChange: (e: any) => Promise<void>;
    onKeyUp: (e: any) => Promise<void>;
}

export interface IFormInput extends IFormInputHandlers {
    value: string | number | null | undefined;
}

export const useFormInput = (initialValue = ''): IFormInput => {
    const [value, setValue] = useState<string | number | null | undefined>(initialValue);

    const handleChange = async (e: any) => {
        const tempValue = await e.target.value;
        setValue(tempValue);
    };

    return {
        value,
        reset: (newValue) => setValue(newValue),
        onIonChange: handleChange,
        onKeyUp: handleChange,
    };
};

export const validateForm = (fields: IFieldInput[], forceFieldValue?: Record<string, any>) => {
    let errors: TFieldError = {};

    fields.forEach((field: IFieldInput) => {
        if (field.required) {
            const fieldValue = field.input.state.value;
            const { validators, errorLabels, validatorsExtraArgs, interpolateExtraArgs } = field;
            if (validators && errorLabels) {
                for (let index = 0; index < validators.length; index++) {
                    const validator = validators[index];
                    let usedFieldValue = fieldValue;
                    //If there's a value that corresponds to the field use it instead
                    if (forceFieldValue?.[field.id]) usedFieldValue = forceFieldValue[field.id];
                    //If there's no errorLabel that corresponds to the validator and there's no value
                    //passed then don't evaluate the field with that validator
                    if (!errorLabels[index] && !forceFieldValue?.[field.id]) continue;
                    const hasError =
                        validatorsExtraArgs && validatorsExtraArgs[index]
                            ? validator(usedFieldValue, ...validatorsExtraArgs[index])
                            : validator(usedFieldValue);
                    if (hasError) {
                        const usedErrorLabel = typeof hasError === 'string' ? hasError : errorLabels[index];
                        const validErrorLabel: string = interpolateExtraArgs
                            ? interpolate(usedErrorLabel, interpolateExtraArgs)
                            : usedErrorLabel;
                        errors = { ...errors, [field.id]: validErrorLabel };
                    }
                }
            }
        }
    });

    return errors;
};
