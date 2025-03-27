import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({
    required: [true, 'Por favor, insira o título da tarefa'],
    maxlength: [200, 'O título pode ter no máximo 200 caracteres'],
  })
  title: string;

  @Prop({
    required: [true, 'Por favor, associe a tarefa a uma lista'],
  })
  list_id: string;

  @Prop({
    default: '',
    maxlength: [500, 'A descrição pode ter no máximo 500 caracteres'],
  })
  description?: string;

  @Prop({
    type: [
      {
        name: {
          type: String,
          required: [true, 'Cada subtarefa deve ter um nome'],
        },
      },
    ],
    default: [],
  })
  tasks: { name: string }[];

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
