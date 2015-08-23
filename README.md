# Checkin Script

This script allows for members of any organization to check-in to meetings or events.

## Setup

You will need a configuration file called `default.json` in a config folder to connect to a database. The file needs to have the following format:

```
{
  "db": {
    "user": "",
    "password": "",
    "hostname": "",
    "port": "",
    "dbname": "",
    "memberscollection": "",
    "eventscollection": ""
  }
}

```

## Usage

Set up a MongoDB server where the keys in a collection consist of `name` and `id`. Enter all of your members into the database.

Start the program with `npm start`. From there type `help` into the CLI to bring up a list of commands that you can use.

## License

[MIT License](https://github.com/jacksonchen/checkin/blob/master/LICENSE.md)
