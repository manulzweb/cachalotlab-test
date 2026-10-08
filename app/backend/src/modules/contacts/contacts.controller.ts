import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';
import { QueryContactDto } from './dto/query-contact.dto.js';
import { AddContactNoteDto } from './dto/add-contact-note.dto.js';
import { ContactResponseDto } from './dto/contact-response.dto.js';
import { NoteResponseDto } from '../notes/dto/note-response.dto.js';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo contacto',
    description: 'Registra un contacto en el CRM validando que el correo electrónico sea único.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Contacto creado exitosamente.',
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o faltantes.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El correo electrónico ya se encuentra registrado.',
  })
  create(@Body() createContactDto: CreateContactDto): Promise<ContactResponseDto> {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar contactos',
    description: 'Obtiene todos los contactos activos, permitiendo filtrar por nombre o empresa.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de contactos recuperada exitosamente.',
    type: [ContactResponseDto],
  })
  findAll(@Query() query: QueryContactDto): Promise<ContactResponseDto[]> {
    return this.contactsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un contacto por ID',
    description: 'Devuelve la información detallada de un contacto junto con sus notas asociadas.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico del contacto', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contacto encontrado exitosamente.',
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contacto no encontrado.',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ContactResponseDto> {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar parcialmente un contacto',
    description: 'Modifica los datos de un contacto existente asegurando que el nuevo correo no esté duplicado.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico del contacto', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contacto actualizado exitosamente.',
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contacto no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El nuevo correo ya está en uso por otro contacto.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un contacto (Soft Delete)',
    description: 'Marca el contacto como eliminado en el sistema sin borrar físicamente los registros.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico del contacto', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contacto eliminado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Contacto #1 eliminado exitosamente' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contacto no encontrado.',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.contactsService.remove(id);
  }

  @Post(':id/notes')
  @ApiOperation({
    summary: 'Agregar una nota a un contacto',
    description: 'Crea y asocia una nota directamente al contacto especificado por su ID.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico del contacto', example: 1 })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Nota agregada al contacto exitosamente.',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contacto no encontrado.',
  })
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() addContactNoteDto: AddContactNoteDto,
  ): Promise<NoteResponseDto> {
    return this.contactsService.addNote(id, addContactNoteDto);
  }

  @Get(':id/notes')
  @ApiOperation({
    summary: 'Listar notas de un contacto',
    description: 'Obtiene el historial cronológico de todas las notas vinculadas a un contacto.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico del contacto', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de notas del contacto.',
    type: [NoteResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contacto no encontrado.',
  })
  getNotes(@Param('id', ParseIntPipe) id: number): Promise<NoteResponseDto[]> {
    return this.contactsService.getNotes(id);
  }
}
