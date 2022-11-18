# Instructions

Setup:
```sh
# install javascript dependencies:
npm install
# install python dependencies:
pip install -r riot_buddy/requirements.txt
# install app package:
pip install -e riot_buddy
# create postgresql table:
createdb riot_buddy
# initialize and fill database tables:
python init-db.py
```

Run development:
```sh
npm start
flask --app riot_buddy --debug run
```
👉 http://127.0.0.1:3000/

Run production:
```sh
npm run build
flask --app riot_buddy run
```

👉 http://127.0.0.1:5000/

## Application Flow Model

![Flow Model](app.drawio.svg)

## Database Schema (outdated)

![Database Model](database.png)

## API specification

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
    - integer: profile id
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

- [ ] PUT /api/v1/profile/photo
  - description:
    - used to overwrite the default profile picture with a user uploaded one
  - request:
    - (header) session cookie
    - (form data) file: photo
  - response
    - string: error (empty if no error)

- [ ] POST /api/v1/interact
  - description:
    - used to record if a user accepted or rejected a profile and check match status
  - request:
    - (header) session cookie
    - integer: profile id
    - bool: accepted
  - response:
    - string: error (empty if no error)
    - bool: match

- [ ] GET /api/v1/interact/next
  - description:
    - used to get the next profile id to interact with
  - request:
    - (header) session cookie
  - response:
    - string: error (empty if no error)
    - integer: profile id

- [ ] GET /api/v1/matches
  - description:
    - used to get a list of profile id's that the user has matched with
  - request:
    - (header) session cookie
  - response:
    - string: error (empty if no error)
    - integer[]: profile id
