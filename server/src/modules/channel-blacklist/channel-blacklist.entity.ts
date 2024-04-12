import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('channel_blacklist')
export class ChannelBlacklistEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Index()
  @Column({ type: 'varchar', nullable: false })
  public readonly channelId: string

  @Column({ default: '' })
  public readonly reason: string

  @CreateDateColumn()
  public createdAt: Date
}
