import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { WasteType } from '../../../../models/WasteType';
import { CollectionRequest } from '../../../../models/collectionRequests.model';
import { CollectionStatus } from '../../../../models/CollectionStatus';
import { CollectionService } from '../../../../core/services/collection.service';


@Component({
  selector: 'app-collection-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collection-request.component.html',
})
export class CollectionRequestComponent {
  collectionForm: FormGroup;
  today = new Date().toISOString().split('T')[0];
  wasteTypes = Object.values(WasteType);
  totalWeight = 0;

  validationMessages = {
    address: {
      required: 'L\'adresse est requise'
    },
    timeSlot: {
      required: 'L\'horaire est requis',
      pattern: 'L\'horaire doit être entre 09:00 et 18:00'
    },
    date: {
      required: 'La date est requise',
      min: 'La date doit être dans le futur'
    },
    waste: {
      type: { required: 'Le type de déchet est requis' },
      weight: {
        required: 'Le poids est requis',
        min: 'Le poids doit être positif'
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
  ) {
    this.collectionForm = this.fb.group({
      wasteItems: this.fb.array([]),
      address: ['', Validators.required],
      date: [this.today, [Validators.required, Validators.min(new Date().getTime())]],
      timeSlot: ['', [Validators.required, Validators.pattern('^([0-9]|0[0-9]|1[0-8]):[0-5][0-9]$')]],
      notes: ['']
    });

    this.addWasteItem();
    this.watchWeightChanges();
  }

  get wasteItems() {
    return this.collectionForm.get('wasteItems') as FormArray;
  }

  createWasteItem(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addWasteItem() {
    this.wasteItems.push(this.createWasteItem());
  }

  removeWasteItem(index: number) {
    if (this.wasteItems.length > 1) {
      this.wasteItems.removeAt(index);
    }
  }

  watchWeightChanges() {
    this.wasteItems.valueChanges.subscribe(items => {
      this.totalWeight = items.reduce((total: number, item: any) =>
        total + (Number(item.weight) || 0), 0);
    });
  }

  onSubmit() {
    if (this.collectionForm.valid && this.totalWeight >= 1 && this.totalWeight <= 10) {
      const formValue = this.collectionForm.value;
      const userId: string | null = localStorage.getItem("user-id");

      const collection: CollectionRequest = {
        id: Math.random().toString(36).substr(2, 9),
        userId: userId ?? '',
        collectorId: null,
        waste: formValue.wasteItems.map((item: any) => ({
          type: item.type,
          estimatedWeight: item.weight,
          realWeight: 0,
          wastePhotos: '',
          validWaste: false
        })),
        address: formValue.address,
        date: formValue.date,
        timeSlot: formValue.timeSlot,
        status: CollectionStatus.Pending
      };

      this.collectionService.createRequest(collection).subscribe(
        (response) => {
          console.log('Request created successfully', response);
          this.collectionForm.reset();
          this.addWasteItem();
          this.totalWeight = 0;
        },
        (error) => {
          console.error('Error creating request', error);
        }
      );
    }
  }
}
