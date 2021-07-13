import { Table, AutoIncrement, PrimaryKey, Column, Model, DataType } from 'sequelize-typescript';
import { PlatformInterface } from './IPlatform';

@Table({
  tableName: 'platform',
  createdAt: false,
  updatedAt: false,
})
export class Platform extends Model<PlatformInterface> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING(255),
    defaultValue: '',
  })
  name: string;
}
