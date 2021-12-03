import { BoundingBox } from "./bounding-box"
import { Point } from "./point"
import * as consoleUtils from "./console"

export class ParameterReplacer {

    minLatitude: number
    maxLatitude: number
    maxLongitude: number
    minLongitude: number
    distance: number
    boundingbox: BoundingBox
    previousCoordinates: Point
    currentCoordinates: Point

    replaceAll(sensorName: string, parameterValue: string, messageIndex: number, maximumStepDistance?: number): any
    {
        
        //print test
        //console.log("----" + parameterValue.substring(0,2) + "----" + "\n\n")

        var parameter: string = parameterValue.substring(0,2)

        switch(parameter)
        {
                case "s ":
                    return this.replaceString(parameterValue)
                    
                case "m ":
                    return this.replaceArrayOfNumbers(parameterValue)
    
                case "b ":
                    return this.replaceBoolean()

                case "n ":
                    return this.replaceNumber(parameterValue)

                case "c ":
                    return this.replaceCoordinates(parameterValue, messageIndex, maximumStepDistance);;

                case "d ":
                    return this.replaceDistance(messageIndex)

                case "i ":
                    return this.replaceSensorName(sensorName)
                    
                default:
                    return this.takeOffQuotationMarks(parameterValue)
        }
    }




    replaceSensorName(sensorName: string): string
    {
        return "\"" + sensorName + "\""
    }


    replaceString(parameterValue: string): string
    {
        let sizeArray: number
        let index: number
        var tokenizedParameterValue: string[] = parameterValue.substring(3,parameterValue.length-2).split(",")
        sizeArray = tokenizedParameterValue.length
        
        index = Math.floor(Math.random() * (sizeArray));

        return "\"" + tokenizedParameterValue[index] + "\""
    }

    replaceArrayOfNumbers(parameterValue: string): number
    {
        let sizeArray: number
        let index: number

        var tokenizedParameterValue: string[] = parameterValue.substring(3,parameterValue.length-2).split(",")
        sizeArray = tokenizedParameterValue.length
        
        index = Math.floor(Math.random() * (sizeArray));

        return parseInt(tokenizedParameterValue[index],10)
    }

    replaceNumber(parameterValue: string): number
    {
        var tokenizedParameterValue: string[] = parameterValue.substring(3,parameterValue.length-2).split(",")

        var max: number = parseInt(tokenizedParameterValue[1], 10)
        var min: number = parseInt(tokenizedParameterValue[0], 10)

        var result: number = Math.floor(Math.random() * (max - min + 1) + min)

        return result
    }

    replaceBoolean(): boolean
    {
        let randomNumber: number

        randomNumber = Math.round(Math.floor(Math.random() * 2))

        if(randomNumber == 0)
        {
            return false
        }
        else
        {
            return true
        }
    }


    replaceCoordinates(parameterValue: string, messageIndex: number, maximumStepDistance: number): number[][]
    {  
        this.previousCoordinates = this.currentCoordinates

            if(messageIndex != 0)
            {
                //print test
                //console.log(this.boundingbox)
                try
                {
                    this.currentCoordinates = this.generateRandomPoint(this.boundingbox, this.previousCoordinates.getPoint(), maximumStepDistance)
                }
                catch(e)
                {
                    console.log(consoleUtils.showError(e))
                    process.exit(1)
                }
                
            }
            else
            {
                let tokenizedParameterValue = parameterValue.substring(3, parameterValue.length - 2).split(",");
                
                this.minLatitude  = parseFloat(tokenizedParameterValue[0])
                this.maxLatitude  = parseFloat(tokenizedParameterValue[1])
                this.minLongitude = parseFloat(tokenizedParameterValue[2])
                this.maxLongitude = parseFloat(tokenizedParameterValue[3])

                let bb = new BoundingBox(this.maxLatitude, this.minLatitude, this.maxLongitude, this.minLongitude)
                this.boundingbox = bb
                this.currentCoordinates = this.generateRandomPoint(bb) 
            }
            return new Array(this.currentCoordinates.getPoint());
    }



    takeOffQuotationMarks(parameterValue: string): string
    {
        
        if(parameterValue.substring(0,1) == "\"" && parameterValue.substring(1,2) != "}")
        {
            let ini = parameterValue.substring(0,1).replace("\"", ", ")
            parameterValue =  ini.concat(parameterValue.substr(2))
        }
        if(parameterValue.substring(0,1) == "\"" && parameterValue.substring(1,2) == "}")
        {
            let ini = parameterValue.substring(0,1).replace("\"", " ")
            parameterValue =  ini.concat(parameterValue.substr(1))
        } 
        if(parameterValue.substr(parameterValue.length - 1) == "\"")
        {
            let end = parameterValue.substr(parameterValue.length-1).replace("\"", " ")
            parameterValue = parameterValue.substring(0, parameterValue.length - 1).concat(end)
        }
        if(parameterValue.substr(parameterValue.length - 1) == "[")
        {
            let end = parameterValue.substr(parameterValue.length-2).replace("\"", " ")
            parameterValue = parameterValue.substring(0, parameterValue.length - 2).concat(end)
        }
        if(parameterValue.substring(0,1) == "]")
        {
            let ini = parameterValue.substring(0,2).replace("\"", " ")
            parameterValue =  ini.concat(parameterValue.substr(2))
        }
        return parameterValue
    }



//Coordinates functions

    generateRandomAngle()
    {
        var angle = Math.floor(Math.random() * (360))

        return angle
    }

    generateRandomDistanceToMove(stepDistance: number): number
    {
        let distance = Math.random() * stepDistance
        
        return distance
    }

    isInsideBoundingBox(bb: BoundingBox, latitude: number, longitude:number): boolean
    {
        if(latitude < bb.minLatitude || latitude > bb.maxLatitude || longitude < bb.minLongitude || longitude > bb.maxLongitude)
        {
            return false
        }

        return true
    }

    metersToDegrees(meters: number)
    {
        return (meters * 0.001) / 111
    }

    generateRandomPoint(bb: BoundingBox, previousCoordinates?: number[], stepDistance?: number): Point
    {
        var  randomLatitude, randomLongitude

        //Validate all possible missing (null) input parameters
        
        if(previousCoordinates == null && stepDistance == null)
        {
            randomLatitude = bb.minLatitude + Math.random() * (bb.maxLatitude - bb.minLatitude)
            randomLongitude = bb.minLongitude + Math.random() * (bb.maxLongitude - bb.minLongitude)
        }
        else if(previousCoordinates == null || stepDistance == null)
        {
            throw new Error('Missing input parameters.')
        }
        else {
            var isInsideBoundingBox = false;
            var angle = this.generateRandomAngle()

            var temporaryStepDistance = stepDistance

            // While generated point is not inside BB
            while(isInsideBoundingBox == false){
                // Generate random new point with the same angle but change the distance

                let distance = this.generateRandomDistanceToMove(temporaryStepDistance)

                let latitudeMeters = (Math.sin(angle) * distance)  //this is in meters
                // Convert distance in meters from config to lat/lng degrees before calculations
                randomLatitude = this.metersToDegrees(latitudeMeters) + previousCoordinates[0]

                
                let longitudeMeters = (Math.cos(angle) * distance) //this is in meters
                // Convert distance in meters from config to lat/lng degrees before calculations
                randomLongitude = this.metersToDegrees(longitudeMeters) + previousCoordinates[1] 

                isInsideBoundingBox = this.isInsideBoundingBox(bb, randomLatitude, randomLongitude);
                console.log("[parameter-replacer.generateRandomPoint] New random point generated " + (isInsideBoundingBox == true ? "inside" : "outside") + " the bounding box (distance: " + distance + ")")

                this.distance = distance
                temporaryStepDistance = distance
            }
        }

        console.log("[parameter-replacer.generateRandomPoint] Point returned: [" + randomLatitude + "," + randomLongitude + "]\n")
        var point = new Point(randomLatitude, randomLongitude)

        return point
    }

    replaceDistance(messageIndex: number): number
    {

        if(messageIndex != 0)
            return this.distance
        else
            return 0
    }


}