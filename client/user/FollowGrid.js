import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  gridList: {
    width: 500,
    height: 220,
  },
  tileText: {
    textAlign: 'center',
    marginTop: 10
  }
}))
export default function FollowGrid (props) {
  const classes = useStyles()
    return (<div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={4}>
        {props.people.map((person, i) => {
           return  <GridListTile style={{'height':120}} key={i}>
              <Link to={"/user/" + person._id}>
                <Avatar src={'/api/users/photo/'+person._id} className={classes.bigAvatar}/>
                <Typography className={classes.tileText}>{person.name}</Typography>
              </Link>
            </GridListTile>
        })}
      </GridList>
    </div>)
}

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired
}

