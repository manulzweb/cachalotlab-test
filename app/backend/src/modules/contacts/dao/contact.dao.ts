import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity.js';
import { QueryContactDto } from '../dto/query-contact.dto.js';

@Injectable()
export class ContactDao {
  constructor(
    @InjectRepository(Contact)
    private readonly repository: Repository<Contact>,
  ) {}

  async create(contact: DeepPartial<Contact>): Promise<Contact> {
    const newContact = this.repository.create(contact);
    return this.repository.save(newContact);
  }

  async findAll(query?: QueryContactDto): Promise<Contact[]> {
    const where: FindOptionsWhere<Contact> = {};

    if (query?.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query?.company) {
      where.company = ILike(`%${query.company}%`);
    }

    return this.repository.find({
      where,
      relations: { notes: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Contact | null> {
    return this.repository.findOne({
      where: { id },
      relations: { notes: true },
    });
  }

  async findByEmail(email: string): Promise<Contact | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async update(id: number, contact: DeepPartial<Contact>): Promise<Contact | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }

    await this.repository.update(id, contact as any);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }
}
