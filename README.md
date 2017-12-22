# Riot API Challenge 2017
Our submission for the Riot API challenge 2017. Actual name TBD.

## Server Developers

### Setup

1. Install [PostgreSQL](https://www.postgresql.org/download/).
2. Open a terminal window in the `server` directory.
3. Install npm dependencies:
    ```
    npm install
    ```
4. Set the postgres username/password:
    ```
    npm run pg-cred -- -u "username" -p "password"
    ```

### Run the server

```
npm start
# or, if you want to attach a debugger:
npm run debug
```

### Before you commit

```
npm run lint
```
