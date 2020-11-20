# red-ink-api
## About

API for red-ink built with TypeScript, Express, and Google Cloud Firestore DB. 

Currently in development as of 11/19/2020.

[Link to frontend repository for red-ink](https://github.com/samuel-casey/red-ink-frontend)

### Routes


| Controller  | Route                           | HTTP Method | DB Action | Description                                                      |
|-------------|---------------------------------|-------------|-----------|------------------------------------------------------------------|
| submissions | /submissions                    | POST        | CREATE    | Create a new writing submission                                  |
| submissions | /submissions/:submission_id     | PUT         | UPDATE    | Mark a submission as complete or incomplete                      |
| submissions | /submissions/:submission_id     | DELETE      | DESTROY   | Remove a submission                                              |
| submissions | /submissions/writers/:writer_id | GET         | INDEX     | Get all submissions for a writer                                 |
| submissions | /submissions/editors/:editor_id | GET         | INDEX     | Get all submissions for a editor                                 |
| editors     | /editors                        | GET         | INDEX     | Get all editors                                                  |
| editors     | /editors                        | POST        | CREATE    | Create a new editor (passes data from User Auth object as body)  |
| editors     | /editors/:editor_id                        | GET       | SHOW   | Get data for a single editor profile  |
| editors     | /editors/:editor_id                        | PUT         | UPDATE    | Update an editors profile information
| editors     | /editors/:editor_id                        | DELETE         | DESTROY    | Delete (deactivate) an editor's profile                            |
| writers     | /writers                        | GET       | INDEX   | Get all writers  |
| writers     | /writers                        | POST        | CREATE    | Create a new writer (passes data from User Auth object as body)  |
| writers     | /writers/:writer_id                        | GET       | SHOW    | Get a writer by ID  |
| writers     | /writers/:writer_id                        | PUT        | CREATE    | Update a writer's info  |
| writers     | /writers/:writer_id                        | DELETE        | DESTROY    | Delete (deactivate) a writer's profile  |

#### Route details

- DELETE routes for editors and writers will only delete their info from the writers and editors table -- it will not delete their user objects in Firebase auth. Result of this will be that if a user deletes all of their data for now and wants to join again later, they'll have an existing username and password, but won't be able to see their old submissions or profile data
