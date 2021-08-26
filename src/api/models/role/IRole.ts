export interface RoleInterface {
  id: number;
  businessId: string;
  title: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RoleCreationType = Pick<RoleInterface, 'businessId'|'title'|'slug'|'description'|'isActive'>;

export type RoleCreationRequestType = Pick<RoleInterface, 'businessId'|'title'|'description'|'isActive'>;

export type RoleEditRequestType = RoleCreationRequestType;
