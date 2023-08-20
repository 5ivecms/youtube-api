import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('video_blacklist')
export class VideoBlacklistEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public readonly id: number

  @Index()
  @Column({ type: 'varchar', nullable: false })
  public readonly videoId: string
}
