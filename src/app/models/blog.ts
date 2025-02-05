export interface APIResponsemodel {
    message: any,
    data: any
}



export interface CurrentUser {
    email: string;
    isAdmin:boolean;
    profilePicture:string;
    username:string;
    _id:string;
    createdAt:string;
}


export interface Blog {
    title: string,
    subtitle: string,
    tags: string,
    image: string,
    createdAt:string,
    status: string,
    content:string,
    category:string,
    slug: string,
    user: User,
    _id: string
}



export class User {
    email: string;
    isAdmin:boolean;
    profilePicture:string;
    username:string;
    _id:string;

    constructor(userId: any){
        this.email = userId?.email,
        this.isAdmin= userId?.isAdmin,
        this.profilePicture = userId?.profilePicture,
        this.username = userId?.username,
        this._id = userId?._id
    }
}