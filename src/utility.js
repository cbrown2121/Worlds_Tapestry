const getRecencyString = (difference, type) => {
    let ending = (difference === 1) ? type : `${type}s`;
    return `${difference} ${ending} Ago`
}

export const calculateRecency = (mostRecent) => { 
    const mostRecentTime = new Date(mostRecent);
    const currentTime = new Date();
    
    const yearDifference = Math.abs(mostRecentTime.getYear() - currentTime.getYear());
    if (yearDifference != 0) return getRecencyString(yearDifference, "Year");

    const monthDifference = Math.abs(mostRecentTime.getMonth() - currentTime.getMonth());
    if (monthDifference != 0) return getRecencyString(monthDifference, "Month");

    const dayDifference = Math.abs(mostRecentTime.getDay() - currentTime.getDay());
    if (dayDifference != 0) return getRecencyString(dayDifference, "Day");
    
    const hourDifference = Math.abs(mostRecentTime.getHours() - currentTime.getHours());
    if (hourDifference != 0) return getRecencyString(hourDifference, "Hour");

    const minuteDifference = Math.abs(mostRecentTime.getMinutes() - currentTime.getMinutes());
    if (minuteDifference != 0) return getRecencyString(minuteDifference, "Minute");

    const secondDifference = Math.abs(mostRecentTime.getSeconds() - currentTime.getSeconds());
    if (secondDifference != 0) return getRecencyString(secondDifference, "Second");
}