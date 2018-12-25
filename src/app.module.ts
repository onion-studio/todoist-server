import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { TodoModule } from './todo/todo.module'

@Module({
  imports: [TypeOrmModule.forRoot(), TodoModule, AuthModule],
})
export class AppModule {}
