import { FormlyFieldConfig } from '@ngx-formly/core';

export class Form {
    fields: FormlyFieldConfig[];

    constructor(fields: FormlyFieldConfig[]) {
        this.fields = fields;
    }
}
