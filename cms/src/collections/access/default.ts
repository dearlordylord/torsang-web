import { loggedIn } from './loggedIn'
import { publishedOrLoggedIn } from './publishedOrLoggedIn'

export const defaultAccess = {
  read: publishedOrLoggedIn,
  create: loggedIn,
  update: loggedIn,
  delete: loggedIn,
}
