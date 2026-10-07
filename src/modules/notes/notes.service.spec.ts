import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotesService } from './notes.service.js';
import { NoteDao } from './dao/note.dao.js';
import { NotFoundException } from '@nestjs/common';

describe('NotesService', () => {
  let service: NotesService;
  let noteDao: Partial<Record<keyof NoteDao, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    noteDao = {
      create: vi.fn(),
      findAllByContactId: vi.fn(),
      findOne: vi.fn(),
      delete: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: NoteDao,
          useValue: noteDao,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a note', async () => {
    const dto = { content: 'Llamada de seguimiento', contactId: 1 };
    const entity = {
      id: 5,
      content: 'Llamada de seguimiento',
      contact: { id: 1 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    noteDao.create!.mockResolvedValue(entity as any);

    const result = await service.create(dto);
    expect(result.id).toBe(5);
    expect(result.content).toBe('Llamada de seguimiento');
    expect(result.contactId).toBe(1);
  });

  it('should find all notes by contact id', async () => {
    const notes = [
      {
        id: 5,
        content: 'Llamada',
        contact: { id: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    noteDao.findAllByContactId!.mockResolvedValue(notes as any);

    const result = await service.findAllByContactId(1);
    expect(result.length).toBe(1);
    expect(result[0].content).toBe('Llamada');
    expect(noteDao.findAllByContactId).toHaveBeenCalledWith(1);
  });

  it('should find one note by id', async () => {
    const note = {
      id: 5,
      content: 'Llamada',
      contact: { id: 1 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    noteDao.findOne!.mockResolvedValue(note as any);

    const result = await service.findOne(5);
    expect(result.id).toBe(5);
  });

  it('should throw NotFoundException if note not found', async () => {
    noteDao.findOne!.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should delete a note', async () => {
    noteDao.delete!.mockResolvedValue(true);

    const result = await service.remove(5);
    expect(result).toEqual({ message: 'Nota #5 eliminada exitosamente' });
    expect(noteDao.delete).toHaveBeenCalledWith(5);
  });

  it('should throw NotFoundException when deleting non-existent note', async () => {
    noteDao.delete!.mockResolvedValue(false);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
