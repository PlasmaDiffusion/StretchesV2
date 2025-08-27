# FRONT END
==========

This is an app for listing and timing your own custom stretches / exercises. It also has a daily log tracking for what stretches you did and for how long.
Additionally the logging is used for chronic pain, letting you log how in pain you were each day or how you felt mentally.

# Building Project

## For a dev build (windows):
$env:APP_VARIANT="dev"; eas build --profile development --platform android
$

## For a prod build (windows):
$env:APP_VARIANT="prod"; eas build --profile production --platform android
$

## For a dev build (mac):
APP_VARIANT=dev eas build --profile development --platform android

## For a prod build (mac):
APP_VARIANT=prod eas build --profile production --platform android

# Running Project
> npm install

> npm run start

(Make an expo dev build and install it on your phone. Expo Go also works. Then run npm install, then npm run start.)

# Other Commands
> npm run lint

# BACK END
=========

It is planned this project will have a backend that lets you save stretch and log data to the cloud rather than save locally.
