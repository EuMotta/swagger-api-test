import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Tipo do documento de uma subtarefa no MongoDB.
 */

export type SubTaskDocument = SubTask & Document;

/**
 * @class SubTask
 *
 * Representa a subentidade de uma Tarefa dentro do MongoDB.
 * Contém informações sobre o que deve ser realizado na subtarefa,
 *
 */

@Schema({ timestamps: true })
export class SubTask {
  @Prop({
    required: [true, 'Por favor, insira o título da subtarefa'],
    maxlength: [200, 'O título pode ter no máximo 200 caracteres'],
  })
  title: string;

  @Prop({
    required: [true, 'Por favor, associe a subtarefa a uma tarefa'],
    type: Types.ObjectId,
    ref: 'Task',
  })
  task_id: Types.ObjectId;

  @Prop({
    default: '',
    maxlength: [500, 'A descrição pode ter no máximo 500 caracteres'],
  })
  description?: string;

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
    type: Date,
    default: null,
  })
  due_date?: Date;
}

/**
 * Esquema Mongoose para a entidade SubTask.
 */
export const SubTaskSchema = SchemaFactory.createForClass(SubTask);
