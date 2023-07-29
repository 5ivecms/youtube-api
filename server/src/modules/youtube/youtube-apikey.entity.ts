import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('youtube-apikey')
export class YoutubeApikey {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Column({ type: 'varchar', nullable: false })
  public readonly apikey: string

  @Column({ type: 'int', default: 0 })
  public readonly currentUsage: number

  @Column({ type: 'int', default: 10000 })
  public readonly dailyLimit?: number

  @Column({ type: 'varchar', default: '' })
  public readonly error: string

  @Column({ type: 'boolean', default: true })
  public readonly isActive: boolean

  @Column({ type: 'varchar', default: '' })
  public readonly comment?: string
}
