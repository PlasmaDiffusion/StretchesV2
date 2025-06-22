# Front End

# Building Project

## For a dev build (windows):
$env:APP_VARIANT="dev"; eas build --profile development --platform android
$

## For a prod build (windows):
$env:APP_VARIANT="prod"; eas build --profile production --platform android
$

## For a dev build (mac):
APP_VARIANT=dev eas build --profile development --platform android

# Running Project
> npm install

> npm run start


(Make an expo dev build and install it on your phone. Expo Go also works. Then run npm install, then npm run start.)