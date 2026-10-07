import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';
import { QueryContactDto } from './dto/query-contact.dto.js';
import { ContactResponseDto } from './dto/contact-response.dto.js';
import { ContactDao } from './dao/contact.dao.js';
import { ContactMapper } from './mapper/contact.mapper.js';

@Injectable()
export class ContactsService {
  constructor(private readonly contactDao: ContactDao) {}

  async create(createContactDto: CreateContactDto): Promise<ContactResponseDto> {
    const contactData = ContactMapper.toEntity(createContactDto);
    const created = await this.contactDao.create(contactData);
    return ContactMapper.toResponseDto(created);
  }

  async findAll(query?: QueryContactDto): Promise<ContactResponseDto[]> {
    const contacts = await this.contactDao.findAll(query);
    return ContactMapper.toResponseDtoList(contacts);
  }

  async findOne(id: number): Promise<ContactResponseDto> {
    const contact = await this.contactDao.findOne(id);
    if (!contact) {
      throw new NotFoundException(`Contacto con ID #${id} no encontrado`);
    }
    return ContactMapper.toResponseDto(contact);
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<ContactResponseDto> {
    const updateData = ContactMapper.toUpdateEntity(updateContactDto);
    const updated = await this.contactDao.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`Contacto con ID #${id} no encontrado`);
    }
    return ContactMapper.toResponseDto(updated);
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.contactDao.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Contacto con ID #${id} no encontrado`);
    }
    return { message: `Contacto #${id} eliminado exitosamente` };
  }
}
