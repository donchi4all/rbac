import { 
  Model,
  Table,
  Column,
  DataType, 
  AllowNull,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement
} from 'sequelize-typescript';
import { StringsFormating as Str} from '../../../utils';
import { WorkflowCreationType, WorkflowInterface } from './IWorkflow';

@Table({
  tableName: 'workflow'
})
export class Workflow extends Model<WorkflowInterface, WorkflowCreationType> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: WorkflowInterface['id'];

  @Column(DataType.STRING)
  businessId: WorkflowInterface['businessId'];

  @Column(DataType.STRING)
  title: WorkflowInterface['title'];

  @Column({
    type: DataType.STRING,
    set (value: string): void {
      this.setDataValue('slug', Str.toSlugCase(value));
    }
  })
  slug: WorkflowInterface['slug'];

  @AllowNull
  @Column(DataType.STRING)
  description: WorkflowInterface['description'];

  @Column(DataType.STRING)
  process: WorkflowInterface['process'];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: WorkflowInterface['createdAt'];

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: WorkflowInterface['updatedAt'];
}
