const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, resp) => {
  const ret = await Blog.find({}).populate("user", {username:1, name:1, id:1});
  resp.json(ret);
});

blogsRouter.post("/", async (req, resp) => {
  if (!req.user) {
    return resp.status(401).json({error: "token missing or invalid"});
  }
  const blog = new Blog({...req.body, user:req.user});
  const ret = await blog.save();
  req.user.blogs.push(ret._id);
  await req.user.save();
  resp.status(201).json(ret);
});

blogsRouter.delete("/:id", async (req, resp) => {
  if (!req.user) {
    return resp.status(401).json({error: "token missing or invalid"});
  }
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return resp.status(404).end();
  }
  if (blog.user.toString() !== req.user._id.toString()) {
    return resp.status(401).json({error: "token missing or invalid"});
  }
  await Blog.findByIdAndDelete(req.params.id);
  req.user.blogs = req.user.blogs.filter(b => b.id !== req.params.id);
  req.user.save();
  resp.status(204).end();
});

blogsRouter.put("/:id", async (req, resp) => {
  const updblog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true, context:"query"}).updblog.populate("user", {username:1, name:1, id:1});
  resp.json(updblog);
});

module.exports = blogsRouter;
