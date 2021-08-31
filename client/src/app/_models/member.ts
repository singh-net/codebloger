import { Photo } from "./photo";

export interface Member {
    id: number;
    username: string;
    about: string;
    city:string;
    country: string;
    created: string;
    githubLink: string;
    name: string;
    userPhotos: Photo[];
    workAs: string;
    workAt: string;
    photoUrl: string
    totalFollowers: number;

}