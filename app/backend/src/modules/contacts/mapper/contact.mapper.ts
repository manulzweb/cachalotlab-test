import { Contact } from '../entities/contact.entity.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';
import { UpdateContactDto } from '../dto/update-contact.dto.js';
import { ContactResponseDto } from '../dto/contact-response.dto.js';
import {
  CreateContactPersistence,
  UpdateContactPersistence,
} from '../interfaces/contact-persistence.interface.js';

export class ContactMapper {
  static toPersistence(dto: CreateContactDto): CreateContactPersistence {
    return { ...dto };
  }

  static toUpdatePersistence(dto: UpdateContactDto): UpdateContactPersistence {
    return { ...dto };
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
}
