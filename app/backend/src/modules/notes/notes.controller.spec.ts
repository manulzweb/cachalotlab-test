import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotesController } from './notes.controller.js';
import { NotesService } from './notes.service.js';

describe('NotesController', () => {
  let controller: NotesController;
  let service: Partial<Record<keyof NotesService, ReturnType<typeof vi.fn>>>;

  beforeEach(async () => {
    service = {
      create: vi.fn(),
      findAllByContactId: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a note', async () => {
    const dto = { content: 'Test note', contactId: 1 };
    service.create!.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should find one note', async () => {
    service.findOne!.mockResolvedValue({ id: 1, content: 'Test note' });

    const result = await controller.findOne(1);
    expect(result).toEqual({ id: 1, content: 'Test note' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should remove a note', async () => {
    service.remove!.mockResolvedValue({ message: 'Nota #1 eliminada exitosamente' });

    const result = await controller.remove(1);
    expect(result).toEqual({ message: 'Nota #1 eliminada exitosamente' });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
