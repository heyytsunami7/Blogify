import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, RTE, Input, Select } from "../index";
import appwriteService from "../../appwrite/config";

// Slug is the Appwrite document ID: a-z 0-9 - _ ., max 36 chars, no leading special char.
const slugTransform = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z\d]+/g, "-")
    .slice(0, 36)
    .replace(/^-+|-+$/g, "");

// "React, appwrite ,react" -> ["react", "appwrite"]; max 5 tags of 30 chars (matches the column size).
const parseTags = (value) => [
  ...new Set(
    value
      .split(",")
      .map((tag) => tag.trim().toLowerCase().slice(0, 30))
      .filter(Boolean)
  ),
].slice(0, 5);

function PostForm({ post }) {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "published",
        tags: post?.tags?.join(", ") || "",
      },
    });

  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    const tags = parseTags(data.tags);
    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0], userData.$id)
        : null;
      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        tags,
        userId: post.userId,
        featuredImage: file ? file.$id : undefined,
      });
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0], userData.$id);
      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await appwriteService.createPost({
          ...data,
          tags,
          userId: userData.$id,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  // The slug is the document ID, so it is generated for new posts and never changes.
  useEffect(() => {
    if (post) return;
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title || ""), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, post]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          readOnly
          {...register("slug", { required: true })}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFileView(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Input
          label="Tags (comma separated, max 5) :"
          placeholder="react, appwrite"
          className="mb-4"
          {...register("tags")}
        />
        <Select
          options={["published", "draft"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;