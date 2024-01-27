export type APIResponse<T = object> = { success: true; data: T } | { success: false; data: T | null, error: string };
export interface NotFoundType { searchParams: Record<string, any>, params: { locale: 'fr'; 'not-found': string[] } }
export type InputsChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
