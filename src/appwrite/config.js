import envSetup from "../config/envsetup";
import {
  Client,
  ID,
  Databases,
  Storage,
  Query,
  Permission,
  Role,
} from "appwrite";

// Anyone reads a published post; a draft is readable only by its author.
const postPermissions = (userId, status) => {
  const author = Role.user(userId);
  return [
    status === "published"
      ? Permission.read(Role.any())
      : Permission.read(author),
    Permission.update(author),
    Permission.delete(author),
  ];
};

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(envSetup.appwriteUrl)
      .setProject(envSetup.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    tags,
    summary,
    authorName,
    userId,
  }) {
    try {
      return await this.databases.createDocument(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          tags,
          summary,
          authorName,
          userId,
        },
        postPermissions(userId, status),
      );
    } catch (error) {
      console.error("Appwrite service :: createPost :: error", error);
    }
  }

  async updatePost(
    slug,
    { title, content, featuredImage, status, tags, summary, userId },
  ) {
    try {
      return await this.databases.updateDocument(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteCollectionId,
        slug,
        { title, content, featuredImage, status, tags, summary },
        postPermissions(userId, status),
      );
    } catch (error) {
      console.error("Appwrite service :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteCollectionId,
        slug,
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }
  // Deletes the post's comments, the post and its cover image.
  async removePost(post) {
    await this.deletePostComments(post.$id);
    if (!(await this.deletePost(post.$id))) return false;
    this.deleteFile(post.featuredImage);
    return true;
  }
  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteCollectionId,
        slug,
      );
    } catch (error) {
      console.error("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "published")]) {
    try {
      return await this.databases.listDocuments(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteCollectionId,
        queries,
      );
    } catch (error) {
      console.error("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }
  // Flat comments: anyone reads, a logged-in user writes, and the comment's author
  // and the post's author can delete it.
  async createComment({ postId, postAuthorId, userId, authorName, body }) {
    try {
      const deleters = [...new Set([userId, postAuthorId])];
      return await this.databases.createDocument(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteCommentsCollectionId,
        ID.unique(),
        { postId, userId, authorName, body },
        [
          Permission.read(Role.any()),
          ...deleters.map((id) => Permission.delete(Role.user(id))),
        ],
      );
    } catch (error) {
      console.error("Appwrite service :: createComment :: error", error);
      return false;
    }
  }

  async getComments(postId) {
    try {
      return await this.databases.listDocuments(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteCommentsCollectionId,
        [
          Query.equal("postId", postId),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ],
      );
    } catch (error) {
      console.error("Appwrite service :: getComments :: error", error);
      return false;
    }
  }

  async deleteComment(commentId) {
    try {
      await this.databases.deleteDocument(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteCommentsCollectionId,
        commentId,
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteComment :: error", error);
      return false;
    }
  }

  // Called when a post is deleted. shortcut: the 100 newest comments, then the rest stay as orphans.
  async deletePostComments(postId) {
    const res = await this.getComments(postId);
    if (res)
      await Promise.all(res.documents.map((c) => this.deleteComment(c.$id)));
  }
  // Images are public to read; only the uploader can change or delete them.
  async uploadFile(file, userId) {
    try {
      const owner = Role.user(userId);
      return await this.bucket.createFile(
        envSetup.appwriteBucketId,
        ID.unique(),
        file,
        [
          Permission.read(Role.any()),
          Permission.update(owner),
          Permission.delete(owner),
        ],
      );
    } catch (error) {
      console.error("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(envSetup.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  // One row per vote: anyone can read it, only the voter can delete it.
  async getVotes(postId, userId) {
    try {
      const count = await this.databases.listDocuments(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteUpvotesCollectionId,
        [Query.equal("postId", postId), Query.limit(1)],
      );
      let mine = null;
      if (userId) {
        const own = await this.databases.listDocuments(
          envSetup.appwriteDatabaseId,
          envSetup.appwriteUpvotesCollectionId,
          [
            Query.equal("postId", postId),
            Query.equal("userId", userId),
            Query.limit(1),
          ],
        );
        mine = own.documents[0]?.$id || null;
      }
      return { total: count.total, mine };
    } catch (error) {
      console.error("Appwrite service :: getVotes :: error", error);
      return { total: 0, mine: null };
    }
  }

  async addVote(postId, userId) {
    try {
      return await this.databases.createDocument(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteUpvotesCollectionId,
        ID.unique(),
        { postId, userId },
        [Permission.read(Role.any()), Permission.delete(Role.user(userId))],
      );
    } catch (error) {
      console.error("Appwrite service :: addVote :: error", error);
      return false;
    }
  }

  async removeVote(voteId) {
    try {
      await this.databases.deleteDocument(
        envSetup.appwriteDatabaseId,
        envSetup.appwriteUpvotesCollectionId,
        voteId,
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: removeVote :: error", error);
      return false;
    }
  }
  // getFilePreview needs image transformations, which the Free plan blocks.
  getFileView(fileId) {
    return this.bucket.getFileView(envSetup.appwriteBucketId, fileId);
  }
}

const service = new Service();

export default service;
