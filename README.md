# OpenBekenIOT Web App

This repo publishes a simple javascript webb app to

https://openbekeniot.github.io/webapp/

The code is in the gh-pages branch!


The web app is initiated by a very simple webpage on the device at http://(IP)/app

The address the device redirects to defaults to this repo, but there is a configuration on the dveice, so you can host locally on your LAN for more security, or even from the device itself (via the device filesystem if present).

The app root page loads startup.js, which then loads VueJS and a SFC myComponent.vue, which is the guts of the web app.  Each page of the app is a separate SFC vuejs control.

Features include OTA, device filesystem management, device configuration, logging, etc.
