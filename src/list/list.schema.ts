import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ListDocument = List & Document;

@Schema({ timestamps: true })
export class List {
  @Prop({
    required: [true, 'O ID da lista é obrigatório'],
  })
  id: string;

  @Prop({
    required: [true, 'O nome da lista é obrigatório'],
    maxlength: [200, 'O nome pode ter no máximo 200 caracteres'],
  })
  name: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  closed: boolean;

  @Prop({
    type: String,
    default: null,
  })
  color?: string | null;

  @Prop({
    type: String,
    default: null,
  })
  creation_method?: string | null;

  @Prop({
    type: Object,
    default: { filter: false },
  })
  datasource: {
    filter: boolean;
  };

  @Prop({ required: true, type: Types.ObjectId, ref: 'Board' })
  id_board: Types.ObjectId;

  @Prop({
    type: Object,
    default: {
      cards: {
        open_per_list: {
          status: 'ok',
          disable_at: 5000,
          warn_at: 4000,
        },
        total_per_list: {
          status: 'ok',
          disable_at: 1000000,
          warn_at: 800000,
        },
      },
    },
  })
  limits: {
    cards: {
      open_per_list: {
        status: string;
        disable_at: number;
        warn_at: number;
      };
      total_per_list: {
        status: string;
        disable_at: number;
        warn_at: number;
      };
    };
  };

  @Prop({
    type: Number,
    default: 0,
  })
  pos: number;

  @Prop({
    type: Number,
    default: null,
  })
  soft_limit?: number | null;

  @Prop({
    type: Boolean,
    default: false,
  })
  subscribed: boolean;

  @Prop({
    type: String,
    default: null,
  })
  type?: string | null;
}

export const ListSchema = SchemaFactory.createForClass(List);
