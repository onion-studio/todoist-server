import { ApiModelProperty } from '@nestjs/swagger'
import Todo from './entities/Todo.entity'

export class NewTodoPayload implements Pick<Todo, 'title'> {
  @ApiModelProperty({
    description: '할 일 제목',
  })
  readonly title: string
}
