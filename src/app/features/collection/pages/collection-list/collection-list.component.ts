import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionService } from '../../../../core/services/collection.service';
import {CollectionRequest} from '../../../../models/collectionRequests.model';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './collection-list.component.html',
  styles: [`
    .status-pending { @apply bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm }
    .status-accepted { @apply bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm }
    .status-completed { @apply bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm }
    .status-rejected { @apply bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm }
  `]
})
export class CollectionListComponent implements OnInit {
  requests: CollectionRequest[] = [];

  constructor(private collectionService: CollectionService) {}

  ngOnInit() {
    this.collectionService.getUserRequests(2).subscribe(requests => {
      this.requests = requests;
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
