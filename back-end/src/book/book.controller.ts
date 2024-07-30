import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AdminRoleGuard } from 'src/admin-role/admin-role.guard';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @UseGuards(AdminRoleGuard)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(@Query() query: { [key: string]: any }) {
    return this.bookService.findAll(query);
  }

  @UseGuards(AdminRoleGuard)
  @Get("random-isbn")
  randomIsBn() {
    return this.bookService.randomIsBn();
  }

  @UseGuards(AdminRoleGuard)
  @Get("get-authors")
  getAuthors() {
    return this.bookService.getAuthorList();
  }

  @UseGuards(AdminRoleGuard)
  @Get("get-categories")
  getCategories() {
    return this.bookService.getCategoryList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @UseGuards(AdminRoleGuard)
  @Patch()
  update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto);
  }

  @UseGuards(AdminRoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
