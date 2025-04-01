import { Injectable } from '@angular/core';
import { Part } from '../../core/models/part.model';
import { debounceTime, distinctUntilChanged, empty, map, Observable, of, shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  private parts:Part[] = [
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
      id: 2,
      name: 'Capacitor',
      price: 2.0,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 22,
      name: 'Antenna',
      price: 2.0,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 3,
      name: 'Inductor',
      price: 3.2,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'System',
      batchId: 1
    },
    {
      id: 4,
      name: 'Diode',
      price: 0.8,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 5,
      name: 'Transistor',
      price: 4.5,
      status: 'INACTIVE',
      created_at: '2025-03-25T14:09:08.164Z',
      updated_at: '2025-04-30T14:09:08.164Z',
      created_by: 'System',
      batchId: null
    },
    {
      id: 6,
      name: 'Integrated Circuit',
      price: 12.0,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 7,
      name: 'Potentiometer',
      price: 2.5,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'System',
      batchId: null
    },
    {
      id: 8,
      name: 'Crystal Oscillator',
      price: 5.5,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 9,
      name: 'Fuse',
      price: 0.5,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'System',
      batchId: null
    },
    {
      id: 10,
      name: 'Relay',
      price: 6.0,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: 2
    },
    {
      id: 11,
      name: 'Thermistor',
      price: 1.8,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'System',
      batchId: 2
    },
    {
      id: 12,
      name: 'Varistor',
      price: 2.2,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: 2
    },
    {
      id: 13,
      name: 'Optocoupler',
      price: 3.8,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'System',
      batchId: null
    },
    {
      id: 14,
      name: 'Voltage Regulator',
      price: 7.0,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 15,
      name: 'Microcontroller',
      price: 15.5,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'System',
      batchId: null
    },
    {
      id: 16,
      name: 'Operational Amplifier',
      price: 4.2,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 17,
      name: 'LED',
      price: 0.3,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'System',
      batchId: null
    },
    {
      id: 18,
      name: 'Button',
      price: 0.6,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 19,
      name: 'Speaker',
      price: 9.0,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'System',
      batchId: null
    },
    {
      id: 20,
      name: 'Microphone',
      price: 5.8,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    },
    {
      id: 21,
      name: 'Duct Tape',
      price: .8,
      status: 'ACTIVE',
      created_at: '2025-03-31T14:09:08.164Z',
      updated_at: null,
      created_by: 'Admin',
      batchId: null
    }
  ];

  public getAllParts(): Observable<Part[]> {
    return of(this.parts.filter(part => part.status === 'ACTIVE'));
  }

  public searchParts(query: string):Observable<Part[]> {
    console.log("= = = = = = QUERY: ",query);
    if(!query || !query.length){
      return of(this.parts.filter(part => part.status === 'ACTIVE'));
    }

    const _query = query.toLowerCase();
    return of(this.parts.filter(part =>
      part.name.toLowerCase().includes(_query)
      && part.status === 'ACTIVE'
    ));
  }

  public updatePart(oldPart:Part, newPart:Part):void{
    const index = this.parts.findIndex(part => part.id === oldPart.id);
    if(index !== -1){
      this.parts[index] = newPart;
    }
  }

  isPartInAnyBatch(partToCheck:Part):Observable<boolean>{
    return this.getAllParts().pipe(
      map((allParts) => {
        const foundPart = allParts.find((part) => part.id === partToCheck.id);
        return !!foundPart?.batchId;
      })
    );
  }

}
