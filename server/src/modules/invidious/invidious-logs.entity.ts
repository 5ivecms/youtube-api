import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { InvidiousEntity } from './invidious.entity'

@Entity('invidious_logs')
export class InvidiousLogsEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Column({ type: 'varchar' })
  public readonly message: string

  @Column({ type: 'bigint' })
  public readonly invidiousId: number

  @ManyToOne(() => InvidiousEntity, (invidious) => invidious.logs, { onDelete: 'CASCADE' })
  public invidious: InvidiousEntity

  @CreateDateColumn()
  public readonly createdAt: Date
}
