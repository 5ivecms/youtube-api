import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProxyEntity } from '../proxy/proxy.entity'

@Entity('youtube-apikey')
export class YoutubeApikey {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Column({ type: 'varchar', nullable: false })
  public apikey: string

  @Column({ type: 'int', default: 0 })
  public currentUsage: number

  @Column({ type: 'int', default: 10000 })
  public dailyLimit?: number

  @Column({ type: 'varchar', default: '' })
  public error: string

  @Column({ type: 'boolean', default: true })
  public isActive: boolean

  @Column({ type: 'varchar', default: '' })
  public comment?: string

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date

  @ManyToMany(() => ProxyEntity)
  @JoinTable()
  public proxies: ProxyEntity[]
}
