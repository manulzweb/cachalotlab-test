import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContactsService } from './contacts.service.js';
import { ContactDao } from './dao/contact.dao.js';
import { NotFoundException } from '@nestjs/common';

describe('ContactsService', () => {
  let service: ContactsService;
  let contactDao: Partial<Record<keyof ContactDao, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    contactDao = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: ContactDao,
          useValue: contactDao,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a contact', async () => {
    const dto = {
      name: 'Manuel Zapata',
      email: 'manuel@example.com',
      phone: '+573001234567',
      company: 'Cachalot Lab',
    };
    const dbEntity = {
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    contactDao.create!.mockResolvedValue(dbEntity as any);

    const result = await service.create(dto);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('Manuel Zapata');
    expect(result.company).toEqual('Cachalot Lab');
    expect(contactDao.create).toHaveBeenCalledWith({
      name: 'Manuel Zapata',
      email: 'manuel@example.com',
      phone: '+573001234567',
      company: 'Cachalot Lab',
    });
  });

  it('should find all contacts with query', async () => {
    const contacts = [
      {
        id: 1,
        name: 'Manuel Zapata',
        email: 'manuel@example.com',
        phone: '+573001234567',
        company: 'Cachalot Lab',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const query = { name: 'Manuel' };
    contactDao.findAll!.mockResolvedValue(contacts as any);

    const result = await service.findAll(query);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Manuel Zapata');
    expect(contactDao.findAll).toHaveBeenCalledWith(query);
  });

  it('should find one contact by id', async () => {
    const contact = {
      id: 1,
      name: 'Manuel Zapata',
      email: 'manuel@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    contactDao.findOne!.mockResolvedValue(contact as any);

    const result = await service.findOne(1);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Manuel Zapata');
  });

  it('should throw NotFoundException if contact not found', async () => {
    contactDao.findOne!.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a contact', async () => {
    const updateDto = { name: 'Manuel Modificado' };
    const updatedEntity = {
      id: 1,
      name: 'Manuel Modificado',
      email: 'manuel@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    contactDao.update!.mockResolvedValue(updatedEntity as any);

    const result = await service.update(1, updateDto);
    expect(result.name).toBe('Manuel Modificado');
    expect(contactDao.update).toHaveBeenCalledWith(1, { name: 'Manuel Modificado' });
  });

  it('should delete a contact', async () => {
    contactDao.delete!.mockResolvedValue(true);

    const result = await service.remove(1);
    expect(result).toEqual({ message: 'Contacto #1 eliminado exitosamente' });
    expect(contactDao.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException on delete if contact not found', async () => {
    contactDao.delete!.mockResolvedValue(false);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
