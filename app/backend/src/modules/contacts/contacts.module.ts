import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service.js';
import { ContactsController } from './contacts.controller.js';
import { Contact } from './entities/contact.entity.js';
import { ContactDao } from './dao/contact.dao.js';
import { NotesModule } from '../notes/notes.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    NotesModule,
  ],
  controllers: [ContactsController],
  providers: [ContactsService, ContactDao],
  exports: [ContactsService, ContactDao],
})
export class ContactsModule {}
