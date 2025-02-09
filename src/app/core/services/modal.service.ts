// modal.service.ts
import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isVisibleSignal = signal<boolean>(false);
  private currentRequestSignal = signal<CollectionRequest | null>(null);

  isVisible = this.isVisibleSignal.asReadonly();
  currentRequest = this.currentRequestSignal.asReadonly();

  openModal(request: CollectionRequest) {
    this.currentRequestSignal.set(request);
    this.isVisibleSignal.set(true);
  }

  closeModal() {
    this.isVisibleSignal.set(false);
    this.currentRequestSignal.set(null);
  }

  updateRequest(request: CollectionRequest) {
    this.currentRequestSignal.set(request);
  }
}

// types.ts
export interface CollectionRequest {
  id: number;
  date: string;
  timeSlot: string;
  status: 'pending' | 'ongoing' | 'completed' | 'rejected';
  address: string;
  waste: WasteItem[];
}

export interface WasteItem {
  type: 'plastic' | 'glass' | 'paper' | 'metal';
  estimatedWeight: number;
}
