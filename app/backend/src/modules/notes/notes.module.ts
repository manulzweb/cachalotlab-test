import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service.js';
import { NotesController } from './notes.controller.js';
import { Note } from './entities/note.entity.js';
import { NoteDao } from './dao/note.dao.js';
import { Contact } from '../contacts/entities/contact.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Contact])],
  controllers: [NotesController],
  providers: [NotesService, NoteDao],
  exports: [NotesService, NoteDao],
})
export class NotesModule {}
