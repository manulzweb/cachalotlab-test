import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteDao } from './dao/note.dao.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';
import { NoteResponseDto } from './dto/note-response.dto.js';
import { NoteMapper } from './mapper/note.mapper.js';

@Injectable()
export class NotesService {
  constructor(private readonly noteDao: NoteDao) {}

  async create(createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    const noteEntity = NoteMapper.toPersistence(createNoteDto);
    const created = await this.noteDao.create(noteEntity);
    return NoteMapper.toResponseDto(created);
  }

  async findAllByContactId(contactId: number): Promise<NoteResponseDto[]> {
    const notes = await this.noteDao.findAllByContactId(contactId);
    return notes.map((note) => NoteMapper.toResponseDto(note));
  }

  async findOne(id: number): Promise<NoteResponseDto> {
    const note = await this.noteDao.findOne(id);
    if (!note) {
      throw new NotFoundException(`Nota con ID #${id} no encontrada`);
    }
    return NoteMapper.toResponseDto(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<NoteResponseDto> {
    await this.findOne(id);
    const updateData = NoteMapper.toUpdatePersistence(updateNoteDto);
    const updated = await this.noteDao.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`Nota con ID #${id} no encontrada`);
    }
    return NoteMapper.toResponseDto(updated);
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.noteDao.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Nota con ID #${id} no encontrada`);
    }
    return { message: `Nota #${id} eliminada exitosamente` };
  }
}
