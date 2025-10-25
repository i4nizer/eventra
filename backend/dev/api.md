*Preview: Ctrl+K V*

##### Notes
 - Expect string for any error in the api response.
 - Expect object for success.

---
*You may use REST Client VSCode extension.*

| Route                               | Method  | Request                                  | Notes                                 | Response                              |
| ----------------------------------- | ------- | ---------------------------------------- | ------------------------------------- | ------------------------------------- |
| /auth                               |         |                                          |                                       |                                       |
| ↳/sign-up                           | post    | name, email, password                    |                                       | *user object without password*        |
| ↳/sign-in                           | post    | email, password                          | *set access cookie*                   | *user object without password*        |
| ↳/sign-out                          | post    |                                          | *delete access cookie*                |                                       |
| /section                            |         |                                          |                                       |                                       |
| ↳/                                  | get     |                                          | *pagination applied*                  | *array of section object*             |
| ↳/                                  | post    | name, year                               | *create section*                      | *section object*                      |
| ↳/:secid                            | get     |                                          |                                       | *section object*                      |
| ↳/:secid                            | patch   | name?, year?                             | *update section*                      | *section object*                      |
| ↳/:secid                            | delete  |                                          | *delete section*                      |                                       |
| /section/:secid/student             |         |                                          |                                       |                                       |
| ↳/                                  | get     |                                          | *pagination applied*                  | *array of student object*             |
| ↳/                                  | post    | sid, rfid, name, email, photo            | *create student*                      | *student object*                      |
| ↳/:stuid                            | get     |                                          |                                       | *student object*                      |
| ↳/:stuid                            | patch   | *?: sid, rfid, name, email, photo        | *update student*                      | *student object*                      |
| ↳/:stuid                            | delete  |                                          | *delete student*                      |                                       |
| /activity                           |         |                                          |                                       |                                       |
| ↳/                                  | get     |                                          | *pagination applied*                  | *array of activity object*            |
| ↳/                                  | post    | name, description, startAt, finishAt     | *create activity*                     | *activity object*                     |
| ↳/:actid                            | get     |                                          |                                       | *activity object*                     |
| ↳/:actid                            | patch   | *?: name, description, startAt, finishAt | *update activity*                     | *activity object*                     |
| ↳/:actid                            | delete  |                                          | *delete activity*                     |                                       |
| /activity/:actid/entry              |         |                                          |                                       |                                       |
| ↳/                                  | get     |                                          | *pagination applied*                  | *array of entry object*               |
| ↳/                                  | post    | startAt, finishAt                        | *create entry*                        | *entry object*                        |
| ↳/:entid                            | get     |                                          |                                       | *entry object*                        |
| ↳/:entid                            | patch   | *?: startAt, finishAt                    | *update entry*                        | *entry object*                        |
| ↳/:entid                            | delete  |                                          | *delete entry*                        |                                       |
