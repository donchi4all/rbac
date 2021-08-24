import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { BusinessUserRoleInterface, BusinessUserRoleStatus } from './IBusinessUserRole';

@Table({
  tableName: 'BusinessUserRole'
})
export class BusinessUserRole extends Model<BusinessUserRoleInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: BusinessUserRoleInterface['id'];

  @Column(DataType.STRING)
  userId: BusinessUserRoleInterface['userId'];

  @Column(DataType.STRING)
  businessId: BusinessUserRoleInterface['businessId'];

  @Column(DataType.INTEGER)
  roleId: BusinessUserRoleInterface['roleId'];

  @Column(DataType.ENUM(...Object.values(BusinessUserRoleStatus)))
  status: BusinessUserRoleInterface['status'];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: BusinessUserRoleInterface['createdAt'];


  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: BusinessUserRoleInterface['updatedAt'];
}
