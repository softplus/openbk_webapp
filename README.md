# OpenBekenIOT Web App

This repo publishes a simple javascript webb app to

https://openbekeniot.github.io/webapp/

The code is in the gh-pages branch!


The web app is initiated by a very simple webpage on the device at http://(IP)/app

The address the device redirects to defaults to this repo, but there is a configuration on the dveice, so you can host locally on your LAN for more security, or even from the device itself (via the device filesystem if present).

The app root page loads startup.js, which then loads VueJS and a SFC myComponent.vue, which is the guts of the web app.  Each page of the app is a separate SFC vuejs control.

Features include OTA, device filesystem management, device configuration, logging, etc.


## Device Database

The webApp now supports client device database. 

Each device entry consists of the following **required** fields:

* vendor: Vendor
* name: Device name
* chip: Chipset
* pins: Pin configuration mapping. The pin value can be *PinRole;channel* or *PinRole;channel;secondChannel*
* image: Main image
* wiki: Wiki url

And these **optional** fields:
* model: Device model
* board: Board
* product: Product url
* urls: Reference urls
* gallery: Gallery urls
* flag: Device flag (see [new_pins.h](https://github.com/openshwprojects/OpenBK7231T_App/blob/4fd6a292d52146fa493f0a0d7c7069333cd12e5f/src/new_pins.h))
* command: Startup command passed to `CFG_SetShortStartupCommand_AndExecuteNow`
* keywords: Keywords

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
    "vendor": "CasaLife",
    "name": "CCT LED Downlight",
    "model": "SMART-AL2017-TGTS",
    "chip": "BK7231T",
    "pins": {
      "7": "PWM;0",
      "8": "PWM;1"
    },
    "image": "https://obrazki.elektroda.pl/4181235400_1659263189.jpg",
    "wiki": "https://www.elektroda.com/rtvforum/viewtopic.php?p=20123466#20123466",
    "flag": 3
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
            window.root = '';
            window.device = 'http://192.168.1.176';
        </script>
        <script src="startup.js"></script>
```

The site content can be served through many ways including [nodejs](https://nodejs.org/en/).

* Install [serve node](https://www.npmjs.com/package/serve)
* Invoke `serve -l 80` from terminal
* Navigate to `http://localhost/indexlocal`

The web app page will fetch data from your test device.


## device.json
If you are using VSCode and plan on editing `devices.json`, then it can be validated against `schema.json` by adding this to your settings.

```
"json.schemas": [

        {
            "fileMatch": [
                "/devices.json"
            ],
            "url": "./schema.json"
        } 
    ]
```