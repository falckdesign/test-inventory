import { Component, OnInit } from '@angular/core';
import { BatchService } from '@/features/services/batch.service';
import { Batch } from '@/core/models/batch.model';
import { BatchComponent } from "../batch/batch.component";
import { BatchModalComponent } from '../batch-modal/batch-modal.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { DialogRef } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss'],
  standalone: true,
  imports: [
    BatchComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class BatchListComponent implements OnInit {
  batchs: Batch[] = [];
  dialogRef!:MatDialogRef<BatchModalComponent>;
  constructor(
    private batchService: BatchService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getBatchs();
  }
  getBatchs(){
    this.batchService.getBatches().subscribe(batches => {
      this.batchs = batches;
      console.log("+ + + + bacthes change detected!!!!!!!",this.batchs);

    });
  }
  openBatchModal(): void {
    this.dialogRef = this.dialog.open(BatchModalComponent, {
      width: '800px', // Adjust size if needed
    });

    // Handle the result when modal is closed
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New batch added:', result);
        // Refresh batch list or update state if necessary
      }
    });
  }
  closeModal():void{
    this.dialogRef.close();
  }
}
