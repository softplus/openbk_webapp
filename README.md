# OpenBekenIOT Web App

This repo publishes a simple javascript webb app to

https://openbekeniot.github.io/webapp/

The code is in the gh-pages branch!


The web app is initiated by a very simple webpage on the device at http://(IP)/app

The address the device redirects to defaults to this repo, but there is a configuration on the dveice, so you can host locally on your LAN for more security, or even from the device itself (via the device filesystem if present).

The app root page loads startup.js, which then loads VueJS and a SFC myComponent.vue, which is the guts of the web app.  Each page of the app is a separate SFC vuejs control.

Features include OTA, device filesystem management, device configuration, logging, etc.


## Device Database

The webApp now supports client device database. Each device entry consists of the following fields:

* vendor: (required) Vendor
* name: (required) Device name
* model: (optional) Model number
* chip: (required) Chipset
* board: (optional) Board
* pins: (required) Pin configuration. The pin value can be
    * PinRole;channel
    * PinRole;channel;secondChannel
* urls: (optional) Array of reference urls
* flag: (optional) Optional operation flag passed to `CFG_SetFlag`, possible values are `LED_RAWCHANNELSMODE`, `BTN_INSTANTTOUCH`.
* command: (optional) Value passed to `CFG_SetShortStartupCommand_AndExecuteNow`

Available pin roles:
* Relay
* Relay_n
* Button
* Button_n
* LED
* LED_n
* PWM
* WifiLED
* WifiLED_n
* Btn_Tgl_All
* Btn_Tgl_All_n
* dInput
* dInput_n
* TglChanOnTgl
* dInput_NoPullUp
* dInput_NoPullUp_n
* BL0937SEL
* BL0937CF
* BL0937CF1
* ADC
* SM2135DAT
* SM2135CLK

Sample:
```
  {
    "name": "CasaLife CCT LED Downlight SMART-AL2017-TGTS",
    "chip": "BK7231T",
    "pins": {
      "7": "PWM;0",
      "8": "PWM;1"
    },
    "urls": [
      "https://www.elektroda.com/rtvforum/viewtopic.php?p=20123466#20123466"
    ],
    "flag": "LED_RAWCHANNELSMODE"
  }
```

## User Interface
The new device selection interface will appear under `Config` tab if the device has been flashed with the supporting firmware version.

* `Chipset`: the device list is initially filtered by the current chipset
* `Device`: selecting a device will shows its details
* `Copy Device Pins`: copies over the pin configuration
* `Save Pins`: saves the pin configuration


# Development

Edit `indexlocal.html` to where `window.device` points at the test device.
```
        <script>
            window.root = '/beken/';
            window.device = 'http://192.168.1.176';
        </script>
        <script src="/beken/startup.js"></script>
```

The site content can be served through many ways including [nodejs](https://nodejs.org/en/).

* Install [serve node](https://www.npmjs.com/package/serve)
* Invoke `serve -l 80` from terminal
* Navigate to `http://localhost/indexlocal`

The web app page will fetch data from your test device.
