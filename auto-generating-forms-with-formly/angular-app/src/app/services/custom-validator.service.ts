import { FormControl } from '@angular/forms';

export function EmailValidator(control: FormControl): boolean {
  return control.value.match(
    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  );
}
