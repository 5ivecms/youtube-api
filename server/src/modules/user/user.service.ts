import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserDto, UpdateUserDto } from './dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public create(dto: CreateUserDto): Promise<User> {
    try {
      return this.userRepository.save(dto)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public findAll(): Promise<User[]> {
    try {
      return this.userRepository.find()
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async profile(id: number) {
    const user = await this.userRepository.findOneBy({ id })
    const { password, refreshToken, ...userFields } = user
    return userFields
  }

  public findOne(id: number): Promise<User> {
    try {
      return this.userRepository.findOneBy({ id })
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email })
  }

  public async findById(id: number) {
    return this.userRepository.findOneBy({ id })
  }

  public update(id: number, dto: UpdateUserDto) {
    try {
      return this.userRepository.update(id, dto)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  public remove(id: number) {
    try {
      return this.userRepository.delete(id)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}
