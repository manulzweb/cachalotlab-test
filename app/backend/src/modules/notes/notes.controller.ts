import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { NotesService } from './notes.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { NoteResponseDto } from './dto/note-response.dto.js';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nota para un contacto',
    description: 'Crea una nota asociándola a un contacto válido mediante su contactId.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Nota creada exitosamente.',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contacto asociado no encontrado.',
  })
  create(@Body() createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    return this.notesService.create(createNoteDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una nota por ID',
    description: 'Recupera los detalles de una nota específica.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico de la nota', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nota encontrada exitosamente.',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Nota no encontrada.',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<NoteResponseDto> {
    return this.notesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una nota (Soft Delete)',
    description: 'Marca la nota como eliminada sin borrarla físicamente.',
  })
  @ApiParam({ name: 'id', description: 'ID numérico de la nota', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nota eliminada exitosamente.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Nota #1 eliminada exitosamente' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Nota no encontrada.',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.notesService.remove(id);
  }
}
