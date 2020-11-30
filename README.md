# red-ink-api
## About

API for red-ink built with TypeScript, Express, and Google Cloud Firestore DB. 

Currently in development as of 11/28/2020.

[Live Site](https://red-ink-writing.com)

[Link to frontend repository for red-ink](https://github.com/samuel-casey/red-ink-frontend)

### Routes


| Controller  | Route                           | HTTP Method | DB Action | Description                                                      |
|-------------|---------------------------------|-------------|-----------|------------------------------------------------------------------|
| submissions | /submissions                    | POST        | CREATE    | Create a new writing submission                                  |
| submissions | /submissions/:doc_id     | PUT         | UPDATE    | Mark a submission as complete or incomplete                      |
| submissions | /submissions/:doc_id     | DELETE      | DESTROY   | Remove a submission                                              |
| submissions | /submissions/writers/:writer_id | GET         | INDEX     | Get all submissions for a writer                                 |
| submissions | /submissions/editors/:editor_id | GET         | INDEX     | Get all submissions for a editor                                 |
| submissions     | /writers/demo/:demo_writer_id                        | PUT        | N/A    | Seed database for a new demo user  |
| submissions     | /submissions/reminders/:doc_id                        | PUT        | N/A    | Update editor reminded status for a submission given its document id  |
| editors     | /editors                        | GET         | INDEX     | Get all editors                                                  |
| editors     | /editors                        | POST        | CREATE    | Create a new editor (passes data from User Auth object as body)  |
| editors     | /editors/:uid                        | GET       | SHOW   | Get data for a single editor profile  |
| editors     | /editors/:doc_id                        | PUT         | UPDATE    | Update an editors profile information
| editors     | /editors/:doc_id                        | DELETE         | DESTROY    | Delete (deactivate) an editor's profile                            |
| editors    | /editors/remind/:uid                        | PUT        | N/A    | Send a reminder email to an editor with given uid that a document they were assigned is waiting edits  |
| writers     | /writers                        | GET       | INDEX   | Get all writers  |
| writers     | /writers                        | POST        | CREATE    | Create a new writer (passes data from User Auth object as body)  |
| writers     | /writers/:uid                        | GET       | SHOW    | Get a writer by ID  |
| writers     | /writers/:doc_id                        | PUT        | CREATE    | Update a writer's info  |
| writers     | /writers/:doc_id                        | DELETE        | DESTROY    | Delete (deactivate) a writer's profile  |
| writers     | /writers/notify/:uid                        | PUT        | N/A    | Notify a writer that their submission has been edited  |

#### Route details

- DELETE routes for editors and writers will only delete their info from the writers and editors table -- it will not delete their user objects in Firebase auth. Result of this will be that if a user deletes all of their data for now and wants to join again later, they'll have an existing username and password, but won't be able to see their old submissions or profile data
- PUT and DELETE routes use doc_id (the auto-generated document ID created by firestore), while GET/SHOW routes use the uid (a key in the writer/editor document that comes from the Auth object)
- Routes with N/A for DB action are are used for things other than standard CRUD operations, like triggering an email notification or handling demo account data