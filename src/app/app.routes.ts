import { Routes } from '@angular/router';
import { BatchListComponent } from './features/batch/components/batch-list/batch-list.component';

export const routes: Routes = [
  { path: 'batches', component: BatchListComponent },
  { path: '', redirectTo: '/batches', pathMatch: 'full' },
  { path: '**', redirectTo: '/batches' }
];
