// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { PostsCat } from 'src/posts-cat/posts-cat.module/posts-cat.model';

// guard который в теории можно сделать, только нужно понять как request мы прокинули, еще бы токен из которого можно былобы взять id
// @Injectable()
// export class OnlyOWnerGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<{ post: PostsCat }>();
//     const post = request.post;
//     if (post.userId === ) throw new ForbiddenException('You have no rights!');
//     return ;
//   }
// }
