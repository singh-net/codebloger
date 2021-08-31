export interface Comment {
    id: number,
    content: string,
    appUserId: number,
    articleId: number,
    parentId: number,
    created: string,
    username: string,
    userFullName: string,
    userPhotoUrl: string
}