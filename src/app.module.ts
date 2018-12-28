import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TodoModule } from './todo/todo.module'

@Module({
  imports: [TodoModule, AuthModule],
})
export class AppModule {}
