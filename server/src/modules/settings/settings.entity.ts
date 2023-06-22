import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { SettingsEnum } from './settings.types'

@Entity('settings')
export class SettingsEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Column({ type: 'varchar', length: 50 })
  public readonly option: string

  @Column({ type: 'text', default: '' })
  public readonly value: string

  @Column({ type: 'varchar', length: 255 })
  public readonly label: string

  @Column({ type: 'varchar', length: 100 })
  public readonly section: string

  @Column({ type: 'enum', enum: SettingsEnum })
  public readonly type: SettingsEnum
}
