import { Request } from 'express';
import User from 'src/user/entities/user.entity';

export default interface RequestWithUser extends Request {
  user: User;
}
