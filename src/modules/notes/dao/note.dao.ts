import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Note } from '../entities/note.entity.js';

@Injectable()
export class NoteDao {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
  ) {}

  async create(note: DeepPartial<Note>): Promise<Note> {
    const newNote = this.repository.create(note);
    return this.repository.save(newNote);
  }

  async findAllByContactId(contactId: number): Promise<Note[]> {
    return this.repository.find({
      where: { contact: { id: contactId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Note | null> {
    return this.repository.findOne({
      where: { id },
      relations: { contact: true },
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
