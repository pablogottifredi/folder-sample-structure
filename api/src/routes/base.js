import { Router } from 'express'
import incidents from './incidents'

export default Router()
  .use('/incidents.by.helpdesk/', incidents )
  
