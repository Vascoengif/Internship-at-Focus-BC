var express = require('express')
var uuid =  require('uuid').v4 
var app = express()

//var message
var id
var connectedClients = []

app.use((req, res, next) => 
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.raw())
app.use(express.text())

app.get('/status', function(req, res)
{
    res.write("Current subscribers: " + connectedClients.length)
    res.end()
})

app.get('/subscribe', function(req, res)
{
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.write("\n")
    id = uuid()

    const client = {
        id,
        res,
    }

    addSubscriberClient(client)

    res.write("You are subscribed\n")

    console.log(`Client connected: ${id}`);

    req.on("close", () => 
    {
        console.log(`Client disconnected (Closed browser): ${id}\n`);
        connectedClients = connectedClients.filter((client) => client.id !== id)
    })

    
})

app.get("/unsubscribe", function(req, res)
{

    connectedClients.forEach(element => {
        res.write("Client disconnected: " + element.id + "\n")
    })

    connectedClients = []
    res.end()
    
})

app.post('/message', function(req, res)
{
    console.log("Text: " + req.text)
    console.log("Raw: " + req.raw)
    console.log("Body: " + req.body)

    let message = req.body

   // console.log("Got Body: ", message)
   // console.log("Stringify: " + JSON.stringify(message))
    let sub = JSON.stringify(message)
    let m = sub.substring(1, sub.length - 4)
   // console.log("m: " + m + "\n")
    let arr = m.split("coordinates")
   // console.log(arr)
    sub2 = arr[1].substring(4,arr[1].length)
   // console.log(sub2)
    sub3 = arr[1].substring(0,3)
    sub2 = "[[ ".concat(sub2)
    arr[1]  = sub3.concat(sub2)
    m = arr.join("coordinates")
    m = m.substring(0, m.length - 4)
    m = m.concat("]] } }\"")
    //let ini = m.substring(0, 68)
    //console.log(ini)
    //let fm = ini.concat("[[-9.337494825017,38.715897080791]] } }\"")
    //console.log(fm)
    console.log(m + "\n\n")
    connectedClients.forEach(element => {
        element.res.write("data: " + m + "\n\n")
    })

})

app.listen(8080, () => console.log("Started server at http://35.205.213.181:8080/subscribe"))

//print test: curl used
//curl -H "Content-Type: application/json" -d '{"sensor_id":  "Sensor2" , "vehicleType":  "Bus" , "driver":  "Rui" , "speed":  57 , "temperature":  53 , "maxTemperature":  37 , "voltage":  6 , "location":{"type":"Point","coordinates":[ [ -9.39493207455151,38.76157976339397 ] ],"distance":  286.4091285085375  }}' -X POST http://35.205.213.181:8080/message


function addSubscriberClient(client)
{

    connectedClients.push(client)
}
