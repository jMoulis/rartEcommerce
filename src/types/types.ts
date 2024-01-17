export type APIResponse<T = object> = { success: true; data: T } | { success: false; error: string };
export interface NotFoundType { searchParams: Record<string, any>, params: { locale: 'fr'; 'not-found': string[] } }
