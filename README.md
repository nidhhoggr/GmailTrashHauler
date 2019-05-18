# Gmail Trash Hauler

* Are you tired of harrassing emails in your inbox?
* Is setting up a trash filter not enough?
* Do you dread the throught of a harrassing email sitting in your trash folder?

Behold the *Gmail Trash Hauler*...

### Copy over the config

```
cp config/config.sample.json config/config.json
```

Configure blocked addressed appropriatley and the scope. 

### Configure the labels

Scan your labels and configure accordingly. 

```
node index -l
```

```
{
  ...,
  "scannableLabels": ["labelId1","labelId2"]
}
```

---
Note: gmail API cannot delete message without full API privileges.

### Generate the oAuth token

```
node ./scripts/generateToken.js
```

This will create a token file in `./config/token.json`

---
Note: if you change the scope you must regenerate the token

### Purge that trash

```
DEBUG=gmail:* node index.js -x
```
