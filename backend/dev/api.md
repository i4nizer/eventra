*Preview: Ctrl+K V*

##### Notes
 - Expect string for any error in the api response.
 - Expect object for success.

---
*You may use REST Client VSCode extension.*

| Route                                         | Method  | Request                                  | Notes                                 | Response                              |
| --------------------------------------------- | ------- | ---------------------------------------- | ------------------------------------- | ------------------------------------- |
| /auth                                         |         |                                          |                                       |                                       |
| ↳/sign-up                                     | post    | name, email, password                    |                                       | *user object without password*        |
| ↳/sign-in                                     | post    | email, password                          |                                       | *auth token*                          |
| ↳/sign-out                                    | post    |                                          | *remove auth header*                  |                                       |
| /section                                      |         |                                          |                                       |                                       |
| ↳/                                            | get     |                                          | *pagination applied*                  | *array of section object*             |
| ↳/                                            | post    | name, year                               | *create section*                      | *section object*                      |
| ↳/:secid                                      | get     |                                          |                                       | *section object*                      |
| ↳/:secid                                      | patch   | name?, year?                             | *update section*                      | *section object*                      |
| ↳/:secid                                      | delete  |                                          | *delete section*                      |                                       |
| ↳/student                                     | get     |                                          | *pagination applied*                  | *array of student object*             |
| /section/:secid/student                       |         |                                          |                                       |                                       |
| ↳/                                            | get     |                                          | *pagination applied*                  | *array of student object*             |
| ↳/                                            | post    | sid, rfid, name, email, photo            | *create student*                      | *student object*                      |
| ↳/:stuid                                      | get     |                                          |                                       | *student object*                      |
| ↳/:stuid                                      | patch   | *?: sid, rfid, name, email, photo        | *update student*                      | *student object*                      |
| ↳/:stuid                                      | delete  |                                          | *delete student*                      |                                       |
| ↳/:stuid/balance                              | get     |                                          | *calculates balance*                  | *{ balance: # }*                      |
| /activity                                     |         |                                          |                                       |                                       |
| ↳/                                            | get     |                                          | *pagination applied*                  | *array of activity object*            |
| ↳/                                            | post    | name, description, startAt, finishAt     | *create activity*                     | *activity object*                     |
| ↳/entry                                       | get     |                                          |                                       | *array of activity object*            |
| ↳/:actid                                      | get     |                                          |                                       | *activity object*                     |
| ↳/:actid                                      | patch   | *?: name, description, startAt, finishAt | *update activity*                     | *activity object*                     |
| ↳/:actid                                      | delete  |                                          | *delete activity*                     |                                       |
| /activity/:actid/entry                        |         |                                          |                                       |                                       |
| ↳/                                            | get     |                                          | *pagination applied*                  | *array of entry object*               |
| ↳/                                            | post    | startAt, finishAt                        | *create entry*                        | *entry object*                        |
| ↳/:entid                                      | get     |                                          |                                       | *entry object*                        |
| ↳/:entid                                      | patch   | *?: startAt, finishAt                    | *update entry*                        | *entry object*                        |
| ↳/:entid                                      | delete  |                                          | *delete entry*                        |                                       |
| /activity/:actid/section                      |         |                                          |                                       |                                       |
| ↳/                                            | get     |                                          | *pagination applied*                  | *array of activity-section object*    |
| ↳/section/:secid                              | post    |                                          | *create activity-section*             | *activity-section object*             |
| ↳/:aseid                                      | get     |                                          |                                       | *activity-section object*             |
| ↳/:aseid                                      | delete  |                                          | *delete activity-section*             |                                       |
| ↳/:aseid/section/:secid                       | get     |                                          |                                       | *activity-section object*             |
| ↳/:aseid/section/:secid                       | patch   |                                          | *update activity-section*             | *activity-section object*             |
| ↳/:aseid/section/:secid                       | delete  |                                          | *delete activity-section*             |                                       |
| /attendance                                   |         |                                          |                                       |                                       |
| ↳/                                            | get     |                                          | *pagination applied*                  | *array of attendance object*          |
| ↳/:attid                                      | get     |                                          |                                       | *attendance object*                   |
| ↳/student/:stuid                              | get     |                                          | *pagination applied*                  | *array of attendance object*          |
| ↳/activity-entry/:entid                       | get     |                                          | *pagination applied*                  | *array of attendance object*          |
| ↳/student/:stuid/activity-entry/:entid        | get     |                                          | *pagination applied*                  | *array of attendance object*          |
| ↳/student/:stuid/activity-entry/:entid        | post    |                                          | *create attendance*                   | *attendance object*                   |
| ↳/:attid/student/:stuid/activity-entry/:entid | get     |                                          |                                       | *attendance object*                   |
| /violation                                    |         |                                          |                                       |                                       |
| ↳/                                            | get     |                                          | *pagination applied*                  | *array of violation object*           |
| ↳/:attid                                      | get     |                                          |                                       | *violation object*                    |
| ↳/student/:stuid                              | get     |                                          | *pagination applied*                  | *array of violation object*           |
| ↳/activity-entry/:entid                       | get     |                                          | *pagination applied*                  | *array of violation object*           |
| ↳/student/:stuid/activity-entry/:entid        | get     |                                          | *pagination applied*                  | *array of violation object*           |
| ↳/:attid/student/:stuid/activity-entry/:entid | get     |                                          |                                       | *violation object*                    |
| /payment                                      |         |                                          |                                       |                                       |
| ↳/                                            | get     |                                          | *pagination applied*                  | *array of payment object*             |
| ↳/:payid                                      | get     |                                          |                                       | *payment object*                      |
| ↳/:payid                                      | patch   | value?, remarks?                         | *update payment*                      | *payment object*                      |
| ↳/:payid                                      | delete  |                                          | *delete payment*                      | *payment object*                      |
| ↳/student/:vioid                              | get     |                                          | *pagination applied*                  | *array of payment object*             |
| ↳/student/:vioid                              | post    | value, remarks?                          | *create payment*                      | *payment object*             |
