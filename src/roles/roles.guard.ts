import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'; // Import the public decorator key

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Allow public access
    }

    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    // Add debug logging
    console.log('Current user:', user);
    console.log('Required roles:', requiredRoles);

    // Check if user exists and has a role
    if (!user || !user.role) {
      return false; // Deny access if user is not authenticated
    }

    return requiredRoles.some((role) => user.role === role); // Check if user has one of the required roles
  }
}
