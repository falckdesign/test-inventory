import { Part } from './part.model';

export interface Batch {
  id: number;
  title: string;
  created_at: string;
  notices: string[];
  parts: Part[];
}
