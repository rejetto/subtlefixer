# Subtle Fixer

Command-line utility to adjust multiple SRT files according to an offset you specify.

## Usage

    subtlefixer <offset-in-seconds> [<path>] [--overwrite]

## Installation

### Requirements

Node.js 6 or newer, but 14 is suggested because that's what I'm using.
https://nodejs.org/en/download/

Not sure what you have? Try running `node -v`

### Instructions

run `npm install -g subtlefixer`

From now on you should be able to execute `subtlefixer` from any folder you are in.

That's it. Check `Usage` section. 

## To do

* support wildcards to specify on what files to work, instead of whole folder
* --recursive
* --multiplier