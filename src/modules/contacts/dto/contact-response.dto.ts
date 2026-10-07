export class ContactNoteResponseDto {
  id: number;
  content: string;
  createdAt: Date;
}

export class ContactResponseDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: ContactNoteResponseDto[];
}
