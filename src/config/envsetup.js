const required = {
    appwriteUrl: "PUBLIC_APPWRITE_URL",
    appwriteProjectId: "PUBLIC_APPWRITE_PROJECT_ID",
    appwriteDatabaseId: "PUBLIC_APPWRITE_DATABASE_ID",
    appwriteCollectionId: "PUBLIC_APPWRITE_COLLECTION_ID",
    appwriteBucketId: "PUBLIC_APPWRITE_BUCKET_ID",
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