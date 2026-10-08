import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity.js';
import { QueryContactDto } from '../dto/query-contact.dto.js';
import {
  CreateContactPersistence,
  UpdateContactPersistence,
} from '../interfaces/contact-persistence.interface.js';

@Injectable()
export class ContactDao {
  constructor(
    @InjectRepository(Contact)
    private readonly repository: Repository<Contact>,
  ) {}

  async create(contact: CreateContactPersistence): Promise<Contact> {
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
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Contact | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Contact | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async update(id: number, contact: UpdateContactPersistence): Promise<Contact | null> {
    await this.repository.update(id, contact);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const { affected } = await this.repository.softDelete(id);
    return Boolean(affected);
  }
}
