import envSetup from "../config/envsetup";
import { Client, ID , Databases , Storage , Query} from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(envSetup.appwriteUrl)
            .setProject(envSetup.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title , slug , content , featuredImage , status , userId}){
        try {
            return await this.databases.createDocument(
                envSetup.appwriteProjectId,
                envSetup.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
        }
    }
 
    async updatePost( slug ,{ title, content, featuredImage, status,}){
        try {
            return await this.databases.updateDocument(
                envSetup.appwriteProjectId,
                envSetup.appwriteCollectionId,
                slug,
                {
                  title,
                  content,
                  featuredImage,
                  status,
                }
            )
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                envSetup.appwriteProjectId,
                envSetup.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.error("Appwrite service :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            await this.databases.getDocument(
                envSetup.appwriteProjectId,
                envSetup.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.error("Appwrite service :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                envSetup.appwriteDatabaseId,
                envSetup.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            return false
        }
    }

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                envSetup.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
             console.error("Appwrite service :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                envSetup.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
           console.error("Appwrite service :: deleteFile :: error", error);
            return false 
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            envSetup.appwriteBucketId,
            fileId
        )
    }
}

const service = new Service()

export default service