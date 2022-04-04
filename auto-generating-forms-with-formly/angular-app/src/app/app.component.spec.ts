import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from 'src/app/app.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});

export function getElementById(fixture: ComponentFixture<any>, id: string) {
    return fixture.debugElement.query(By.css('#' + id));
}

export function getElement(fixture: ComponentFixture<any>, element: string) {
    return fixture.debugElement.query(By.css(element));
}
