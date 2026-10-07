import { Note } from '../entities/note.entity.js';
import { CreateNoteDto } from '../dto/create-note.dto.js';
import { NoteResponseDto } from '../dto/note-response.dto.js';
import { DeepPartial } from 'typeorm';

export class NoteMapper {
  static toEntity(dto: CreateNoteDto): DeepPartial<Note> {
    return {
      content: dto.content,
      contact: { id: dto.contactId },
    };
  }

  static toResponseDto(entity: Note): NoteResponseDto {
    return {
      id: entity.id,
      content: entity.content,
      contactId: entity.contact?.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
