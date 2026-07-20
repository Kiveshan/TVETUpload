// Typed fetch client for the TVETUpload backend.
//
// All data access should go through this module so that the base URL and
// error handling stay consistent. The base URL comes from VITE_API_URL and
// defaults to "/api" (forwarded to the backend by the Vite dev proxy).
//
// Feature hooks wrap these calls with React Query, e.g.:
//   export function useThings() {
//     return useQuery({ queryKey: ['things'], queryFn: () => api.get<Thing[]>('/things') });
//   }

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  readonly status: number;
  readonly body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const finalHeaders = new Headers(headers);
  if (body !== undefined && !isFormData) finalHeaders.set('Content-Type', 'application/json');

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: finalHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    const p = payload as Record<string, unknown> | undefined;
    const message =
      (p && typeof p === 'object'
        ? String(p['error'] ?? p['message'] ?? '')
        : '') || res.statusText || 'Request failed';

    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}

// XHR-based upload with progress reporting. fetch() has no upload progress
// event, so large file submissions (multi-file, multi-MB) use this instead
// of api.post to give the UI something to show besides a static spinner.
function postWithProgress<T>(
  path: string,
  formData: FormData,
  onProgress?: (fraction: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE_URL}${path}`, true);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };

    xhr.onload = () => {
      const isJson = xhr.getResponseHeader('content-type')?.includes('application/json');
      let payload: unknown;
      try { payload = isJson ? JSON.parse(xhr.responseText) : undefined; } catch { payload = undefined; }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(payload as T);
        return;
      }
      const p = payload as Record<string, unknown> | undefined;
      const message =
        (p && typeof p === 'object' ? String(p['error'] ?? p['message'] ?? '') : '') ||
        xhr.statusText ||
        'Request failed';
      reject(new ApiError(xhr.status, message, payload));
    };

    xhr.onerror = () => reject(new ApiError(0, 'Network error'));

    xhr.send(formData);
  });
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
  postUpload: postWithProgress,
};
