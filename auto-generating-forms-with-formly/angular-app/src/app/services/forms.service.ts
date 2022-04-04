import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Form } from '../models/form.model';
import { FormType } from '../models/form.enum';
import { Login } from './login';

@Injectable({ providedIn: 'root' })
export class FormsService {
    getForm(form: FormType, model: any): Observable<Form> {
        switch (form) {
            case FormType.LOGIN:
                return of(new Form(Login.getLoginFormConfig()));
            default:
                throw new Error('Fields for the given form ' + form + ' does not exist!');
        }
    }
}
