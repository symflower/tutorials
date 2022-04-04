import { PasswordComponent } from './components/password/password.component';

export const formRootValues = {
    extras: { lazyRender: true, resetFieldOnHide: true },
    types: [{ name: 'password', component: PasswordComponent }],
};

export class AppFormModule {}
