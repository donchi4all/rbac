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

export type WorkflowCreationType = Pick<WorkflowInterface, 'businessId'|'title'|'process'|'description' >
