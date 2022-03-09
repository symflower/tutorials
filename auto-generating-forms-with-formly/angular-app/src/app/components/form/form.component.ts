import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormAttributes } from 'src/app/models/form-attributes.model';
import { Form } from 'src/app/models/form.model';
import { FormsService } from 'src/app/services/forms.service';

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

    @Output()
    public forgotten = new EventEmitter<any>();

    @Output()
    public passwordShown = new EventEmitter<any>();

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

    showPassword() {
        this.formAttributes.model.showPassword = !this.formAttributes.model.showPassword;
        this.passwordShown.emit(this.formAttributes.model);
    }
}
