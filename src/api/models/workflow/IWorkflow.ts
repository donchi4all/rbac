export interface WorkflowInterface {
  id: number;
  businessId: string;
  title: string;
  slug: string;
  description?: string;
  process: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkflowCreationType = Pick<
  WorkflowInterface, 
  'businessId'|'title'|'slug'|'process'|'description'
>;

export type WorkflowCreationRequestType = Pick<
  WorkflowInterface, 
  'businessId'|'title'|'process'|'description'
>;

export type WorkflowEditRequestType = WorkflowCreationRequestType;