import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Tipo do documento de uma Tarefa no MongoDB.
 */
export type TaskDocument = Task & Document;

/**
 * @class Task
 *
 * Representa a entidade de uma Tarefa dentro do MongoDB.
 * Contém informações sobre título, lista associada, subtarefas,
 * status de conclusão, datas e outros atributos.
 */
@Schema({ timestamps: true })
export class Task {
  @Prop({
    required: [true, 'Por favor, insira o título da tarefa'],
    maxlength: [200, 'O título pode ter no máximo 200 caracteres'],
  })
  title: string;

  @Prop({
    required: [true, 'Por favor, associe a tarefa a uma lista'],
    type: Types.ObjectId,
    ref: 'List',
  })
  list_id: Types.ObjectId;

  @Prop({
    required: [true, 'Por favor, associe a tarefa a um quadro'],
    type: Types.ObjectId,
    ref: 'Board',
  })
  board_id: Types.ObjectId;

  @Prop({
    default: '',
    maxlength: [500, 'A descrição pode ter no máximo 500 caracteres'],
  })
  description?: string;

  @Prop({
    required: [true, 'Por favor, associe a tarefa a uma lista'],
    type: Types.ObjectId,
    ref: 'SubTask',
  })
  sub_tasks: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_completed: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  start_date?: Date;

  @Prop({
    type: [String],
    default: [],
  })
  labels: string[];

  @Prop({
    type: Date,
    default: null,
  })
  due_reminder?: Date;

  @Prop({
    type: [String],
    default: [],
  })
  users_reminder: string[];

  @Prop({
    type: String,
    default: null,
    maxlength: [100, 'O short_link pode ter no máximo 100 caracteres'],
  })
  short_link?: string;

  @Prop({
    type: String,
    default: null,
    maxlength: [255, 'O short_url pode ter no máximo 255 caracteres'],
  })
  short_url?: string;

  @Prop({
    type: Date,
    default: null,
  })
  due_date?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

/**
 * Regra para deletar todas as subtasks
 */
TaskSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const taskId = this._id;
    const subTaskModel = this.model('SubTask');

    await subTaskModel.deleteMany({ task_id: taskId });

    next();
  },
);
