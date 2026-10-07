import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteDao } from './dao/note.dao.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { NoteResponseDto } from './dto/note-response.dto.js';
import { NoteMapper } from './mapper/note.mapper.js';

@Injectable()
export class NotesService {
  constructor(private readonly noteDao: NoteDao) {}

  async create(createNoteDto: CreateNoteDto, contactId?: number): Promise<NoteResponseDto> {
    const noteEntity = NoteMapper.toEntity(createNoteDto, contactId);
    const created = await this.noteDao.create(noteEntity);
    return NoteMapper.toResponseDto(created);
  }

  async findAllByContactId(contactId: number): Promise<NoteResponseDto[]> {
    const notes = await this.noteDao.findAllByContactId(contactId);
    return NoteMapper.toResponseDtoList(notes);
  }

  async findOne(id: number): Promise<NoteResponseDto> {
    const note = await this.noteDao.findOne(id);
    if (!note) {
      throw new NotFoundException(`Nota con ID #${id} no encontrada`);
    }
    return NoteMapper.toResponseDto(note);
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.noteDao.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Nota con ID #${id} no encontrada`);
    }
    return { message: `Nota #${id} eliminada exitosamente` };
  }
}
