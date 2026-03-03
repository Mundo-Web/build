import BasicRest from "./BasicRest";

class PostsRest extends BasicRest {
  path = 'posts'

  related = async (categoryId, excludeId) => {
    this.is_use_notify = false;
    return await this.post('posts/related', { category_id: categoryId, exclude_id: excludeId });
  }
}

export default PostsRest