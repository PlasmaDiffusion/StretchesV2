# FRONT END
==========

This is an app for listing and timing your own custom stretches / exercises. It also has a daily log tracking for what stretches you did and for how long.
Additionally the logging is used for chronic pain, letting you log how in pain you were each day or how you felt mentally.

# Building Project

## For a dev build (windows):
$env:APP_VARIANT="dev"; eas build --profile development --platform android|ios
$

## For a prod build (windows):
$env:APP_VARIANT="prod"; eas build --profile production --platform android|ios
$

## For a dev build (mac):
APP_VARIANT=dev eas build --profile development --platform android|ios

## For a prod build (mac):
APP_VARIANT=prod eas build --profile production --platform android|ios

## Submitting to app store
eas submit -p ios

# Running Project
> npm install

> npm run start

(Make an expo dev build and install it on your phone. Expo Go also works. Then run npm install, then npm run start.)

# Other Commands
> npm run lint

# BACK END
=========

A backend that uses openAI for the user to ask any pain management and physiotherapy related questions, responding with recommendations (with the disclaimer that it's not a doctor or physiotherapist of course).

# Run Virtual Environment
. .venv/bin/activate

# Run app
python3 app.py 