import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionService } from '../../../../core/services/collection.service';
import {CollectionRequest} from '../../../../models/collectionRequests.model';
import {Router, RouterModule} from '@angular/router';
import {CollectionStatus} from '../../../../models/CollectionStatus';
import {FormsModule} from '@angular/forms';
import {filter} from 'rxjs';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
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
   userTypes :string = localStorage.getItem('user-type') || '';
  isCollector: boolean = this.userTypes === 'collector';
  collectionStatuses = Object.values(CollectionStatus);

  constructor(
    private collectionService: CollectionService,
    private router: Router
  ) {}

  ngOnInit() {
    if(this.isCollector){
      const id :string = localStorage.getItem("user-id") || '';
       this.collectionService.getUserRequests(id).pipe(
         requests => requests[]
        filter(requests => requests[] !== null)
       )
    }else{
  this.collectionService.getPendingRequests().subscribe(requests => {
    this.requests = requests;
  });
}

  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
  getrequestDetails(id: string): void {
    this.router.navigate(['/collection', id]);
  }

updateRequestStatus(id: string, status: CollectionStatus): void {
  this.collectionService.updateRequestStatus(id, status).subscribe(() => {
    const request = this.requests.find(request => request.id === id);
    if (request) {
      request.status = status;
    }
  });
}

  protected readonly CollectionStatus = CollectionStatus;
}
