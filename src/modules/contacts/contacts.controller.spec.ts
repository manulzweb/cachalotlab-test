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

  it('should call update on service', async () => {
    const updateDto = { name: 'Manuel Updated' };
    service.update!.mockResolvedValue({ id: 1, name: 'Manuel Updated' });

    const result = await controller.update(1, updateDto);
    expect(result).toEqual({ id: 1, name: 'Manuel Updated' });
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('should call remove on service', async () => {
    service.remove!.mockResolvedValue({ message: 'Contacto #1 eliminado exitosamente' });

    const result = await controller.remove(1);
    expect(result).toEqual({ message: 'Contacto #1 eliminado exitosamente' });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
