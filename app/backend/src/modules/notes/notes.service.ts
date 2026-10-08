import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteDao } from './dao/note.dao.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { NoteResponseDto } from './dto/note-response.dto.js';
import { NoteMapper } from './mapper/note.mapper.js';
import { Contact } from '../contacts/entities/contact.entity.js';

@Injectable()
export class NotesService {
  constructor(
    private readonly noteDao: NoteDao,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    const contact = await this.contactRepository.findOne({
      where: { id: createNoteDto.contactId },
    });
    if (!contact) {
      throw new NotFoundException(`Contacto con ID #${createNoteDto.contactId} no encontrado`);
    }

    const noteEntity = NoteMapper.toEntity(createNoteDto);
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

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.noteDao.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Nota con ID #${id} no encontrada`);
    }
    return { message: `Nota #${id} eliminada exitosamente` };
  }
}
