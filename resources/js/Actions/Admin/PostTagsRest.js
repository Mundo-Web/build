import BasicRest from "../BasicRest";

class PostTagsRest extends BasicRest {
  path = 'admin/post-tags'
  hasFiles = true; // Para manejar imágenes de las etiquetas
}

export default PostTagsRest