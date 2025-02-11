import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
  totalWeight : number = 0;
  totalPoints: number = 0;
  collectionStatuses = Object.values(CollectionStatus);
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
      required: 'La date est requise',
      min: 'La date doit être aujourd\'hui ou dans le futur'
    },
    waste: {
      type: { required: 'Le type de déchet est requis' },
      weight: {
        required: 'Le poids est requis',
        min: 'Le poids doit être positif'
      }
    },
    totalWeight: {
      min: 'Le poids total doit être d\'au moins 1 kg',
      max: 'Le poids total ne peut pas dépasser 10 kg'
    }
  };

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
  ) {
    this.collectionForm = this.fb.group({
      wasteItems: this.fb.array([]),
      address: ['', Validators.required],
      date: [this.today, [Validators.required, this.futureDateValidator]],
      timeSlot: ['', [Validators.required, this.timeSlotValidator]],
      notes: ['']
    }, { validators: this.totalWeightValidator });

    this.addWasteItem();
    this.watchWeightChanges();
  }

  // Custom validators
  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { min: true };
  }

  private timeSlotValidator(control: AbstractControl): ValidationErrors | null {
    const time = control.value;
    if (!time) return null;

    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 9 || hours > 18) return { invalidTime: true };
    if (hours === 18 && minutes > 0) return { invalidTime: true };

    return null;
  }

  private totalWeightValidator(form: AbstractControl): ValidationErrors | null {
    const wasteItems = form.get('wasteItems')?.value;
    if (!wasteItems) return null;

    const total = wasteItems.reduce((sum: number, item: any) => sum + (Number(item.weight) || 0), 0);
    if (total < 1) return { minWeight: true };
    if (total > 10) return { maxWeight: true };

    return null;
  }

  get wasteItems() {
    return this.collectionForm.get('wasteItems') as FormArray;
  }

  createWasteItem(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0.1)]]
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
 calculatePoints() {
   this.totalPoints = this.wasteItems.controls.reduce((total, control) => {
     const type = control.get('type')?.value as WasteType;
     const weight = Number(control.get('weight')?.value) || 0;
     return total + (weight * (this.wastePoints[type] || 0));
   }, 0);
 }

  watchWeightChanges() {
    this.wasteItems.valueChanges.subscribe(items => {
      this.totalWeight = items.reduce((total: number, item: any) =>
        total + (Number(item.weight) || 0), 0);
       this.calculatePoints();
    });
  }

  onSubmit() {
    if (this.collectionForm.valid) {
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
        status: CollectionStatus.Pending,
          points: this.totalPoints
      };

      this.collectionService.createRequest(collection).subscribe(
        (response) => {
          console.log('Request created successfully', response);
          this.collectionForm.reset({
            wasteItems: this.fb.array([this.createWasteItem()]),
            date: this.today
          });
          this.totalWeight = 0;
        },
        (error) => {
          console.error('Error creating request', error);
        }
      );
    }
  }
}
