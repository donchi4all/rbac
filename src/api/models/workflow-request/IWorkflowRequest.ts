export interface WorkflowRequestInterface {
  id: number;
  userId: string;
  businessId: string;
  businessUserRoleId: number;
  workflowId: number;
  permissionId: number;
  workflowableType: string;
  workflowableId: string;
  previousStep: string;
  nextStep: string;
  action: `${WorkflowRequestAction}`;
  createdAt: Date;
  updatedAt: Date;
}

export enum WorkflowRequestAction {
  APPROVED = 'approved', 
  REJECTED = 'rejected', 
  FLAGGED = 'flagged',
  CREATED = 'created', 
  EDITED = 'edited', 
  DELETED = 'deleted'
}

export type WorkflowRequestCreationType = Pick<
  WorkflowRequestInterface, 
  'userId'|'businessId'|'businessUserRoleId'|'workflowId'|
  'permissionId'|'workflowableType'|'workflowableId'|
  'previousStep'|'nextStep'|'action'
>
