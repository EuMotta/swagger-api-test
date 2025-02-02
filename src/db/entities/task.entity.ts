import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
    description: 'ID único gerado automaticamente para a task',
  })
  id?: string;

  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'Compras', description: 'Título da task' })
  title: string;

  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'Comprar frutas no mercado', description: 'Descrição detalhada da task' })
  description: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    example: 'Pendente',
    description: 'Status da task (e.g., Pendente, Em andamento, Concluído)',
  })
  status: string;

  @Column({ type: 'timestamptz', name: 'expiration_date' })
  @ApiProperty({
    example: '2025-12-31T23:59:59.000Z',
    description: 'Data e hora de expiração da task no formato ISO',
  })
  expirationDate: Date;
}
