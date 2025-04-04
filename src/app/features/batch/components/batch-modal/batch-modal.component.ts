import { Component } from '@angular/core';
import { Part } from '@/core/models/part.model';
import { PartService } from '@/features/services/part.service';
import { BatchService } from '@/features/services/batch.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatButton } from '@angular/material/button';
import { MatAutocompleteModule, MatOption } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Observable, ReplaySubject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-batch-modal',
  templateUrl: './batch-modal.component.html',
  styleUrls: ['./batch-modal.component.scss'],
  imports: [
    NgClass,
    CurrencyPipe,
    MatButton,
    MatFormField,
    MatDialogContent,
    MatInput,
    MatOption,
    MatLabel,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogActions
  ],
  standalone: true
})
export class BatchModalComponent {

  searchControl = new FormControl('');
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  public newBatchNotices:string[] = [];

  protected availableParts:Part[] = [];
  protected filteredParts:Part[] = [];
  public selectedParts:Part[] = []; // listed in modal, but not necessarily added in new batch
  public addedParts:Part[] = []; // added for creation of new batch

  constructor(
    private partService: PartService,
    private batchService: BatchService,
    public dialogRef: MatDialogRef<BatchModalComponent>
  ) {

  }

  ngOnInit(): void {
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        return this.partService.searchParts(query || '');
      }),
      takeUntil(this.destroyed$)
    ).subscribe({
      next: result => this.filteredParts = result,
      error: err => console.error('Search error:', err)
    });
  }
  firstSearch(){
    if(this.searchControl.pristine){
      this.searchControl.setValue('');
    }
  }
  selectPart(part: Part): void {
    if(!this.selectedParts.some(p => p.id === part.id)){ // part is not already selected, select it
      this.selectedParts = [...this.selectedParts, part];
      this.searchControl.setValue('');
    };
  }

  togglePart(part: Part): void {
    console.log("part to be toggled:",part);
    if(part.batchId){ // if part is already in some existing batch
      this.newBatchNotices.push(`${part.name} removed from batch ${part.batchId}`) //add a notice about the removal
      const updatedPart = {...part, batchId: null, removedFrom: [part.batchId]};
      this.partService.updatePart(part,updatedPart); // update part service to remove batch reference
      this.batchService.removePartFromBatch(part.batchId, part.id); // remove batch service to remove part reference

      const selectedPartIndex = this.selectedParts.findIndex(p => p.id === part.id);
      selectedPartIndex !== -1 ? this.selectedParts[selectedPartIndex].batchId = null : '';
      console.log("part removed from previous batch");
      return;
    }

    const partIndex = this.addedParts.findIndex(p => p.id === part.id);

    if(partIndex !== -1){ // if part is already added, remove from added
      this.addedParts.splice(partIndex, 1); // Modifies the original array
      console.log('part already added. now removed:',this.addedParts);
      return;
    };
    console.log('part added');
    this.addedParts = [...this.addedParts, part]; // if it gets here, adds the part
  }

  onSave(): void {
    const batchId = Math.floor(Math.random() * (99 - 25 + 1) + 25);
    const newBatch = {
      id: batchId,
      title: `Batch ${batchId}`,
      created_at: new Date().toISOString(),
      notices:this.newBatchNotices,
      parts: this.addedParts
    };
    this.batchService.createBatch(newBatch);
    this.partService.getAllParts().subscribe((allParts)=>{
      console.log("all updated parts:",allParts);
    })

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
