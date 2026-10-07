import { DeepPartial } from 'typeorm';
import { Contact } from '../entities/contact.entity.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';
import { UpdateContactDto } from '../dto/update-contact.dto.js';
import { ContactResponseDto } from '../dto/contact-response.dto.js';

export class ContactMapper {
  static toEntity(dto: CreateContactDto): DeepPartial<Contact> {
    return {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
    };
  }

  static toUpdateEntity(dto: UpdateContactDto): DeepPartial<Contact> {
    const entity: DeepPartial<Contact> = {};
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.email !== undefined) entity.email = dto.email;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.company !== undefined) entity.company = dto.company;
    return entity;
  }

  static toResponseDto(entity: Contact): ContactResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      company: entity.company,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseDtoList(entities: Contact[]): ContactResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
