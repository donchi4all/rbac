export interface PermissionInterface {
  id: number;
  title: string;
  description?: string;
  active: boolean;
  createdAt: Date,
  updatedAt: Date;
}

export type PermissionCreationType = Pick<PermissionInterface, 'title' | 'description' | 'active'>;
