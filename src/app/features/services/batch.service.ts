import { Injectable } from '@angular/core';
import { Batch } from '../../core/models/batch.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private batches: Batch[] = [
    {
      id: 1,
      title: "Batch 01",
      created_at: "2025-03-31T13:49:33.191Z",
      notices:[],
      parts: [
        {
          id: 1,
          name: 'Resistor',
          price: 1.5,
          status: 'ACTIVE',
          created_at: '2025-03-31T14:09:08.164Z',
          updated_at: null,
          created_by: 'Admin',
          batchId: 1
        },
        {
          id: 3,
          name: 'Inductor',
          price: 3.2,
          status: 'ACTIVE',
          created_at: '2025-03-31T14:09:08.164Z',
          updated_at: null,
          created_by: 'System',
          batchId: 1,
          removedFrom:[]
        }
      ]
    },
    {
      id: 2,
      title: "Batch 02",
      created_at: "2025-03-31T13:49:56.080Z",
      notices:[],
      parts: [
        {
          id: 10,
          name: 'Relay',
          price: 6.0,
          status: 'ACTIVE',
          created_at: '2025-03-31T14:09:08.164Z',
          updated_at: null,
          created_by: 'Admin',
          batchId: 2,
          removedFrom:[]
        },
        {
          id: 11,
          name: 'Thermistor',
          price: 1.8,
          status: 'ACTIVE',
          created_at: '2025-03-31T14:09:08.164Z',
          updated_at: null,
          created_by: 'System',
          batchId: 2,
          removedFrom:[]
        },
        {
          id: 12,
          name: 'Varistor',
          price: 2.2,
          status: 'ACTIVE',
          created_at: '2025-03-31T14:09:08.164Z',
          updated_at: null,
          created_by: 'Admin',
          batchId: 2,
          removedFrom:[]
        }
      ]
    }
  ]; // Hardcoded for now
  private batchesSubject = new BehaviorSubject<Batch[]>(this.batches);

  getBatches(): Observable<Batch[]> {
    return this.batchesSubject.asObservable();
  }

  createBatch(batch: Batch): void {
    console.log("new batch:",batch);
    this.batches.push(batch);
    this.batchesSubject.next(this.batches);
  }

  removePartFromBatch(batchId: number, partId: number): void {
    const batchIndex = this.batches.findIndex(batch => batch.id === batchId);
    if (batchIndex === -1) {
      return;
    }
    const partIndex = this.batches[batchIndex].parts.findIndex(part => part.id === partId);

    if (partIndex === -1) {
      return
    }
    const part = this.batches[batchIndex].parts[partIndex];
    part.updated_at = new Date().toISOString();
    part.batchId = null;
    part.removedFrom? part.removedFrom.push(batchId) : part.removedFrom = [batchId];
    //this.batchesSubject.next(this.batches);

  }
}
