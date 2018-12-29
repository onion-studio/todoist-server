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
