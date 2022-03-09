import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormAttributes } from '../../models/form-attributes.model';
import { Form } from '../../models/form.model';
import { FormsService } from '../../services/forms.service';

@Component({
    selector: 'sym-form',
    styleUrls: ['./form.component.scss'],
    templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
    @Input()
    public formAttributes: FormAttributes;

    @Output()
    public submitted = new EventEmitter<any>();

    formGroup: FormGroup = new FormGroup({});

    fields: FormlyFieldConfig[] = [];

    constructor(private formsService: FormsService) {}

    ngOnInit(): void {
        if (this.formAttributes.formType) {
            this.formsService.getForm(this.formAttributes.formType, this.formAttributes.model).subscribe((form: Form) => {
                this.fields = form.fields;
            });
        }
    }

    submit() {
        this.submitted.emit(this.formAttributes.model);
    }
}
