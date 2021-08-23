import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType } from 'sequelize-typescript';
import { WorkflowablePermissionInterface } from './IWorkflowablePermission';

@Table({
  tableName: 'workflowablePermission',
  createdAt: false,
  updatedAt: false,
})
export class WorkflowablePermission extends Model<WorkflowablePermissionInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: WorkflowablePermissionInterface['id'];

  @Column(DataType.STRING)
  businessId: WorkflowablePermissionInterface['businessId'];

  @Column(DataType.INTEGER)
  permissionId: WorkflowablePermissionInterface['permissionId'];

  @Column(DataType.INTEGER)
  workflowId: WorkflowablePermissionInterface['workflowId'];
}
