import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/new/:userId')
  .post(authCtrl.requireSignin, postCtrl.create)

router.route('/api/posts/photo/:postId')
  .get(postCtrl.photo)

router.route('/api/posts/by/:userId')
  .get(authCtrl.requireSignin, postCtrl.listByUser)

router.route('/api/posts/feed/:userId')
  .get(authCtrl.requireSignin, postCtrl.listNewsFeed)

router.route('/api/posts/like')
  .put(authCtrl.requireSignin, postCtrl.like)
router.route('/api/posts/unlike')
  .put(authCtrl.requireSignin, postCtrl.unlike)

router.route('/api/posts/comment')
  .put(authCtrl.requireSignin, postCtrl.comment)
router.route('/api/posts/uncomment')
  .put(authCtrl.requireSignin, postCtrl.uncomment)

router.route('/api/posts/:postId')
  .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove)

router.param('userId', userCtrl.userByID)
router.param('postId', postCtrl.postByID)

export default router
