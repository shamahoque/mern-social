import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction' 
import ListItemText from '@material-ui/core/ListItemText' 
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import {findPeople, follow} from './api-user.js'
import auth from './../auth/auth-helper'
import Snackbar from '@material-ui/core/Snackbar'
import ViewIcon from '@material-ui/icons/Visibility'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: 0
  }),
  title: {
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  avatar: {
    marginRight: theme.spacing(1)
  },
  follow: {
    right: theme.spacing(2)
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: 'middle'
  }
}))

export default function FindPeople() {
  const classes = useStyles()
  const [values, setValues] = useState({
    users: [],
    open: false,
    followMessage: ''
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    findPeople({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setValues({...values, users:data})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [])
  const clickFollow = (user, index) => {
    follow({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, user._id).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        let toFollow = values.users
        toFollow.splice(index, 1)
        setValues({...values, users: toFollow, open: true, followMessage: `Following ${user.name}!`})
      }
    })
  }
  const handleRequestClose = (event, reason) => {
    setValues({...values, open: false })
  }
    return (<div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Who to follow
        </Typography>
        <List>
          {values.users.map((item, i) => {
              return <span key={i}>
                <ListItem>
                  <ListItemAvatar className={classes.avatar}>
                      <Avatar src={'/api/users/photo/'+item._id}/>
                  </ListItemAvatar>
                  <ListItemText primary={item.name}/>
                  <ListItemSecondaryAction className={classes.follow}>
                    <Link to={"/user/" + item._id}>
                      <IconButton variant="contained" color="secondary" className={classes.viewButton}>
                        <ViewIcon/>
                      </IconButton>
                    </Link>
                    <Button aria-label="Follow" variant="contained" color="primary" onClick={()=> {clickFollow(item, i)}}>
                      Follow
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </span>
            })
          }
        </List>
      </Paper>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={values.open}
          onClose={handleRequestClose}
          autoHideDuration={6000}
          message={<span className={classes.snack}>{values.followMessage}</span>}
      />
    </div>)
}
