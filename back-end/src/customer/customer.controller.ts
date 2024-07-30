import { Controller, Get, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Get()
  findAll(@Query() query: { [key: string]: any }) {
    return this.customerService.findAll(query);
  }
}
