import Post from '../models/post.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'

const listByUser = (req, res) => {
  Post.find({postedBy: req.profile._id})
  .populate('comments', 'text created')
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .sort('-created')
  .exec((err, posts) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(posts)
  })
}

const listNewsFeed = (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)
  Post.find({postedBy: { $in : req.profile.following } })
  .populate('comments', 'text created')
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .sort('-created')
  .exec((err, posts) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(posts)
  })
}

export default {
  listByUser,
  listNewsFeed
}
