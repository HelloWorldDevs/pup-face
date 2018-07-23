This is the read me from the original project. Look to the slack channel for install instructions for now.

# pup-face

A simple facebook example with Puppeteer:
https://github.com/GoogleChrome/puppeteer

It will login to facebook.

You can set `headless: true` if you don't want to launch a browser

# install

- Node.js v v10.1.0 tested

```
git clone https://github.com/zoutepopcorn/pup-face
```

```
cd pup-face
npm install
```

# set login

Fill in username and password in creds.rem.js

Save file as: creds.js

# run

```
node index
```

# Command Line Args

flags
-d query hashes for processing by date only
-k query hashes for processing by keyword only (only searches for one value as of now)
-dk query by both date and keyword (ORDER MATTERS, MUST BE -DK)

examples

node process.js -dk YYYY-MM-DD keywords (space separated for first last or 3 part names)

node process.js -d YYYY-MM-DD

node process.js -k keywords
