import { 
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt, 
  AllowNull
} from 'sequelize-typescript';
import { WorkflowInterface } from './IWorkflow';
import { StringsFormating as Str} from '../../../utils';

@Table({
  tableName: 'workflow'
})
export class Workflow extends Model<WorkflowInterface> {
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
