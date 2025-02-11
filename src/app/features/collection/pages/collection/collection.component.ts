import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {CollectionListComponent} from '../collection-list/collection-list.component';
import {CollectionRequestComponent} from '../collection-request/collection-request.component';
import {Store} from '@ngrx/store';
import * as UserSelectors from '../../../../store/user/user.selectors';



@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    CollectionRequestComponent, CollectionListComponent
  ],
  templateUrl: './collection.component.html',
})
export class CollectionComponent {
  userTypes :string = localStorage.getItem('user-type') || '';
  isCollector: boolean = this.userTypes === 'collector';
}
