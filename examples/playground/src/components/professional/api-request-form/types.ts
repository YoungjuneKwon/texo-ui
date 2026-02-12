export interface ApiRequestFormAttributes {
  title?: string;
  baseUrl?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path?: string;
  headers?: Record<string, string>;
  queryParams?: Array<{ name: string; type?: string; default?: string | number }>;
  body?: { type?: 'json' | 'form-data' | 'raw'; schema?: Record<string, unknown> };
}
