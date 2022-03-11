# is-recycling-this-week
a little app to help answer the question of whether to put out recycling this week for Baltimore City residents.

## TODO
- initialize Vue
- MD iMap Geocoder
- pull down A-B weeks GeoJSON
- turf js intersect or vanilla intersect?
- geocode de-bounce cookie?


## Geocoder
This all works because of the geocoder. This one uses the MD iMap Geocoder service
- https://imap.maryland.gov/pages/composite-locator
- https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocator/GeocodeServer/findAddressCandidates


## Baltimore DPW Recycling A/B Week Map 
Baltimore DPWs Recycling A/B Week Map is a available as an AGO app: https://baltimoredpw.maps.arcgis.com/apps/webappviewer/index.html?id=0036eb5707d6445fb3a5fef4565c3799
https://publicworks.baltimorecity.gov/collectionupdate

## Point in Polygon
https://www.npmjs.com/package/@turf/boolean-point-in-polygon