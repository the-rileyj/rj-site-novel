import ghostAPI from "./ghost-core";

export async function getPosts() {
  return await ghostAPI.posts.browse({
    limit: "all",
  });
}

export async function getSinglePost(postSlug: string) {
  return await ghostAPI.posts.read({
    slug: postSlug,
  });
}
