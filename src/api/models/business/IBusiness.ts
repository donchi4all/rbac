export interface BusinessInterface {
  id: string;
  platformId: number;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BusinessCreationType = Pick<BusinessInterface, 'name'|'description'|'isActive' >

export type BusinessCreationRequestType = Pick<BusinessInterface, 'name'|'description'|'isActive'> & {platform: string};