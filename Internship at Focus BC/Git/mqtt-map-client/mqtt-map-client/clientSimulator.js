var vehicleSensors = new window.EventSource('http://localhost:8080/subscribe')


var arrayOfMarkers = []
var btn = document.createElement("button")
btn.id = ("hideInformationButton") 


function initMap()
{
    //Map creation
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 38.752659, lng: -9.220398 },
        zoom: 12,
        //Map style
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "geometry.stroke", stylers: [{ color: "#33f363" }]},
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#ffff82" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffff82" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ visibility: "off" }],
            }, 
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#2adbcc" }],
            }, 
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#2adbcc" }],
            }, 
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ visibility: "off" }],
            },
            {
                featureType: "road.highway",
                elementType: "labels",
                stylers:[{visibility: "off"}]}, //turns off highway labels
            {
                featureType: "road.arterial",
                elementType: "labels",
                stylers: [{visibility: "off"}]}, //turns off arterial roads labels
            {
                featureType: "transit",
                elementType: "labels.text.fill",
                stylers: [{ visibility: "off" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "water",
                elementType: "geometry.stroke",
                stylers: [{ color: "#f33333" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ visibility: "off" }],
            },
          ], 
    });

    //Message received
    vehicleSensors.addEventListener("message", (event) => {

        //console.log("Message received: " + event.data + "\n\n")

        if(!event || !event.data) return console.error("Empty event")

        console.log(event.data)
    
        var json = JSON.parse(event.data)
           
        checkMarker(json)
    })
    
    vehicleSensors.onerror = function(error)
    {
        console.log("ERROR")
    }

} 

//Check marker and add it to the map
function checkMarker(message)
{
    var isAlreadyInTheList = false
    let index = 0
    let marker
    let positionOfExistingMarker

    if(arrayOfMarkers.length === 0 )
    {
        marker = createMarker(message)
        arrayOfMarkers.push(marker)

        //print test 
        //console.log("Size: " + arrayOfMarkers.length)  
    }
    else
    {
        //print test 
        //console.log("Size: " + arrayOfMarkers.length)

        arrayOfMarkers.forEach(element => {

            //print test 
            //console.log(message.sensor_id + " = " + element.title)
            if(message.sensor_id == element.title)               
            {
                isAlreadyInTheList = true
                positionOfExistingMarker = index
            }
            index ++
        });

        //print test 
        //console.log(isAlreadyInTheList)

        if(isAlreadyInTheList == false)
        {
            marker = createMarker(message)
            arrayOfMarkers.push(marker)
        }
        else
        {
            marker = arrayOfMarkers[positionOfExistingMarker]
            marker.setMap(null)
            arrayOfMarkers[positionOfExistingMarker] = createMarker(message)
        }         
    }
} 


//Create Marker
function createMarker(message)
{
        const pos = { lat: message.location.coordinates[0][1], lng: message.location.coordinates[0][0] }

        const contentString = JSON.stringify(message)
        
        const infowindow = new google.maps.InfoWindow({
            content: contentString,
        });

        const marker = new google.maps.Marker({
            position: pos,
            title: message.sensor_id,
        });

        marker.setMap(map)

        marker.addListener("click", () => {

            if(document.fullscreenElement){
                document.exitFullscreen();
            }
            
            document.getElementById("sensorInformation").textContent = ""

            //document.getElementById("sensorInformation").style.borderColor = "rgb(51, 243, 99)"
            
            document.getElementById("map").style.height = "50%"
            sensorInformationTable(message)

            createHidenButton()
            
            btn.addEventListener("click", () =>
            {
                hideInformation()
            })
        });


        return marker
}

function sensorInformationTable(message)
{
    var table = document.createElement("table")

    console.log("Message received: \n")
    for(i in message)
    {
        var tr = document.createElement("tr")
        var td = document.createElement("td")
        var td2 = document.createElement("td")

        //Style
        td.style.fontWeight = "bold"

        if(typeof message[i] === "object")
        {
            for(j in message[i])
            {
                var td3 = document.createElement("td")
                var td4 = document.createElement("td")
                var tr2 = document.createElement("tr")

                //Style
                td3.style.fontWeight = "bold"

                td3.appendChild(document.createTextNode(j + ":"))
                td4.appendChild(document.createTextNode(message[i][j]))

                console.log(j + ": " + message[i][j])

                tr2.appendChild(td3)
                tr2.appendChild(td4)
                table.appendChild(tr2)
            }
        }
        else{
            td.appendChild(document.createTextNode(i + ":"))
            td2.appendChild(document.createTextNode(message[i]))

            console.log(i + ": " + message[i])

            tr.appendChild(td)
            tr.appendChild(td2)
            table.appendChild(tr)
        }
    }

    document.getElementById("sensorInformation").appendChild(table)
    console.log("\n")
}

function createHidenButton()
{
    btn.innerHTML = "Hide Information"
    document.getElementById("sensorInformation").appendChild(btn)
}

function hideInformation()
{

    document.getElementById("map").style.height = "90%"
    document.getElementById("sensorInformation").textContent = ""

}

//remove all markers from the map
function deleteAllSensors()
{
    hideInformation()

    for (let i = 0; i < arrayOfMarkers.length; i++) {
        arrayOfMarkers[i].setMap(null)
    }
    //arrayOfMarkers = []
}
