import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { values } from 'sequelize/types/lib/operators';
import { WorkflowRequestAction, WorkflowRequestInterface } from './IWorkflowRequest';

@Table({
  tableName: 'workflowRequest'
})
export class WorkflowRequest extends Model<WorkflowRequestInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: WorkflowRequestInterface['id'];

  @Column(DataType.STRING)
  userId: WorkflowRequestInterface['userId'];

  @Column(DataType.STRING)
  businessId: WorkflowRequestInterface['businessId'];

  @Column(DataType.STRING)
  businessUserRoleId: WorkflowRequestInterface['businessUserRoleId'];

  @Column(DataType.STRING)
  workflowId: WorkflowRequestInterface['workflowId'];

  @Column(DataType.STRING)
  permissionId: WorkflowRequestInterface['permissionId'];

  @Column(DataType.STRING)
  workflowableType: WorkflowRequestInterface['workflowableType'];

  @Column(DataType.STRING)
  workflowableId: WorkflowRequestInterface['workflowableId'];

  @Column(DataType.STRING)
  previousStep: WorkflowRequestInterface['previousStep'];

  @Column(DataType.STRING)
  nextStep: WorkflowRequestInterface['nextStep'];

  @Column(DataType.ENUM(...Object.values(WorkflowRequestAction)))
  action: WorkflowRequestInterface['action'];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: WorkflowRequestInterface['createdAt'];

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: WorkflowRequestInterface['updatedAt'];
}
