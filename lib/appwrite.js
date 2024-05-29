import {ID,Account, Client, Avatars, Databases, Query,Storage } from 'react-native-appwrite';
export const config ={
    endpoint: "https://cloud.appwrite.io/v1",
    platform:'com.deep.aora',
    projectId:'6628f6957f86cb127ef2',
    databaseId:'662a26b189356e215366',
    userCollectionId:'662a26e4ae6a4241d79f',
    videoCollectionId:'662a272b1e33e78e037d',
    storageId:'662a2a6ac5241867b2ce',
}
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId) // Your project ID
    .setPlatform(platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client)

export const createUser = async(email,password,username)=>{
    // Register User
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw error;
        const avatarUrl = avatars.getInitials(username);
        await signIn(email,password)
        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId:newAccount.$id,
                email,
                username,
                avatar:avatarUrl
            }
        )
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email,password){
    try {
        const sesson = await account.createEmailSession(email,password);
        return sesson
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () =>{
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

// get all videos

export const getAllPosts = async () =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// get latest
export const getLatestPosts = async () =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// search posts
export const searchPosts = async (query) =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title',query)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
// user posts
export const getUserPosts = async (userId) =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator',userId),Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// logout

export const signOut = async ()=>{
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId,type)=>{
    let fileUrl;
    try {
        if(type ==='video'){
            fileUrl = storage.getFileView(storageId,fileId)
        }else if(type === 'image'){
            fileUrl = storage.getFilePreview(storageId,fileId,2000,2000,'top',100)
        }else{
            throw new Error("Invalid file type")
        }
        if(!fileUrl) throw Error;
        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}
// upload to appwrite
export const uploadFile = async (file,type)=>{
    if(!file) return;  
    const asset = {
        name:file?.fileName,
        type:file?.mimeType,
        size:file?.fileSize,
        uri:file?.uri
    };
    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )
        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}

// create post
export const createVideo = async (form)=>{
    try {
        const [thumbnailUrl,videoUrl] = await Promise.all([
            uploadFile(form.thumbnail,'image'),
            uploadFile(form.video,'video'),
        ])

        const newPost = await databases.createDocument(
            databaseId,videoCollectionId,ID.unique(),{
                title: form.title,
                thumbnail:thumbnailUrl,
                video:videoUrl,
                prompt:form.prompt,
                creator:form.userId
            }
        )
    } catch (error) {
        throw new Error(error)
    }
} 