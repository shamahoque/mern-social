import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import postRoutes from './routes/post.routes'

// modules for server side rendering
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import StaticRouter from 'react-router-dom/StaticRouter'

import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from 'material-ui/styles'
import {teal, orange} from 'material-ui/colors'
//end

//comment out before building for production
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//comment out before building for production
devBundle.compile(app)

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)

app.get('*', (req, res) => {
   const sheetsRegistry = new SheetsRegistry()
   const theme = createMuiTheme({
     palette: {
       primary: {
       light: '#52c7b8',
       main: '#009688',
       dark: '#00675b',
       contrastText: '#fff',
     },
     secondary: {
       light: '#ffd95b',
       main: '#ffa726',
       dark: '#c77800',
       contrastText: '#000',
     },
       openTitle: teal['700'],
       protectedTitle: orange['700'],
       type: 'light'
     }
   })
   const generateClassName = createGenerateClassName()
   const context = {}
   const markup = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={context}>
         <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
              <MainRouter/>
            </MuiThemeProvider>
         </JssProvider>
      </StaticRouter>
     )
    if (context.url) {
      return res.redirect(303, context.url)
    }
    const css = sheetsRegistry.toString()
    res.status(200).send(Template({
      markup: markup,
      css: css
    }))
})

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }
})

export default app
