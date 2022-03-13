// check-recycling-week.js
let CheckRecyclingWeek = {
    setup() {
        let message = Vue.ref('')
        let address = Vue.ref('')

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
                fetch(url)
                    .then(response => response.json())
                    .then(data => parseCandidates(data))
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
                let today = new Date().setHours(0,0,0,0)
                let recycling_week = nextRecyclingWeek(today, weekInit)
                let message = `<strong>This ${recycling_week.this_week ? "IS" : "IS NOT"} your reycling week!</strong>`
                message += `\nYou are on <strong>${week}</strong> for Recycling`
                message += `\nRegular recycling is:\n<strong>${recycling_week.dates.start.toDateString()}</strong> to <strong>${recycling_week.dates.stop.toDateString()}</strong>`
                message += `\nLearn more about the City's recycling at\n <a href="https://publicworks.baltimorecity.gov/collectionupdate">DPW's Collection Updates site</a> `
                setMessage(message)
            } else {
                // user may not be in the City
                setMessage(`Looks like you may not live in Baltimore City\nMaybe you should: <a href="https://livebaltimore.com/">LiveBaltimore</a>`)
            }
        }

        function addDays(date, days) {
            // add integer days to a date and return date
            let result = new Date(date)
            result.setDate(result.getDate() + days)
            return result
        }
        function updateDaterange(target, weekInit, inc){
            // update the users initial week A/B date range to the current one
            //tries to account for saturdays since technically there can be a saturday makeup in your week
            while (target > addDays(weekInit.stop, 1)) {
                weekInit.start = addDays(weekInit.start, inc)
                weekInit.stop = addDays(weekInit.stop, inc)
            }
            return weekInit
        }
        function nextRecyclingWeek(today, weekInit) {
            // get the next recycling block relative to today for a week
            let recycling_week = {
                "this_week": false, 
                "dates": {}
            }
           recycling_week.dates = updateDaterange(today, weekInit, 14)
           let sunday = addDays(recycling_week.dates.start, -2)
           let saturday = addDays(recycling_week.dates.stop, 1)
            if (today >= sunday && today <= saturday ){
                recycling_week.this_week = true
            } else {
                recycling_week.this_week = false
            }
            return recycling_week
        }

        function checkForRemember() {
            // check for the users remembered address
            const rmCheck = document.getElementById("rememberMe")
            if (localStorage.address && localStorage.address !== "") {
                rmCheck.setAttribute("checked", "checked")
                address.value = localStorage.address
            } else {
                rmCheck.removeAttribute("checked")
                address.value = ""
            }
        }

        function lsRememberMe(){
            // use localstorage to remember the users information
            const rmCheck = document.getElementById("rememberMe")
            if (rmCheck.checked && rmCheck.value !== ""){
                localStorage.address = address.value
                localStorage.checked = rmCheck.value
            } else {
                localStorage.address = ""
                localStorage.checked = ""
            }
        }
        function setMessage(new_message){
            // helper to update the message box
            message.value = new_message
            document.getElementById("message").focus()
            document.getElementById("message").hidden = false

        }

        return {
            address,
            message,
            checkRecylingWeek,
            lsRememberMe,
            checkForRemember
        }
    },
    mounted(){
        this.checkForRemember()
    }
}
