const { where } = require("sequelize");
const Posts = require("../models/Posts");
class PostController {
  async create(req, res) {
    const { image, description } = req.body;

    const newPost = await Posts.create({
      image,
      description,
      author_id: req.userId,
    });
    if (!newPost) {
      return res.status(400).json({ message: "Failed at creating post!" });
    }
    return res.status(200).json({ image, description });
  }
  async delete(req, res) {
    const { id } = req.params;

    const verifyPost = await Posts.findOne({
      where: {
        id,
        author_id: req.userId,
      },
    });
    if (!verifyPost) {
      return res.status(404).json({ message: "Post doesn't exist!" });
    }
    if (verifyPost.author_id != req.userId) {
      return res
        .status(401)
        .json({ message: "User don't have permission to delete this post!" });
    }
    const deletedPost = await Posts.destroy({
      where: {
        id,
      },
    });
    if (!deletedPost) {
      return res.status(400).json({ message: "Failed to delete post!" });
    }

    return res.status(200).json({ message: "Post deleted!" });
  }
  async update(req, res) {
    const { id } = req.params;
    const { image, description } = req.body;

    const verifyPost = await Posts.findOne({
      where: {
        id,
        author_id: req.userId,
      },
    });
    if (!verifyPost) {
      return res.status(404).json({ message: "Post doesn't exist!" });
    }
    if (verifyPost.author_id != req.userId) {
      return res
        .status(401)
        .json({ message: "User don't have permission to delete this post!" });
    }

    const postUpdate = await Posts.update(req.body, { where: { id } });

    if (!postUpdate) {
      return res.status(400).json({ message: "Failed to update post!" });
    }

    return res.status(200).json({ message: "Post updated!" });
  }
}

module.exports = new PostController();
