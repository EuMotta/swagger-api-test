import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request?.route?.path;

    if (path && path.startsWith('/auth')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((response) => {
        if (
          typeof response === 'object' &&
          'error' in response &&
          'message' in response &&
          'data' in response
        ) {
          return response;
        }

        return {
          error: false,
          message: '',
          data: response || [],
        };
      }),
    );
  }
}
