interface BaseModel {
  id? : string;
}

export interface Image extends BaseModel {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    created_at?: string;

    likesCount?: number;
    isLikedByUser?: boolean;
    commentsCount?: number;
    comments?: Array<{ id: string; user_name: string; text: string; created_at: string }>;
}
export interface User extends BaseModel {
    name: string;
    email: string;
    role: string;
}