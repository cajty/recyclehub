// collection-detail.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { WasteType } from '../../../../models/WasteType';
import { CollectionRequest } from '../../../../models/collectionRequests.model';
import { CollectionStatus } from '../../../../models/CollectionStatus';
import { CollectionService } from '../../../../core/services/collection.service';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collection-detail.component.html',
})

export class CollectionDetailComponent implements OnInit {
  collectionForm: FormGroup;
  collection = signal<CollectionRequest | null>(null);
  today = new Date().toISOString().split('T')[0];
  wasteTypes = Object.values(WasteType);
  totalWeight = 0;
  totalPoints = 0;
readonly wastePoints: { [key in WasteType]: number } = {
  [WasteType.Plastic]: 2,
  [WasteType.Paper]: 1,
  [WasteType.Glass]: 1,
  [WasteType.Metal]: 5
};

  validationMessages = {
    address: {
      required: 'L\'adresse est requise'
    },
    timeSlot: {
      required: 'L\'horaire est requis',
      pattern: 'L\'horaire doit être entre 09:00 et 18:00'
    },
    date: {
      required: 'La date est requise'
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
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.collectionForm = this.fb.group({
      wasteItems: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      address: ['', Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', [Validators.required, Validators.pattern('^(09|1[0-7]):[0-5][0-9]$')]],
      notes: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.collectionService.getRequestById(id).subscribe({
      next: (request) => {
        if (request && request.status === CollectionStatus.Pending) {
          this.collection.set(request);
          this.initForm(request);
          this.watchWeightChanges();
        } else {
          this.router.navigate(['/collection']);
        }
      },
      error: (error) => {
        console.error('Error fetching collection request:', error);
        this.router.navigate(['/collection']);
      }
    });
  }

  get wasteItems() {
    return this.collectionForm.get('wasteItems') as FormArray;
  }

  createWasteItem(type = '', weight = 0): FormGroup {
    return this.fb.group({
      type: [type, Validators.required],
      weight: [weight, [Validators.required, Validators.min(0)]]
    });
  }

  initForm(request: CollectionRequest) {
    while (this.wasteItems.length) {
      this.wasteItems.removeAt(0);
    }

    request.waste.forEach(waste => {
      this.wasteItems.push(this.createWasteItem(waste.type, waste.estimatedWeight));
    });

    this.collectionForm.patchValue({
      address: request.address,
      date: request.date,
      timeSlot: request.timeSlot,

    });

    this.collectionForm.markAsPristine();
    this.updateTotalWeight();
  }

  addWasteItem() {
    if (this.wasteItems.length < 3) {
      this.wasteItems.push(this.createWasteItem());
    }
  }

  removeWasteItem(index: number) {
    if (this.wasteItems.length > 1) {
      this.wasteItems.removeAt(index);
    }
  }

  updateTotalWeight() {
    this.totalWeight = this.wasteItems.controls.reduce((total, control) => {
      const weight = control.get('weight')?.value || 0;
      return total + Number(weight);
    }, 0);
  }
    calculatePoints() {
      this.totalPoints = this.wasteItems.controls.reduce((total, control) => {
        const type = control.get('type')?.value as WasteType;
        const weight = Number(control.get('weight')?.value) || 0;
        return total + (weight * (this.wastePoints[type] || 0));
      }, 0);
    }

  watchWeightChanges() {
    this.wasteItems.valueChanges.subscribe(() => {
      this.updateTotalWeight();
      this.calculatePoints();
      this.collectionForm.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.collectionForm.valid && this.collection() &&
        this.totalWeight >= 1 && this.totalWeight <= 10) {
      const formValue = this.collectionForm.value;
      const updates: CollectionRequest = {
        ...this.collection()!,
        waste: formValue.wasteItems.map((item: any) => ({
          type: item.type,
          estimatedWeight: Number(item.weight),
          realWeight: 0,
          wastePhotos: '',
          validWaste: false,
        })),
        address: formValue.address,
        date: formValue.date,
        timeSlot: formValue.timeSlot,
          points: this.totalPoints,
      };

      this.collectionService.updateRequest(this.collection()!.id, updates)
        .subscribe({
          next: () => {
            this.store.dispatch({ type: '[Collection] Update Success' });
            this.router.navigate(['/collection']);
          },
          error: (error) => {
            console.error('Error updating request:', error);
          }
        });
    }
  }

  onDelete() {
    if (this.collection()) {
      this.collectionService.deleteRequest(this.collection()!.id)
        .subscribe({
          next: () => {
            this.store.dispatch({ type: '[Collection] Delete Success' });
            this.router.navigate(['/collection']);
          },
          error: (error) => {
            console.error('Error deleting request:', error);
          }
        });
    }
  }

}
