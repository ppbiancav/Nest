
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemaController } from './controllers/tema.controller';
import { TemaService } from './services/tema.service';
import { Tema } from './entities/tema.entity';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([Tema])],
    controllers: [TemaController],
    providers: [TemaService],
    exports: [TypeOrmModule]
})
export class TemaModule { };