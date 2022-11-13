# Instructions

Commands:

```
npm start
flask --app riot_buddy run
```

http://127.0.0.1:3000/

## Riot Buddy API spec

- [x] POST /api/v1/create-account
  - description:
    - used to create the users account on initial signup
  - request:
    - string: email
    - string: username
    - string: password
  - response:
    - string: error (empty if no error)
    - (header) session cookie

- [x] GET /api/v1/login
  - description:
    - used to login to account with given username and password
  - request:
    - string: username
    - string: password
  - response:
    - string: error (empty if no error)
    - (header) session cookie

- [x] GET /api/v1/logout
  - description:
    - used to log the user out, revoking their access
  - request:
    - (header) session cookie
  - response:
    - OK

- [x] GET /api/v1/whoami
  - description
    - used to show the current users username, from their session
  - request:
    - (header) session cookie
  - response:
    - string: username

- [x] POST /api/v1/profile
  - description:
    - used to create the users profile
  - request:
    - (header) session cookie
    - string: name
    - string: bio
    - string: pronouns
    - integer: age
    - integer: photo id (optional)
    - integer: competitiveness (1-10)
  - response:
    - string: error (empty if no error)

- [x] GET /api/v1/profile
  - description:
    - used to retrieve another users profile. if no id is specified, retrieve the users own profile
  - request:
    - (header) session cookie
    - (argument) integer: id
  - response: 
    - string: name
    - string: bio
    - string: pronouns
    - integer: age
    - integer: photo id (may be empty)
    - integer: competitiveness (1-10)

- [x] PUT /api/v1/profile
  - description:
    - used to edit the users profile
  - request: 
    - (header) session cookie
    - string: name
    - string: bio
    - string: pronouns
    - integer: age
    - integer: photo id
    - integer: competitiveness (1-10)
  - response:
    - string: error (empty if no error)

