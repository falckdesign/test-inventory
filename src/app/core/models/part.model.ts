export interface Part {
  id: number;
  name: string;
  price: number | null;
  status: "ACTIVE" | "INACTIVE" | null;
  batchId: number | null;  // Indicates which batch the part belongs to (or null if not assigned)
  removedFrom?:number[];
  created_at: string;
  updated_at: string | null;
  created_by: string | null;
}
