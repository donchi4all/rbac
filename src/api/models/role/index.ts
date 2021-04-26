import { Table, AutoIncrement, PrimaryKey, Default, Column, Model, AllowNull, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';
import { RoleInterface, RoleCreationType } from './IRole';

@Table({
  tableName: 'role',
})
export class Role extends Model<RoleInterface, RoleCreationType> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @Column({
    type: DataType.STRING(255),
    defaultValue: '',
  })
  description: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  active: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;
}