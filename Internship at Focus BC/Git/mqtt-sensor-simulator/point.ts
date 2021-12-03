export class Point{

    latitude: number
    longitude: number
    point: number[]

    constructor(lat: number, long: number){
        this.latitude = lat
        this.longitude = long
        this.point = [lat, long]
    }

    getPoint()
    {
        return this.point
    }
}