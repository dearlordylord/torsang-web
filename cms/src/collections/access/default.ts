import { publishedOrLoggedIn } from './publishedOrLoggedIn';
import { loggedIn } from './loggedIn';

export const defaultAccess = {
  read: publishedOrLoggedIn,
  create: loggedIn,
  update: loggedIn,
  delete: loggedIn,
};