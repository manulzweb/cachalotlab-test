import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity.js';
import {
  CreateNotePersistence,
  UpdateNotePersistence,
} from '../interfaces/note-persistence.interface.js';

@Injectable()
export class NoteDao {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
  ) {}

  async create(note: CreateNotePersistence): Promise<Note> {
    const newNote = this.repository.create(note);
    return this.repository.save(newNote);
  }

  async findAllByContactId(contactId: number): Promise<Note[]> {
    return this.repository.find({
      where: { contact: { id: contactId } },
      relations: { contact: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Note | null> {
    return this.repository.findOne({
      where: { id },
      relations: { contact: true },
    });
  }

  async update(id: number, note: UpdateNotePersistence): Promise<Note | null> {
    await this.repository.update(id, note);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const { affected } = await this.repository.softDelete(id);
    return Boolean(affected);
  }
}
