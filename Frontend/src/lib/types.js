 /**
  * PUBLIC_INTERFACE
  * Typedefs (JSDoc) for API shapes to aid intellisense in JS projects.
  * Matches the backend openapi.json where applicable.
  */
 
 /**
  * @typedef {Object} Session
  * @property {string} id
  * @property {string} user_id
  * @property {string | null} [title]
  * @property {string | null} [created_at]
  * @property {string | null} [updated_at]
  */
 
 /**
  * @typedef {Object} SessionsList
  * @property {Session[]} items
  */
 
 /**
  * @typedef {Object} MessageObject
  * @property {string} id
  * @property {string} session_id
  * @property {string} user_id
  * @property {("user"|"assistant"|"system")} role
  * @property {string} content
  * @property {string | null} [created_at]
  */
 
 /**
  * @typedef {Object} MessageCreateResponse
  * @property {MessageObject[]} items
  */
 
 /**
  * @typedef {Object} Profile
  * @property {string} id
  * @property {string | null} [email]
  * @property {string | null} [full_name]
  */
 
 export {};
