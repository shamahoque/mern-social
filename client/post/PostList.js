import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Post from './Post'

class PostList extends Component {
  render() {
    return (
      <div style={{marginTop: '24px'}}>
        {this.props.posts.map((item, i) => {
            return <Post post={item} key={i}/>
          })
        }
      </div>
    )
  }
}
PostList.propTypes = {
  posts: PropTypes.array.isRequired
}
export default PostList
