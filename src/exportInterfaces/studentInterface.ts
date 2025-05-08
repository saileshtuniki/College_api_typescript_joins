export interface Student {
    id: number;
    name: string;
    parentId: number;
}

export interface StudentResponse {
    message: string;
    data?: Student | Student[];
    success?: boolean;
    error?: string;
}


