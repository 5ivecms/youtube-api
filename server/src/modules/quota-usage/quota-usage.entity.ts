import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('quota_usage')
export class QuotaUsageEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number

  @Column({ type: 'timestamptz' })
  public date: Date

  @Column({ type: 'int' })
  public currentUsage: number
}
