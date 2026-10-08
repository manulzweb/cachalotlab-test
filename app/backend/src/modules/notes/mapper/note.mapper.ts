import { Note } from '../entities/note.entity.js';
import { CreateNoteDto } from '../dto/create-note.dto.js';
import { UpdateNoteDto } from '../dto/update-note.dto.js';
import { NoteResponseDto } from '../dto/note-response.dto.js';
import {
  CreateNotePersistence,
  UpdateNotePersistence,
} from '../interfaces/note-persistence.interface.js';

export class NoteMapper {
  static toPersistence(dto: CreateNoteDto): CreateNotePersistence {
    return {
      content: dto.content,
      contact: { id: dto.contactId },
    };
  }

  static toUpdatePersistence(dto: UpdateNoteDto): UpdateNotePersistence {
    return { ...dto };
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
