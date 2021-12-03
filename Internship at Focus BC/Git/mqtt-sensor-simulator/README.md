# **MAPIFY MQTT Sensor Simulator** #

This README would normally document whatever steps are necessary to get your application up and running.

## **Requirements** ##

- [NodeJS](https://nodejs.org/en/)

<br>

### **Setup** ####

<br>

- git checkout develop

- git pull

<br>

### **Instructions** ###

<br>

(type this command if you need help)
- node mqtt-simulator --help

--------------------------------

- node mqtt-simulator ./configuration.json 100 10 1000

(configuration.json - configuration file)
(100 - send 100 messages)
(10 send one message each 10 seconds)
(1000 - maximum step distance)

#### **Input parameters:** ####

- configuration file: ./configuration.json 
- Number of messages: 100
- Interval: 10
- Maximum Step Distance in meters: 1000 

<br>

#### **Configuration file** ####

<br>

dynamic - $$(type) value $$

types:

- n (Interval of numbers);

- m (Array of numbers); 

- s (Array of Strings);

- c (Bounding Box);

- b (Boolean);

- d (Distance).

- i (Identification of Sensor)


<br>

    {
    "sensorMessage":
    {
        "sensor_id": "Sensor2",
        "vehicleType": "$$s [Car,Truck,Bus,Motorcycle,Bicycle] $$",
        "driver": "$$s [Mario,Fabio,Sandro,Rui,Vasco] $$",
        "temperature": "$$n [-10,100] $$",
        "voltage": "$$n [0,20] $$",
        "location":
        {
            "type": "MultiPoint",
            "coordinates": "[$$c [38.712672, 38.795403, -9.369619, -9.124143] $$]"
        }                       
    },

    "mqttBroker":
    {
        "username": "a883a1da-d7bd-4403-8ea1-95f25f9864a4",
        "password": "ae33f128ce27f4efb811425fa2e4b97bbf0ce7b2dde51d4263e79a3f5b51f957",
        "topic": "a883a1da-d7bd-4403-8ea1-95f25f9864a4/Car-Sensors",
        "url": "mqtt://broker-qa.mapify.ai",
        "port": "1883"
    }
}


<br>

### **Find Bugs** ###

<br>

- If you are a developer and open the code to fix a bug, press CTRL+F and type "Bug" to find it.




