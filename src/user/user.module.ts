import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import User from './entities/user.entity';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
