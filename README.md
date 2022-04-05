# is-recycling-this-week
View this app here: https://jondandois.github.io/is-recycling-this-week/

I wrote this app to help me remember if this week is my recycling week based on Baltimore City DPW's bi-weekly recycling system.

I do not work for Baltimore City government or DPW. I support our hard-working sanitation workers.

I wrote this for fun. Refer to DPW's [Collection Updates site](https://publicworks.baltimorecity.gov/collectionupdate
) for all official information about recycling and waste collection.

## Privacy
I respect your privacy.  This app does not track you or your address.  This is what it does:
1. Takes the address you enter and sends it to the State of Maryland's "geocoder" service (see below) which will try to turn the address into a latitude, longitude GPS coordinate.
2. If it gets a GPS coordinate back from the State, it will check to see if it falls inside a local copy of Baltimore City DPWs Week A/B GIS Map.
3. Prints out a message depending on that result and today's date.
### Remember Me
The `Remember Me` checkbox does not track you and only stores information **on your own device** to save you from typing information in next time:
- It saves that you checked the box
- It saves the address you entered

## Sources

### Geocoder
This all works because of the geocoder which converts an address into a latitude, longitude coordinate. This one uses the MD iMap Geocoder service
- https://imap.maryland.gov/pages/composite-locator
- https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocator/GeocodeServer/findAddressCandidates

### Baltimore DPW Recycling A/B Week Map
Thanks to DPW's GIS department for their efforts in communicating about the City's recycling zones and schedule. DPW's Recycling A/B Week Map is available as an AGO app. I grabbed a copy of their Recycling A/B week map service and convered it into a GEOJSON to use locally in this app.
- https://baltimoredpw.maps.arcgis.com/apps/webappviewer/index.html?id=0036eb5707d6445fb3a5fef4565c3799
- https://publicworks.baltimorecity.gov/collectionupdate

### App Build
- [VueJS](https://vuejs.org/) for the framework parts
- [TurfJS](https://turfjs.org/) for the "spatial" parts of the app for checking if an address point is inside a Week A/B polygon.
- [This CodePen example](https://codepen.io/AllThingsSmitty/pen/pOoeyz) for the "Remember Me" and `localStorage` bits
