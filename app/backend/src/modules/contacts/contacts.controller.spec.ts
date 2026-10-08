import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContactsController } from './contacts.controller.js';
import { ContactsService } from './contacts.service.js';

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: Partial<Record<keyof ContactsService, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      addNote: vi.fn(),
      getNotes: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create on service', async () => {
    const dto = {
      name: 'Manuel',
      email: 'manuel@example.com',
      company: 'Cachalot Lab',
    };
    service.create!.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll on service', async () => {
    const query = { name: 'Manuel' };
    service.findAll!.mockResolvedValue([]);

    const result = await controller.findAll(query);
    expect(result).toEqual([]);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should call findOne on service', async () => {
    service.findOne!.mockResolvedValue({ id: 1, name: 'Manuel' });

    const result = await controller.findOne(1);
    expect(result).toEqual({ id: 1, name: 'Manuel' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call addNote on service', async () => {
    const dto = { content: 'Nueva nota' };
    service.addNote!.mockResolvedValue({ id: 1, content: 'Nueva nota' });

    const result = await controller.addNote(1, dto);
    expect(result).toEqual({ id: 1, content: 'Nueva nota' });
    expect(service.addNote).toHaveBeenCalledWith(1, dto);
  });

  it('should call getNotes on service', async () => {
    service.getNotes!.mockResolvedValue([{ id: 1, content: 'Nota de contacto' }]);

    const result = await controller.getNotes(1);
    expect(result).toEqual([{ id: 1, content: 'Nota de contacto' }]);
    expect(service.getNotes).toHaveBeenCalledWith(1);
  });
});
