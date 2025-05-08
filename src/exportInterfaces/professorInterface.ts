export interface Professor {
    id: number;
    name: string;
    parentId: number;
}

export interface ProfessorResponse {
    message: string;
    data?: Professor | Professor[];
    success?: boolean;
    error?: string;
}
