import {
  Table,
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  DataType,
  UpdatedAt,
  CreatedAt,
  AllowNull,
  Default,
  Unique,
  BelongsTo, HasMany,
} from 'sequelize-typescript';
import { BusinessInterface } from './IBusiness';
import { StringsFormating as Str } from '../../../utils';
import { Platform } from '../platform';
import {BusinessUserRole, Role} from '../index';

@Table({
  tableName: 'business',
})
export class Business extends Model<BusinessInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: BusinessInterface['id'];

  @Column(DataType.INTEGER)
  platformId: BusinessInterface['platformId'];

  @Column(DataType.STRING)
  name: BusinessInterface['name'];

  @Unique
  @Column({
    type: DataType.STRING,
    set(value: string): void {
      this.setDataValue('slug', Str.toSlugCase(value));
    },
  })
  slug: BusinessInterface['slug'];

  @BelongsTo(() => Platform, {
    foreignKey: 'platformId',
    foreignKeyConstraint: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  platform: Platform;


  @HasMany(() => BusinessUserRole)
  businessUsers: BusinessUserRole[];

  @AllowNull
  @Column(DataType.STRING)
  description: BusinessInterface['description'];

  @Default(false)
  @Column(DataType.BOOLEAN)
  isActive?: BusinessInterface['isActive'];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: BusinessInterface['createdAt'];

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: BusinessInterface['updatedAt'];
}
