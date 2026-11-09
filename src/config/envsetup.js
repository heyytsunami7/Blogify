const required = {
    appwriteUrl: "BLOGIFY_APPWRITE_URL",
    appwriteProjectId: "BLOGIFY_APPWRITE_PROJECT_ID",
    appwriteDatabaseId: "BLOGIFY_APPWRITE_DATABASE_ID",
    appwriteCollectionId: "BLOGIFY_APPWRITE_COLLECTION_ID",
    appwriteBucketId: "BLOGIFY_APPWRITE_BUCKET_ID",
};

const envSetup = {};

for (const [key, name] of Object.entries(required)) {
    const value = import.meta.env[name];
    if (!value) {
        throw new Error(`Missing ${name}. Copy .env.sample to .env and fill it in.`);
    }
    envSetup[key] = value;
}

export default envSetup;