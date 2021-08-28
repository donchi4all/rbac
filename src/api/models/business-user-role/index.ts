import {
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  DataType,
  UpdatedAt,
  CreatedAt,
  BelongsTo, HasMany, ForeignKey, AllowNull
} from 'sequelize-typescript';
import { BusinessUserRoleInterface, BusinessUserRoleStatus } from './IBusinessUserRole';
import {Business} from '../business';
import {Role} from '../role';

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

  @BelongsTo(() => Business, {
    foreignKey: 'businessId',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  business: Business;


  @HasMany(() => Role, {
    sourceKey: 'businessId',
    foreignKey: 'businessId',
  })
  roles: Role[];


  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Business)
  businessId: BusinessUserRoleInterface['businessId'];

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Role)
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
