export interface GrantInterface {
  id: number;
  title: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
