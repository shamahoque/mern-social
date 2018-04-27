import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Card, {CardContent, CardMedia} from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import seashellImg from './../assets/images/seashell.jpg'
import {Link} from 'react-router-dom'

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 330
  }
})

class Home extends Component {
  render() {
    const {classes} = this.props
    return (
        <Card className={classes.card}>
          <Typography type="headline" component="h2" className={classes.title}>
            Home Page
          </Typography>
          <CardMedia className={classes.media} image={seashellImg} title="Unicorn Shells"/>
          <CardContent>
            <Typography type="body1" component="p">
              Welcome to the MERN Skeleton home page. <Link to="/users">Users</Link> <Link to="/signup">Sign up</Link> <Link to="/signin">Sign in</Link>
            </Typography>
          </CardContent>
        </Card>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)
