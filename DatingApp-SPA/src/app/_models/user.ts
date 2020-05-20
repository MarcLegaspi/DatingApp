import { Photo } from './photo';

export interface User {
    id: number;
    username: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: string;
    photoUrl: string;
    city: string;
    country: string;
    lookingFor?: string;
    interests?: string;
    introduction?: string;
    photos: Photo[]
}
