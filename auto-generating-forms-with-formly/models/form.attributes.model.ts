import { FormType } from './forms.enum';

export interface FormAttributes {
    buttonText: string;
    formType: FormType;
    model: any;
}
