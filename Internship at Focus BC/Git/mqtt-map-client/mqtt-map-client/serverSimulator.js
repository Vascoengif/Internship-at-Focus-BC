var express = require('express')
var uuid =  require('uuid').v4 
var app = express()

var message
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
        console.log(`Client: ${id} Closed browser/tab\n`);
        connectedClients = connectedClients.filter((client) => client.id !== id)
    })

    
})

app.post('/message', function(req, res)
{
    message = req.body

    console.log("Got Body: ", message)

    connectedClients.forEach(element => {
        element.res.write("data: " + JSON.stringify(message) + "\n\n")
    })

})

app.listen(8080, () => console.log("Started server at http://localhost:8080/subscribe"))

//print test: curl used
//curl -H "Content-Type: application/json" -d '{"sensor_id":  "Sensor2" , "vehicleType":  "Bus" , "driver":  "Rui" , "speed":  57 , "temperature":  53 , "maxTemperature":  37 , "voltage":  6 , "location":{"type":"Point","coordinates":[ [ -9.39493207455151,38.76157976339397 ] ],"distance":  286.4091285085375  }}' -X POST http://35.205.213.181:8080/message


function addSubscriberClient(client)
{

    connectedClients.push(client)
}