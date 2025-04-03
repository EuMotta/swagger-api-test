import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true })
export class Board {
  @Prop({
    required: [true, 'O nome do quadro é obrigatório'],
    maxlength: [200, 'O nome pode ter no máximo 200 caracteres'],
  })
  name: string;

  @Prop({
    type: String,
    default: null,
    maxlength: [500, 'A descrição pode ter no máximo 500 caracteres'],
  })
  description?: string;

  @Prop({
    type: [String],
    default: [],
  })
  members: string[];

  @Prop({
    type: String,
    default: null,
    unique: true,
    index: true,
    maxlength: [100, 'O short_link pode ter no máximo 100 caracteres'],
  })
  short_link?: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  archived: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_private: boolean;

  @Prop({
    type: String,
    required: [true, 'O ID do dono do board é obrigatório'],
  })
  owner_id: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
