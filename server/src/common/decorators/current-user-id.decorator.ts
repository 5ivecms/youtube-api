import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export const CurrentUserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  const jwtService = new JwtService({ secret: process.env.JWT_ACCESS_SECRET })
  const token = request.headers.authorization.split(' ')[1]
  const decoded = jwtService.verify(token)

  return decoded.sub
})
