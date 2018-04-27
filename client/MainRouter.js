import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'

class MainRouter extends Component {

  render() {
    return (<div>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
      </Switch>
    </div>)
  }
}

export default MainRouter
