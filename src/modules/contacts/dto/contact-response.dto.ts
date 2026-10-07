export class ContactResponseDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
}
