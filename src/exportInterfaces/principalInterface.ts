export interface Principal {
    id: number;
    name: string;
    role: string;
    parentId: number | null;
}

export interface UpdateResponse {
    message: string;
    data?: Principal | Principal[] |null;
    success?: boolean;
    error?: string;
}

