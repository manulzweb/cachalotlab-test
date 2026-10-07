import { DeepPartial } from 'typeorm';
import { Note } from '../entities/note.entity.js';
import { CreateNoteDto } from '../dto/create-note.dto.js';
import { NoteResponseDto } from '../dto/note-response.dto.js';

export class NoteMapper {
  static toEntity(dto: CreateNoteDto, contactId?: number): DeepPartial<Note> {
    const finalContactId = dto.contactId || contactId;
    return {
      content: dto.content,
      contact: finalContactId ? ({ id: finalContactId } as any) : undefined,
    };
  }

  static toResponseDto(entity: Note): NoteResponseDto {
    return {
      id: entity.id,
      content: entity.content,
      contactId: entity.contact ? entity.contact.id : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseDtoList(entities: Note[]): NoteResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
