import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { FirewallGuard } from 'src/firewall/firewall.guard';

@Controller('user')
export class UserController {


    constructor(private readonly userService: UserService) { }


    @Get()
    getAllUsers() {

        return this.userService.getAllUsers();
    }
    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number) {

        try {
            return this.userService.getUser(id);
        }
        catch (error) {
            throw new NotFoundException(error.message);
        }
    }
    @Post()
    @UseGuards(FirewallGuard)
    addUser(@Body(new ValidationPipe({transform:true})) user: UserDto) {
        return this.userService.addUser(user);
    }
}
