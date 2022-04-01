import { User as UserModel } from '@prisma/client';

export class User implements UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
