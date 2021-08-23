export interface PermissionInterface {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date,
  updatedAt: Date;
}

export type PermissionCreationType = Pick<PermissionInterface, 'title'|'description'|'isActive'>;

export type PermissionCreationRequestType = PermissionCreationType;
