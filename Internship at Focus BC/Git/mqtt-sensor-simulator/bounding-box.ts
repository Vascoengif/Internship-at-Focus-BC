import * as consoleUtils from "./console"


export class BoundingBox{

    maxLatitude: number
    minLatitude: number
    maxLongitude: number
    minLongitude: number

    constructor(maxLat: number, minLat: number, maxLong: number, minLong: number){

        this.maxLatitude = maxLat
        this.minLatitude = minLat
        this.maxLongitude = maxLong
        this.minLongitude = minLong
        try
        {
            if(isNaN(maxLat) || isNaN(minLat)|| isNaN(maxLong)|| isNaN(minLat)) 
            {
                throw new Error('Something went wrong with the bounding box values. Please check the values in your configuration.')
            }
            else if(minLat >= maxLat)
            {
                throw new Error('The minimum latitude must be smaller than maximum latitude')
            } 
            else if(minLong >= maxLong)
            {
                throw new Error('The minimum longitude must be smaller than maximun longitude')
            }
        }
        catch(e)
        {
            console.log(consoleUtils.showError(e))
            process.exit(1)
        }
    }
}