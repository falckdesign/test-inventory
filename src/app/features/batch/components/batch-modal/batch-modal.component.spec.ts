import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BatchModalComponent } from './batch-modal.component';
import { PartService } from '@/features/services/part.service';
import { BatchService } from '@/features/services/batch.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';
import { Part } from '@/core/models/part.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { Batch } from '@/core/models/batch.model';

fdescribe('BatchModalComponent', () => {
  let component: BatchModalComponent;
  let fixture: ComponentFixture<BatchModalComponent>;
  let partServiceSpy: jasmine.SpyObj<PartService>;
  let batchServiceSpy: jasmine.SpyObj<BatchService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<BatchModalComponent>>;

  const mockParts: Part[] = [
    { id: 1, name: 'Resistor', price: 1.5, status: 'ACTIVE', created_at: '2025-03-31T14:09:08.164Z', updated_at: null, created_by: 'Admin', batchId: 1 },
    { id: 2, name: 'Capacitor', price: 2.0, status: 'ACTIVE', created_at: '2025-03-31T14:09:08.164Z', updated_at: null, created_by: 'Admin', batchId: null },
    { id: 22, name: 'Antenna', price: 2.0, status: 'ACTIVE', created_at: '2025-03-31T14:09:08.164Z', updated_at: null, created_by: 'Admin', batchId: null },
  ];

  beforeEach(() => {
    partServiceSpy = jasmine.createSpyObj('PartService', ['searchParts', 'updatePart', 'getAllParts']);
    batchServiceSpy = jasmine.createSpyObj('BatchService', ['createBatch', 'removePartFromBatch']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        NgClass,
        CurrencyPipe,
        MatLabel,
        MatDialogContent,
        MatDialogActions,
        MatOptionModule,
        BatchModalComponent
      ],
      declarations: [],
      providers: [
        { provide: PartService, useValue: partServiceSpy },
        { provide: BatchService, useValue: batchServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchModalComponent);
    component = fixture.componentInstance;
    partServiceSpy.searchParts.and.returnValue(of(mockParts.filter(p => p.status === 'ACTIVE')));
    partServiceSpy.getAllParts.and.returnValue(of(mockParts.filter(p => p.status === 'ACTIVE')));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize search control and setup search on ngOnInit', fakeAsync(() => {
    expect(component.searchControl).toBeDefined();
    component.ngOnInit();
    component.searchControl.setValue('');
    tick(300);
    expect(partServiceSpy.searchParts).toHaveBeenCalledWith('');
  }));

  it('selectPart should add a part to selectedParts if not already present and clear search control', () => {
    const partToAdd = mockParts[0];
    component.selectPart(partToAdd);
    expect(component.selectedParts).toContain(partToAdd);
    expect(component.searchControl.value).toBe('');
  });

  describe('togglePart', () => {
    it('should remove a part from a batch and update services if it has a batchId', () => {
      const partToRemove = { ...mockParts[0] }; // This part has batchId: 1
      const batchIdToRemove: number = partToRemove.batchId!;
      const updatedPart = { ...partToRemove, batchId:null, removedFrom: [batchIdToRemove] };

      component.togglePart(partToRemove);
      expect(component.newBatchNotices).toContain(`${partToRemove.name} removed from batch ${batchIdToRemove}`);
      expect(partServiceSpy.updatePart).toHaveBeenCalledWith(
        partToRemove,
        updatedPart
      );
      expect(batchServiceSpy.removePartFromBatch).toHaveBeenCalledWith(batchIdToRemove, partToRemove.id);
    });

    it('should remove a part from addedParts if it is already added', () => {
      const partToRemove = mockParts[1]; // This part has batchId: null
      component.addedParts = [mockParts[0],mockParts[1]];
      component.togglePart(partToRemove);
      expect(component.addedParts).toEqual([mockParts[0]]);
      expect(partServiceSpy.updatePart).not.toHaveBeenCalled();
      expect(batchServiceSpy.removePartFromBatch).not.toHaveBeenCalled();
    });

    it('should add a part to addedParts if it is not already added and does not have a batchId', () => {
      const partToAdd = { ...mockParts[1], batchId: null }; // Ensure batchId is null for this test
      component.addedParts = [mockParts[0]];
      component.togglePart(partToAdd);
      expect(component.addedParts).toEqual([mockParts[0],partToAdd]);
      expect(partServiceSpy.updatePart).not.toHaveBeenCalled();
      expect(batchServiceSpy.removePartFromBatch).not.toHaveBeenCalled();
    });
  });

  describe('onSave', () => {
    it('should create a new batch with addedParts and close the dialog', () => {
      const addedParts = [mockParts[1], mockParts[2]];
      component.addedParts = addedParts;
      const expectedNewBatch: Batch = {
        id: 31,
        title: "Batch Test",
        created_at: new Date().toISOString(),
        notices: component.newBatchNotices,
        parts: addedParts,
      };
      batchServiceSpy.createBatch.and.callFake((batch: Batch) => {
        expect(batch.parts).toEqual(addedParts);
      });
      partServiceSpy.getAllParts.and.returnValue(of(mockParts.filter(p => p.status === 'ACTIVE')));

      component.onSave();

      expect(batchServiceSpy.createBatch).toHaveBeenCalledWith(jasmine.objectContaining({ parts: addedParts }));
      expect(partServiceSpy.getAllParts).toHaveBeenCalled();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should generate a batch ID between 25 and 99', () => {
      component.addedParts = [mockParts[1]];
      let generatedBatchId: number | undefined;
      batchServiceSpy.createBatch.and.callFake((batch: Batch) => {
        generatedBatchId = batch.id;
      });
      partServiceSpy.getAllParts.and.returnValue(of(mockParts.filter(p => p.status === 'ACTIVE')));
      component.onSave();
      expect(generatedBatchId).toBeGreaterThanOrEqual(25);
      expect(generatedBatchId).toBeLessThanOrEqual(99);
      expect(batchServiceSpy.createBatch).toHaveBeenCalled();
    });
  });

  it('onCancel should close the dialog', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('ngOnDestroy should complete the destroyed$ subject', () => {
    component.ngOnInit();
    const nextSpy = spyOn(component['destroyed$'], 'next');
    const completeSpy = spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});
