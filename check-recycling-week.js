// check-recycling-week.js
import { ref } from "vue"
import RecyclingWeeksData from "./dpw-recycling-weeks.geojson" assert {type: 'json'}
import SampleData from "./sample-data.js"
export default {
    setup() {
        let recylingData = RecyclingWeeksData
        let message = ref('')
        let address = ref('')
        const testing = false
        const test_cond = "week_a"
        // const test_cond = "week_b"
        // const test_cond = "not_in_city"
        // const test_cond = "low_acc"
        // const test_cond = "no_candidates"
        if (testing) {
            console.log("in test mode")
            address = ref(SampleData[test_cond].address)
        }


        // recycling only T-F
        const weekInits = {
            "Week A": {
                "start": new Date("3/1/2022"),
                "stop": new Date("3/4/2022")
            },
            "Week B": {
                "start": new Date("3/8/2022"),
                "stop": new Date("3/11/2022")
            }
        }

        const geocoderURL = "https://geodata.md.gov/imap/rest/services/GeocodeServices/MD_CompositeLocator/GeocodeServer/findAddressCandidates"
        let payload = {
            "SingleLine": "",
            "f": "json",
            "outFields": "*",
            "outSR": 4326,
            "maxLocations": 2
        }
        function checkRecylingWeek() {
            if (address.value) {
                payload.SingleLine = address.value
                let params = new URLSearchParams(payload)
                let url = geocoderURL + "?" + params.toString()
                // unwrap this testing code for production
                if (testing){
                    parseCandidates(JSON.parse(SampleData[test_cond].response))
                } else {
                    fetch(url)
                        .then(response => response.json())
                        .then(data => parseCandidates(data))
                }
            } else {
                console.warn("no address provided")
                setMessage(`No address provided\nPlease try again`)
            }
        }

        function parseCandidates(data){
            // parse out candidates if any
            if (data.candidates?.length > 0){
                let first_candidate = data.candidates[0]
                if (first_candidate.attributes?.Score > 80) {
                    let week_feature = pointInPolygonWeek(first_candidate.location)
                    reportOnWeek(week_feature)
                } else {
                    console.warn("low accuracy geocode...")
                    setMessage(`We couldn't find that address\nPlease try again`)
                }
            } else {
                // prompt user to try again
                console.warn("No candidate data returned...")
                setMessage(`We couldn't find that address\nPlease try again`)
            }
        }
        function pointInPolygonWeek(location){
            // return the polygon week for a point or none
            let week_feature = null
            let pt = turf.point([location.x, location.y])
            for (let polyF = 0; polyF < recylingData.features.length; polyF++) {
                const weekPolygon = recylingData.features[polyF];
                let poly = {}
                if (weekPolygon.geometry.type == "Polygon") {
                    poly = turf.polygon(weekPolygon.geometry.coordinates)
                } else if (weekPolygon.geometry.type == "MultiPolygon") {
                    poly = turf.multiPolygon(weekPolygon.geometry.coordinates)
                }
                if (turf.booleanPointInPolygon(pt, poly)) {
                    week_feature = weekPolygon
                }
            }
            return week_feature
        }

        function reportOnWeek(week_feature) {
            // update the display for the users week relative to today
            if (week_feature) {
                let week = week_feature.properties?.['Week']
                let weekInit = weekInits[week]
                let today = new Date()
                setMessage(`You are on ${week} for Recycling`)
                nextRecyclingWeek(today, weekInit)
            } else {
                // user may not be in the City
                setMessage(`Looks like you may not live in Baltimore City\nMaybe you should: <a href="http://https://livebaltimore.com/">LiveBaltimore</a>`)
            }

        }

        function updateDaterange(target, start, stop, inc){
            // update the users initial week A/B date range to the current one
        }
        function nextRecyclingWeek(today, weekInit) {
            // get the next recycling block relative to today for a week
            /*
                1. get the next recycle week relative to the current day

            */
            if (today >= weekInit.start && today <= weekInit.stop ){
                console.log(today, weekInit.start, weekInit.stop)
                console.log("this IS your recycling week")
                if (today <= weekInit.stop) {
                    console.log("TODAY is your recyling day! You might have missed them!")
                }
            } else {
                console.log(today, weekInit.start, weekInit.stop)
                console.log("this IS NOT your recycling week")

            }
        }

        function setMessage(new_message){
            message.value = new_message
            document.getElementById("message").focus()
            document.getElementById("message").hidden = false

        }

        return {
            address,
            message,
            checkRecylingWeek
        }
    }
}