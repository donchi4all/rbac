export interface WorkflowablePermissionInterface {
  id: string;
  businessId: string;
  permissionId: string;
  workflowId: string;
}

export type WorkflowablePermissionCreationType = Pick<
  WorkflowablePermissionInterface, 
  'businessId'|'permissionId'|'workflowId' 
>
