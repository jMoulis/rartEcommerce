export type APIResponse<T = object> = { status?: number, success: true; error: null, data: T | null } | { success: false; data: T | null, error: string, status?: number };

export interface NotFoundType { searchParams: Record<string, any>, params: { locale: 'fr'; 'not-found': string[] } }

export type InputsChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
