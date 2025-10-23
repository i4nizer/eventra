*Preview: Ctrl+K V*

##### Notes
 - Expect string for any error in the api response.
 - Expect object for success.

---
*You may use REST Client VSCode extension.*

| Route                               | Method  | Request                               | Notes                                 | Response                              |
| ----------------------------------- | ------- | ------------------------------------- | ------------------------------------- | ------------------------------------- |
| /auth                               |         |                                       |                                       |                                       |
| ↳/sign-up                           | post    | name, email, password                 |                                       | *user object without password*        |
| ↳/sign-in                           | post    | email, password                       | *+ access cookie*                     | *user object without password*        |
| ↳/sign-out                          | post    |                                       | *- access cookie*                     |                                       |
| /section                            |         |                                       |                                       |                                       |
| ↳/                                  | get     |                                       | *pagination applied*                  | *array of section object*             |
| ↳/                                  | post    | name, year                            | *create section*                      | *section object*                      |
| ↳/:secid                            | get     |                                       |                                       | *section object*                      |
| ↳/:secid                            | patch   | name?, year?                          | *update section*                      | *section object*                      |
| ↳/:secid                            | delete  |                                       | *delete section*                      |                                       |
