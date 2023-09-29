function timeStringToMinutes(timeString) {
    // Handle ranges by finding the average
    if (timeString.includes('-')) {
      let times = timeString.split('-').map(time => timeStringToMinutes(time.trim()));
      return (times.reduce((a, b) => a + b, 0)) / times.length;
    }
  
    // Break down the time string into its components
    let timeComponents = timeString.split('and').map(time => time.trim());
  
    let totalMinutes = 0;
  
    timeComponents.forEach(timeComponent => {
      if (timeComponent.includes('hr')) {
        let hours = parseInt(timeComponent.split(' ')[0]);
        totalMinutes += hours * 60;
      } else if (timeComponent.includes('min')) {
        let minutes = parseInt(timeComponent.split(' ')[0]);
        totalMinutes += minutes;
      }
    });
  
    return totalMinutes;
  }



  function findAverageNumberFromRange(string) {
    if (string.includes(' - ')) {
        const numberRange = string.split(' - ').map(Number)
        console.log("Cheerio: findAverageNumberFromRange numberRange", numberRange)
        let num = (numberRange[0] + numberRange[1]) / 2

        if(isNaN(num)) {
            num = 1
        }

        console.log("Cheerio: findAverageNumberFromRange - spaces", num)
        return num
        
    } else if(string.includes('-')) {
        const numberRange = string.split('-').map(Number)
        console.log("Cheerio: findAverageNumberFromRange numberRange", numberRange)
        let num = (numberRange[0] + numberRange[1]) / 2
        
        if(isNaN(num)) {
            num = 1
        }
        console.log("Cheerio: findAverageNumberFromRange - no spaces", num)
        return num
    }
    else {
        const num = Number(string)
        return num
    }
}

module.exports = { timeStringToMinutes, findAverageNumberFromRange }