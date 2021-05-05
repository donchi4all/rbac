export interface RoleInterface {
  id: number;
  title: string;
  description?: string;
  active: boolean;
  createdAt: Date,
  updatedAt: Date;
}

export type RoleCreationType = Pick<RoleInterface, 'title' | 'description' | 'active'>;
