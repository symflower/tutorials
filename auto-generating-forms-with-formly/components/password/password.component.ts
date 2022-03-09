import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'sym-password',
    styleUrls: ['./password.component.scss'],
    templateUrl: './password.component.html',
})
export class PasswordComponent extends FieldType {
    showPassword = false;

    public togglePasswordShown() {
        this.showPassword = !this.showPassword;
    }
}
