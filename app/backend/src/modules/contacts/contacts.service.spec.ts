import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContactsService } from './contacts.service.js';
import { ContactDao } from './dao/contact.dao.js';
import { NotesService } from '../notes/notes.service.js';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ContactsService', () => {
  let service: ContactsService;
  let contactDao: Partial<Record<keyof ContactDao, ReturnType<typeof vi.fn>>>;
  let notesService: Partial<Record<keyof NotesService, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    contactDao = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    notesService = {
      create: vi.fn(),
      findAllByContactId: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: ContactDao,
          useValue: contactDao,
        },
        {
          provide: NotesService,
          useValue: notesService,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a contact when email is unique', async () => {
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
      notes: [],
    };
    contactDao.findByEmail!.mockResolvedValue(null);
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

  it('should throw ConflictException when creating contact with duplicate email', async () => {
    const dto = {
      name: 'Manuel Zapata',
      email: 'duplicado@example.com',
    };
    contactDao.findByEmail!.mockResolvedValue({ id: 2, email: 'duplicado@example.com' } as any);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
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
        notes: [],
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
      notes: [],
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
    const existing = {
      id: 1,
      name: 'Manuel',
      email: 'manuel@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: [],
    };
    const updateDto = { name: 'Manuel Modificado' };
    const updatedEntity = {
      ...existing,
      name: 'Manuel Modificado',
    };
    contactDao.findOne!.mockResolvedValue(existing as any);
    contactDao.update!.mockResolvedValue(updatedEntity as any);

    const result = await service.update(1, updateDto);
    expect(result.name).toBe('Manuel Modificado');
    expect(contactDao.update).toHaveBeenCalledWith(1, { name: 'Manuel Modificado' });
  });

  it('should throw ConflictException if update uses email of another contact', async () => {
    const existing = {
      id: 1,
      name: 'Manuel',
      email: 'manuel@example.com',
    };
    contactDao.findOne!.mockResolvedValue(existing as any);
    contactDao.findByEmail!.mockResolvedValue({ id: 2, email: 'otro@example.com' } as any);

    await expect(
      service.update(1, { email: 'otro@example.com' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should delete a contact', async () => {
    contactDao.delete!.mockResolvedValue(true);

    const result = await service.remove(1);
    expect(result).toEqual({ message: 'Contacto #1 eliminado exitosamente' });
    expect(contactDao.delete).toHaveBeenCalledWith(1);
  });

  it('should add a note to a contact', async () => {
    const contact = { id: 1, name: 'Manuel', email: 'manuel@example.com', notes: [] };
    const noteResponse = {
      id: 10,
      content: 'Llamada de seguimiento',
      contactId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    contactDao.findOne!.mockResolvedValue(contact as any);
    notesService.create!.mockResolvedValue(noteResponse as any);

    const result = await service.addNote(1, { content: 'Llamada de seguimiento' });
    expect(result.id).toBe(10);
    expect(result.content).toBe('Llamada de seguimiento');
    expect(notesService.create).toHaveBeenCalledWith({
      contactId: 1,
      content: 'Llamada de seguimiento',
    });
  });

  it('should get notes of a contact', async () => {
    const contact = { id: 1, name: 'Manuel', email: 'manuel@example.com', notes: [] };
    const notes = [
      {
        id: 10,
        content: 'Llamada de seguimiento',
        contactId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    contactDao.findOne!.mockResolvedValue(contact as any);
    notesService.findAllByContactId!.mockResolvedValue(notes as any);

    const result = await service.getNotes(1);
    expect(result.length).toBe(1);
    expect(result[0].content).toBe('Llamada de seguimiento');
    expect(notesService.findAllByContactId).toHaveBeenCalledWith(1);
  });
});
