import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { FormAttributes } from '../../models/form-attributes.model';
import { FormType } from '../../models/form.enum';
import { LoginFormModel } from '../../models/login-form.model';

@Component({
    selector: 'sym-login',
    styleUrls: ['./login.component.scss'],
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    showPassword = false;
    formAttributes: FormAttributes;
    loginFormModel: LoginFormModel;

    constructor(
        private title: Title,
    ) {}

    ngOnInit() {
        this.title.setTitle('Login');

        this.loginFormModel = new LoginFormModel();
        this.formAttributes = {
            buttonText: 'Login',
            formType: FormType.LOGIN,
            model: this.loginFormModel,
        };
    }

    submit(formModel: LoginFormModel) {
        console.log('Successfully logged in');
    }

}
