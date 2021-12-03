

export function showError(e: Error){

    let message: string

    message = "#################################################### ERROR ########################################################\n"
    message += e.message + "\n"
    message += "###################################################################################################################\n\n"
    return message
}


export function showInstructions(){

    let message: string

    message = "###############################################################################################################\n"
    message += "                                       MQTT SENSOR SIMULATOR\n"
    message += "                                        Usage Instructions\n"
    message += "##############################################################################################################\n"
    message += "                    Please specify five input parameters to start the simulator\n"
    message += "                              - Sensor name (string)\n"
    message += "                              - Configuration file path (string)\n"
    message += "                              - Number of messages to send (integer numeric > 0)\n"
    message += "                              - Time between messages (integer > 0)\n"
    message += "                              - Value of Maximum Step Distance (integer > 0)\n"
    message += "##############################################################################################################\n"
    message += "                                              EXAMPLE\n" 
    message += " node mqtt-simulator SensorName ConfigurationFilePath NumberOfMessages TimeBetweenMessages MaximumStepDistance\n"
    message += "                                                 ⬇\n"
    message += "                         node mqtt-simulator ./configuration.json 100 10 1000\n"
    message += "##############################################################################################################\n"
    message += "                                            Try it now ;)\n"

    return message
}

export function toInteger(val: string){

    let myNumber: number = parseInt(val, 10)

    if(isNaN(myNumber)){
        throw new Error('Input parameter must be a numeric integer value');
    }
    
    return myNumber;
}

export function checkFile(fileExists: any)
{
    if(!fileExists){
        throw new Error('The configuration file does not exist or is in invalid format. Please specify the path ' +
                            ' a valid configuration file.')
    }
    return fileExists
}