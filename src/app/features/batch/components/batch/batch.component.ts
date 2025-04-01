import { Component, Input } from '@angular/core';
import { Batch } from '@/core/models/batch.model';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss'],
  imports:[NgClass,CurrencyPipe],
  standalone: true
})
export class BatchComponent {
  @Input() batch!: Batch;
}
