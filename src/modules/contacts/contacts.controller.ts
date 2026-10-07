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
} from '@nestjs/common';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';
import { QueryContactDto } from './dto/query-contact.dto.js';
import { AddContactNoteDto } from './dto/add-contact-note.dto.js';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  findAll(@Query() query: QueryContactDto) {
    return this.contactsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.remove(id);
  }

  @Post(':id/notes')
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() addContactNoteDto: AddContactNoteDto,
  ) {
    return this.contactsService.addNote(id, addContactNoteDto);
  }

  @Get(':id/notes')
  getNotes(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.getNotes(id);
  }
}
