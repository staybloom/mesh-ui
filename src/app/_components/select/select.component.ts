import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
})
export class SelectComponent {
  @Input('disabled') disabled: boolean = false;
  @Input('data') data: any;

  @Output() reason = new EventEmitter<string>();
  ngOnInit() {}
  changeSelect($event: any) {
    //console.log($event);
    this.reason.emit($event.value);
  }
}
