import { ApiModelProperty } from '@nestjs/swagger'

import Project from '../entity/Project'
import Todo from '../entity/Todo'

export class NewTodoPayload implements Pick<Todo, 'title'> {
  @ApiModelProperty({
    description: '할 일 제목',
    example: '할 일 제목',
  })
  readonly title: string
}

export class UpdateTodosOrderItem implements Pick<Todo, 'id' | 'order'> {
  @ApiModelProperty({
    description: 'ID',
    example: 1,
  })
  readonly id: number

  @ApiModelProperty({
    description: '순서',
    example: 1,
  })
  readonly order: number
}

export class UpdateTodosOrderPayload {
  @ApiModelProperty({
    description: '각 할 일의 순서를 나타내는 객체를 담고 있는 배열',
    example: [{ id: 10, order: 1 }, { id: 11, order: 2 }],
    type: [UpdateTodosOrderItem],
  })
  orderList: UpdateTodosOrderItem[]
}

export class NewProjectPayload implements Pick<Project, 'title'> {
  @ApiModelProperty({
    description: '프로젝트 제목',
    example: '프로젝트 제목',
  })
  readonly title: string
}

export class TodoPayload implements Pick<Todo, 'title' | 'id'> {
  @ApiModelProperty({
    description: 'ID',
    example: 1,
  })
  readonly id: number

  @ApiModelProperty({
    description: '제목',
    example: '할 일 제목',
  })
  readonly title: string
}

export class ProjectPayload implements Pick<Project, 'id' | 'title'> {
  @ApiModelProperty({
    description: 'ID',
    example: 1,
  })
  readonly id: number

  @ApiModelProperty({
    description: '제목',
    example: '프로젝트 제목',
  })
  readonly title: string
}
