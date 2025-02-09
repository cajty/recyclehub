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
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6">Détails de la Demande de Collecte</h2>

      <form [formGroup]="collectionForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div formArrayName="wasteItems">
          <div *ngFor="let item of wasteItems.controls; let i=index" [formGroupName]="i"
               class="flex flex-wrap gap-4 items-center mb-4">
            <div class="flex-1">
              <select formControlName="type" class="w-full p-2 border rounded"
                      [ngClass]="{'border-red-500': item.get('type')?.errors?.['required'] && item.get('type')?.touched}">
                <option value="">Sélectionner le type</option>
                <option *ngFor="let type of wasteTypes" [value]="type">
                  {{type | titlecase}}
                </option>
              </select>
              <span class="text-red-500 text-sm" *ngIf="item.get('type')?.errors?.['required'] && item.get('type')?.touched">
                {{validationMessages.waste.type.required}}
              </span>
            </div>

            <div class="w-32">
              <input type="number" formControlName="weight"
                     class="w-full p-2 border rounded" placeholder="Poids (g)"
                     [ngClass]="{'border-red-500': (item.get('weight')?.errors?.['required'] || item.get('weight')?.errors?.['min']) && item.get('weight')?.touched}">
              <span class="text-red-500 text-sm" *ngIf="item.get('weight')?.errors?.['required'] && item.get('weight')?.touched">
                {{validationMessages.waste.weight.required}}
              </span>
              <span class="text-red-500 text-sm" *ngIf="item.get('weight')?.errors?.['min'] && item.get('weight')?.touched">
                {{validationMessages.waste.weight.min}}
              </span>
            </div>

            <button type="button" (click)="removeWasteItem(i)" class="p-2 text-red-600 hover:bg-red-50 rounded">
              <span class="sr-only">Supprimer</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <button type="button" (click)="addWasteItem()"
                  [disabled]="wasteItems.length >= 3"
                  class="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Ajouter un déchet
          </button>
          <div class="font-semibold" [ngClass]="{'text-red-500': totalWeight > 10000 || totalWeight < 1000}">
            Total: {{totalWeight}}g
          </div>
        </div>

        <div>
          <input formControlName="address" type="text"
                 class="w-full p-2 border rounded" placeholder="Adresse de collecte"
                 [ngClass]="{'border-red-500': collectionForm.get('address')?.errors?.['required'] && collectionForm.get('address')?.touched}">
          <span class="text-red-500 text-sm" *ngIf="collectionForm.get('address')?.errors?.['required'] && collectionForm.get('address')?.touched">
            {{validationMessages.address.required}}
          </span>
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <input formControlName="date" type="date" [min]="today"
                   class="w-full p-2 border rounded"
                   [ngClass]="{'border-red-500': collectionForm.get('date')?.errors?.['required'] && collectionForm.get('date')?.touched}">
            <span class="text-red-500 text-sm" *ngIf="collectionForm.get('date')?.errors?.['required'] && collectionForm.get('date')?.touched">
              {{validationMessages.date.required}}
            </span>
          </div>

          <div class="flex-1">
            <input formControlName="timeSlot" type="time" min="09:00" max="18:00"
                   class="w-full p-2 border rounded"
                   [ngClass]="{'border-red-500': (collectionForm.get('timeSlot')?.errors?.['required'] || collectionForm.get('timeSlot')?.errors?.['pattern']) && collectionForm.get('timeSlot')?.touched}">
            <span class="text-red-500 text-sm" *ngIf="collectionForm.get('timeSlot')?.errors?.['required'] && collectionForm.get('timeSlot')?.touched">
              {{validationMessages.timeSlot.required}}
            </span>
            <span class="text-red-500 text-sm" *ngIf="collectionForm.get('timeSlot')?.errors?.['pattern'] && collectionForm.get('timeSlot')?.touched">
              {{validationMessages.timeSlot.pattern}}
            </span>
          </div>
        </div>
        <div class="flex gap-4">
          <button type="submit"
                  [disabled]="!collectionForm.valid || !collection() || totalWeight < 1000 || totalWeight > 10000 || collectionForm.parent?.pristine"
                  class="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Mettre à jour
          </button>

          <button type="button" (click)="onDelete()"
                  class="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700">
            Supprimer
          </button>
        </div>
      </form>
    </div>
  `
})
export class CollectionDetailComponent implements OnInit {
  collectionForm: FormGroup;
  collection = signal<CollectionRequest | null>(null);
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

  watchWeightChanges() {
    this.wasteItems.valueChanges.subscribe(() => {
      this.updateTotalWeight();
      this.collectionForm.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.collectionForm.valid && this.collection() &&
        this.totalWeight >= 1000 && this.totalWeight <= 10000) {
      const formValue = this.collectionForm.value;
      const updates: CollectionRequest = {
        ...this.collection()!,
        address: formValue.address,
        date: formValue.date,
        timeSlot: formValue.timeSlot,
        waste: formValue.wasteItems.map((item: any) => ({
          type: item.type,
          estimatedWeight: Number(item.weight),
          realWeight: 0,
          wastePhotos: '',
          validWaste: false
        }))
      };

      this.collectionService.updateRequest(this.collection()!.id, updates)
        .subscribe({
          next: () => {
            this.store.dispatch({ type: '[Collection] Update Success' });
            this.router.navigate(['/collection']);
          },
          error: (error) => {
            console.error('Error updating request:', error);
            // Handle error (show message, etc.)
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
            // Handle error (show message, etc.)
          }
        });
    }
  }
}
