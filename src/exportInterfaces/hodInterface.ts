export interface Hod{
    id: number;
    name: string;
    parentId: number;
}



export interface HodResponse {
    message: string;
    data?: Hod | Hod[] | null; // Can be a single HOD or a list
    success?: boolean;
    error?: string;
}
