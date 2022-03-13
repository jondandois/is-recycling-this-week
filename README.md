# is-recycling-this-week
I wrote this app to help me remember if this week is my recycling week based on Baltimore City DPW's bi-weekly recycling system.

I do not work for Baltimore City government or DPW and support our hard-working sanitation workers.

View this app here: https://jondandois.github.io/is-recycling-this-week/

## Sources

### Geocoder
This all works because of the geocoder which converts an address into a latitude, longitude coordinate. This one uses the MD iMap Geocoder service
- https://imap.maryland.gov/pages/composite-locator
- https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocator/GeocodeServer/findAddressCandidates

### Baltimore DPW Recycling A/B Week Map
Thanks to DPW's GIS department for their efforts in communicating about the City's recycling zones and schedule. DPW's Recycling A/B Week Map is savailable as an AGO app. I grabbed a copy of their Recycling A/B week map service and convered it into a GEOJSON to use locally in this app. 
- https://baltimoredpw.maps.arcgis.com/apps/webappviewer/index.html?id=0036eb5707d6445fb3a5fef4565c3799
- https://publicworks.baltimorecity.gov/collectionupdate

### App Build
- [VueJS](https://vuejs.org/) for the framework parts  
- [TurfJS](https://turfjs.org/) for the "spatial" parts of the app for checking if an address point is inside a Week A/B polygon.
- [This CodePen exmaple](https://codepen.io/AllThingsSmitty/pen/pOoeyz) for the "Remember Me" and `localStorage` bits
