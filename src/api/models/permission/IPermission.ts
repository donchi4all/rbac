export interface PermissionInterface {
  id: number;
  platformId: number;
  title: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date,
  updatedAt: Date;
}

export type PermissionCreationType = Pick<
  PermissionInterface, 
  'platformId'|'title'|'slug'|'description'|'isActive'
>;

export type PermissionCreationRequestType = Pick<
  PermissionInterface, 
  'platformId'|'title'|'description'|'isActive'
>;

export type PermissionEditRequestType = PermissionCreationRequestType;
