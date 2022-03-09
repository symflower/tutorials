import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login.component';
import { FormComponent } from './components/form/form.component';
import { PasswordComponent } from './components/password/password.component';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, FormComponent, LoginComponent],
    imports: [
        BrowserModule,
        FormlyBootstrapModule,
        FormlyModule.forRoot({
            extras: { lazyRender: true, resetFieldOnHide: true },
            types: [{ name: 'password', component: PasswordComponent }],
        }),
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class AppModule {}
