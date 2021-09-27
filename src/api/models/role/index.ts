import {
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DataType, BelongsTo, HasMany, BelongsToMany
} from 'sequelize-typescript';
import { StringsFormating as Str} from '../../../utils';
import { RoleInterface, RoleCreationType } from './IRole';
import {Business, Permission, RolePermission} from '../index';

@Table({
  tableName: 'role',
})
export class Role extends Model<RoleInterface, RoleCreationType> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;


  @BelongsTo(() => Business, {
    foreignKey: 'businessId',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  business: Business;

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions: Permission[]

  
  @Column(DataType.STRING)
  title: RoleInterface['title'];

  @Column({
    type: DataType.STRING,
        set (value: string): void {
      this.setDataValue('slug', Str.toSlugCase(value));
    }
  })
  slug: RoleInterface['slug'];

  @AllowNull
  @Column(DataType.STRING)
  description?: RoleInterface['description'];

  @Column(DataType.STRING)
  isActive: RoleInterface['isActive'];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: RoleInterface['createdAt'];

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: RoleInterface['updatedAt'];
}