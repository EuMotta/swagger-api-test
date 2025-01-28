import { ApiResponse } from 'src/interfaces/api';

export function createApiResponse({
  error = false,
  message,
  data = null,
}): ApiResponse<any> {
  return {
    error: !error,
    message,
    data: error ? data : null,
  };
}
