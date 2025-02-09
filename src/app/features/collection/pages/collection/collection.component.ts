import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {CollectionListComponent} from '../collection-list/collection-list.component';
import {CollectionRequestComponent} from '../collection-request/collection-request.component';



@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
     CollectionRequestComponent
  ],
  templateUrl: './collection.component.html',
})
export class CollectionComponent {

}
