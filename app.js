//* Create Tile type based on id.
const createTileType = (type) => {
 return L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: `Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
        maxZoom: 18,
        id: type,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoiYnVuZWUiLCJhIjoiY2twMmMwaHp6MHlnZzJ1bnY3ajkyb2ZxdiJ9.MFhCgoXigWv6Kk_lUVLvIg"
    })
}

//* Map constants
const IPIFY_KEY = "at_lueevU07zkY9UoaiCSElmAzxpCrC6";
const satelliteView = createTileType("mapbox/satellite-v9");
const streetsView = createTileType("mapbox/streets-v11");
const myMap = L.map("map-id", {
    zoomControl: false,
});
const marker = L.icon({
    iconUrl: "images/icon-location.svg",
});
let baseMaps = {
    "Satellite View": satelliteView,
    "Streets View": streetsView
}


//* Get element by id (unnecessary)
const selectDOM = (id) => {
    return document.getElementById(id); 
}

//* DOM Elements
const searchInput = selectDOM("trace-ip");
const searchBtn = selectDOM("search-btn");
const hudIP = selectDOM("ip-address");
const hudLocation = selectDOM("location");
const hudTimeZone = selectDOM("timezone");
const hudISP = selectDOM("isp");
const loader = document.querySelector(".loader-container");

//* Variables
let IP = "";
let IPIFY_API = `https://geo.ipify.org/api/v1?apiKey=${IPIFY_KEY}&ipAddress=`;
let ipRegEx = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;



//* Search button Event listener
searchBtn.addEventListener("click", () => {
    IP = searchInput.value;
    displayContent(IP);
    searchInput.value = ""; // Resests input value
})

//* Window load Event Listener
window.addEventListener("load", () => {
    displayContent(IP); // Display users location onload
    console.log("(\\ /)\n(0_0) Coded this."); 
})


//* Get location details 
const getLocation = async (api) => {
    try {
        const {
            data: {
                location
            }
        } = await axios.get(api);
        return location;
    } catch (error) {
        throw new Error(error);
    }
}

//*Get ISP name 
const getISP = async (api) => {
    try {
        const {
            data: {
                isp
            }
        } = await axios.get(api);
        return isp;
    } catch (error) {
        throw new Error(error);
    }
}

//*Get IP address 
const getIP = async (api) => {
    try {
        const {
            data: {
                ip
            }
        } = await axios.get(api);
        return ip;
    } catch (error) {
        throw new Error(error);
    }
}

//* Loader status 
const loaderStatus = status => {
    loader.style.display = status;
    loader.classList.toggle("overlay");
}

//* Input Validation 
const isValidIP = str => {
    if ((ipRegEx.test(str))) {
        if (str.split(".").every(el => +el >= 0 && +el <= 255)) return true;
    } else alert("The IP you Enterd is Invalid, Please Enter a valid IP");
}

//* Display all content 
const displayContent = (inp) => {
    if (inp === "" || isValidIP(inp)) {
        loaderStatus("block"); // Display loader overlay
        let IP_DATA = IPIFY_API + inp;

        (async () => {
            try {
                let [IP, locationObj, ISP] = await Promise.all([getIP(IP_DATA), getLocation(IP_DATA), getISP(IP_DATA)]);
                mapInit(locationObj.lat, locationObj.lng);
                hudCard(IP, `${locationObj.city}, ${locationObj.region} ${locationObj.postalCode}`, `UTC${locationObj.timezone}`, ISP);
            } catch (error) {
                throw new Error(error);
            }
        })(); // IIAFE

    }
}

//*Change HUD  content 
const hudCard = (ip, location, timezone, isp) => {
    hudIP.innerHTML = ip;
    hudLocation.innerHTML = location;
    hudTimeZone.innerHTML = timezone;
    hudISP.innerHTML = isp;
}

//* Set the map view 
const mapInit = (gpsLat, gpsLng) => {

    myMap.setView([gpsLat, gpsLng], 14)

    streetsView.addTo(myMap);

    L.marker([gpsLat, gpsLng], {
        icon: marker
    }).addTo(myMap);

    loaderStatus("none"); // Remove loader overlay
}
L.control.zoom({ position: "bottomright" }).addTo(myMap); //* Zoom Control
L.control.layers(baseMaps, null, { position: "bottomright" }).addTo(myMap); //* Layer Control






