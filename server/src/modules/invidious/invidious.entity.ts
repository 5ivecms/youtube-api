import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { InvidiousLogsEntity } from './invidious-logs.entity'

@Entity('invidious')
export class InvidiousEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public readonly id: number

  @Column({ type: 'varchar', nullable: false })
  public readonly host: string

  @Index()
  @Column({ type: 'boolean', default: true })
  public readonly isActive: boolean

  @Index()
  @Column({ type: 'boolean', default: true })
  public readonly isWorkable: boolean

  @Index()
  @Column({ type: 'boolean', default: true })
  public readonly useRandomUseragent: boolean

  @Index()
  @Column({ type: 'boolean', default: true })
  public readonly useProxy: boolean

  @Column({ type: 'int', default: 0 })
  public readonly pingMin: number

  @Column({ type: 'int', default: 0 })
  public readonly pingMax: number

  @Column({ type: 'int', default: 0 })
  public readonly pingAvg: number

  @Index()
  @Column({ type: 'int', default: 0 })
  public readonly index: number

  @Column({ type: 'varchar', default: '' })
  public readonly comment?: string

  @OneToMany(() => InvidiousLogsEntity, (logs) => logs.invidious, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  public readonly logs: InvidiousLogsEntity[]
}
