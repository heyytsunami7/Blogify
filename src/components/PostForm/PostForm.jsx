import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, RTE, Input, Select } from "../index";
import appwriteService from "../../appwrite/config";
import { fieldClass, labelClass } from "../Input";
// Slug is the Appwrite document ID: a-z 0-9 - _ ., max 36 chars, no leading special char.
const slugTransform = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z\d]+/g, "-")
    .slice(0, 36)
    .replace(/^-+|-+$/g, "");

// "React, appwrite ,react" -> ["react", "appwrite"]; max 5 tags of 30 chars (matches the column size).
const parseTags = (value) =>
  [
    ...new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase().slice(0, 30))
        .filter(Boolean),
    ),
  ].slice(0, 5);

function PostForm({ post }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "published",
        tags: post?.tags?.join(", ") || "",
        summary: post?.summary || "",
      },
    });

  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    setError("");
    const tags = parseTags(data.tags);
    const image = data.image[0];
    const file = image
      ? await appwriteService.uploadFile(image, userData.$id)
      : null;

    if (image && !file) {
      setError("Image upload failed. Please try again.");
      return;
    }

    const dbPost = post
      ? await appwriteService.updatePost(post.$id, {
          ...data,
          tags,
          userId: post.userId,
          featuredImage: file ? file.$id : undefined,
        })
      : await appwriteService.createPost({
          ...data,
          tags,
          featuredImage: file.$id,
          authorName: userData.name,
          userId: userData.$id,
        });

    if (dbPost) {
      // Delete the old image only once the new one is safely saved.
      if (post && file) appwriteService.deleteFile(post.featuredImage);
      navigate(`/post/${dbPost.$id}`);
    } else {
      // Don't leave the new image orphaned in storage.
      if (file) appwriteService.deleteFile(file.$id);
      setError(
        post
          ? "Could not save your changes."
          : "Could not create the post. A post with this title may already exist.",
      );
    }
  };

  // The slug is the document ID, so it is generated for new posts and never changes.
  useEffect(() => {
    if (post) return;
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title || ""), {
          shouldValidate: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, post]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div>
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-mute">
          <span className="text-accent">● </span>
          {post ? "Editing" : "New draft"}
        </span>
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-[10px] border-l-4 border-danger bg-bg2 px-4 py-3 text-sm font-medium"
          >
            {error}
          </p>
        )}
        <div className="space-y-5">
          <Input
            label="Title"
            placeholder="Untitled story"
            {...register("title", { required: true })}
          />
          <Input
            label="Slug (the post's address)"
            placeholder="your-story-slug"
            readOnly
            className="text-mute"
            {...register("slug", { required: true })}
          />
          <div>
            <label className={labelClass} htmlFor="summary">
              Summary (optional, shown on cards)
            </label>
            <textarea
              id="summary"
              rows={2}
              maxLength={160}
              placeholder="One or two sentences that make people click."
              className={fieldClass}
              {...register("summary")}
            />
          </div>
          <RTE
            label="Content"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>
      </div>

      <aside className="space-y-5 lg:pt-8">
        <div className="space-y-3 border-t border-fg pt-4">
          <Input
            label="Cover image"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", { required: !post })}
          />
          {post && (
            <img
              src={appwriteService.getFileView(post.featuredImage)}
              alt={post.title}
              className="w-full rounded-[18px]"
            />
          )}
        </div>
        <div className="border-t border-fg pt-4">
          <Input
            label="Tags (comma separated, max 5)"
            placeholder="react, appwrite"
            {...register("tags")}
          />
        </div>
        <div className="border-t border-fg pt-4">
          <Select
            options={["published", "draft"]}
            label="Status"
            {...register("status", { required: true })}
          />
          <p className="mt-2 text-sm text-mute">
            Drafts are visible only to you.
          </p>
        </div>
        <div className="flex items-center gap-4 border-t border-fg pt-4">
          <Button type="submit" className="flex-1">
            {post ? "Update post" : "Publish post"}{" "}
            <span aria-hidden="true">→</span>
          </Button>
          <Link
            to={post ? `/post/${post.$id}` : "/all-posts"}
            className="border-b border-current pb-0.5 text-xs font-semibold uppercase tracking-wider hover:text-accent"
          >
            Cancel
          </Link>
        </div>
      </aside>
    </form>
  );
}

export default PostForm;
