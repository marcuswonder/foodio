function convertMinutes(minutes) {
    var hours = Math.floor(minutes / 60)
    var remainingMinutes = minutes % 60
    if(hours === 0 && remainingMinutes === 1) {
      return remainingMinutes + " minute"
    }else if(hours === 0 && remainingMinutes > 1) {
      return remainingMinutes + " minutes"
    }else if(hours !== 0 && remainingMinutes === 0) {
      return hours + " hours"
    }else {
    return hours + " hour(s) " + remainingMinutes + " minute(s)"
    }
}


console.log("This is running")