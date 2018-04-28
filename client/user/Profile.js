import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Edit from 'material-ui-icons/Edit'
import Divider from 'material-ui/Divider'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'
import FollowProfileButton from './../user/FollowProfileButton'
import ProfileTabs from './../user/ProfileTabs'
import {listByUser} from './../post/api-post.js'

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
})

class Profile extends Component {
  constructor({match}) {
    super()
    this.state = {
      user: {following:[], followers:[]},
      redirectToSignin: false,
      following: false,
      posts: []
    }
    this.match = match
  }
  init = (userId) => {
    const jwt = auth.isAuthenticated()
    read({
      userId: userId
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({redirectToSignin: true})
      } else {
        let following = this.checkFollow(data)
        this.setState({user: data, following: following})
        this.loadPosts(data._id)
      }
    })
  }
  componentWillReceiveProps = (props) => {
    this.init(props.match.params.userId)
  }
  componentDidMount = () => {
    this.init(this.match.params.userId)
  }
  checkFollow = (user) => {
    const jwt = auth.isAuthenticated()
    const match = user.followers.find((follower)=> {
      return follower._id == jwt.user._id
    })
    return match
  }
  clickFollowButton = (callApi) => {
    const jwt = auth.isAuthenticated()
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.state.user._id).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({user: data, following: !this.state.following})
      }
    })
  }
  loadPosts = (user) => {
    const jwt = auth.isAuthenticated()
    listByUser({
      userId: user
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({posts: data})
      }
    })
  }
  removePost = (post) => {
    const updatedPosts = this.state.posts
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    this.setState({posts: updatedPosts})
  }
  render() {
    const {classes} = this.props
    const photoUrl = this.state.user._id
              ? `/api/users/photo/${this.state.user._id}?${new Date().getTime()}`
              : '/api/users/defaultphoto'
    const redirectToSignin = this.state.redirectToSignin
    if (redirectToSignin) {
      return <Redirect to='/signin'/>
    }
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={photoUrl} className={classes.bigAvatar}/>
            </ListItemAvatar>
            <ListItemText primary={this.state.user.name} secondary={this.state.user.email}/> {
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == this.state.user._id
             ? (<ListItemSecondaryAction>
                  <Link to={"/user/edit/" + this.state.user._id}>
                    <IconButton aria-label="Edit" color="primary">
                      <Edit/>
                    </IconButton>
                  </Link>
                  <DeleteUser userId={this.state.user._id}/>
                </ListItemSecondaryAction>)
            : (<FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton}/>)
            }
          </ListItem>
          <Divider/>
          <ListItem>
            <ListItemText primary={this.state.user.about} secondary={"Joined: " + (
              new Date(this.state.user.created)).toDateString()}/>
          </ListItem>
        </List>
        <ProfileTabs user={this.state.user} posts={this.state.posts} removePostUpdate={this.removePost}/>
      </Paper>
    )
  }
}
Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Profile)
