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
| submissions | /submissions/editors/:editor_id | GET         | INDEX     | Get all submissions for a writer                                 |
| editors     | /editors                        | GET         | INDEX     | Get all editors                                                  |
| editors     | /editors                        | GET       | SHOW   | Get data for a single editor profile  |
| editors     | /editors                        | POST        | CREATE    | Create a new editor (passes data from User Auth object as body)  |
| editors     | /editors                        | PUT         | UPDATE    | Update an editors profile information                            |
| writers     | /writers                        | POST        | CREATE    | Create a new writer (passes data from User Auth object as body)  |
