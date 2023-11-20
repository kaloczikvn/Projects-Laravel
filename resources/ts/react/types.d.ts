interface IProject {
    id: number;
    name: string;
    description: string;
    status: 0 | 1 | 2;
    create_at: string;
    updated_at: string;
    contacts?: IContact[];
}

interface IContact {
    id?: number;
    name: string;
    email: string;
    create_at?: string;
    updated_at?: string;
}
