# Checkin Script

This script allows for members of any organization to check-in to meetings.

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
    "collection": ""
  }
}

```

If you're on Fairview's NHS Leadership Team, please contact Jackson for the config file.

## Usage

Set up a MongoDB server where the keys in a collection consist of a `name`, `organization_id`, and `checkin` status.

Start the program with `npm start`. From there type `help` into the CLI will bring up a list of commands you can use.

## License

[MIT License](https://github.com/jacksonchen/checkin/blob/master/LICENSE.md)
