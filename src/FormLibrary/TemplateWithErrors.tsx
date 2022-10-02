import { IFieldInput, IFieldInputTextArea, TFieldError } from "./fields";

interface ITemplateWithErrorsProps {
    fields: IFieldInput[];
    errors: TFieldError;
}

const TemplateWithErrors: React.FC<ITemplateWithErrorsProps> = ({ fields, errors }) => {
    return (
        <>
            {fields.map((field, i) => {
                const errorStyle = field.errorStyle?.[field.id];
                const labelErrorStyle = errorStyle?.label;
                const inputErrorStyle = errorStyle?.input;
                const textErrorStyle = errorStyle?.text;
                const usedErrorStyle =
                    errors[field.id] && inputErrorStyle
                        ? { ...inputErrorStyle }
                        : {
                              textAlign: 'start',
                              border: '1px solid grey',
                              borderRadius: '5px',
                          };
                let fieldProps = { style: { ...usedErrorStyle } };
                let textArea;
                if (field.isTextArea) {
                    const castedField = field as IFieldInputTextArea;
                    fieldProps = { ...fieldProps, ...castedField.input.props, ...castedField.input.state };
                    textArea = <textarea {...fieldProps} />;
                } else {
                    fieldProps = { ...fieldProps, ...field.input.props, ...field.input.state };
                }
                return (
                    <div className="ion-margin-top" key={i}>
                        <label style={errors[field.id] && labelErrorStyle ? { ...labelErrorStyle } : {}}>
                            {field.label}
                        </label>
                        <div className="ion-margin-bottom" />
                        {textArea || <input {...fieldProps} />}
                        {errors[field.id] && (
                            <label style={{ ...(textErrorStyle || {}) }}>{errors[field.id]}</label>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default TemplateWithErrors;
