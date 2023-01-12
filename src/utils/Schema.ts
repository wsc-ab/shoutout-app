import {string} from 'yup';

export const defaultSchema = () => {
  const requiredText = 'Required';
  return {
    text: ({
      min,
      max,
      required,
    }: {
      min?: number;
      max?: number;
      required?: boolean;
    }) => {
      let schema = string();

      if (min !== undefined) {
        schema = schema.min(min, `Min ${min} characters`);
      }

      if (max !== undefined) {
        schema = schema.max(max, `Max ${max} characters`);
      }

      if (required) {
        schema = schema.required(requiredText);
      }

      return schema;
    },
    email: ({required}: {required?: boolean}) => {
      let schema = string().trim().email('Not a valid email address');

      if (required) {
        schema = schema.required(requiredText);
      }

      return schema;
    },
    website: ({required}: {required?: boolean}) => {
      let schema = string().trim().url('Not a valid website address');

      if (required) {
        schema = schema.required(requiredText);
      }

      return schema;
    },
  };
};
