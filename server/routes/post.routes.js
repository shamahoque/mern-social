import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/by/:userId')
  .get(authCtrl.requireSignin, postCtrl.listByUser)

router.route('/api/posts/feed/:userId')
  .get(authCtrl.requireSignin, postCtrl.listNewsFeed)

router.param('userId', userCtrl.userByID)

export default router
