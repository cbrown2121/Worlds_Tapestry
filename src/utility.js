const convertToLocalTime = (UTCTime) => {
    let offset = new Date().getTimezoneOffset() / 60;

    UTCTime.setHours(UTCTime.getHours() - offset);
    
    return UTCTime;
}

export const getDate = (dateTime) => {
    const date = convertToLocalTime(new Date(dateTime));

    let hour = date.getHours();
    let amPM = "AM";

    if (12 <= hour) {
        hour = hour % 12;

        amPM = "PM";
    }

    return `${date.getMonth() + 1}/${date.getDay() + 1}/${date.getFullYear()}`;
}

const getRecencyString = (difference, type) => {
    let ending = (difference === 1) ? type : `${type}s`;
    return `${difference} ${ending} Ago`;
}

export const calculateRecency = (mostRecent) => { 
    if (mostRecent == null) return null;

    const currentTime = new Date();
    const mostRecentTime = convertToLocalTime(new Date(mostRecent)); // in UTC but we convert to local time below

    const milliseconds = Math.abs(currentTime - mostRecentTime);

    const secondsPassed = Math.floor(milliseconds / 1000);
    const minutesPassed = Math.floor(Math.abs(secondsPassed / 60));
    const hoursPassed = Math.floor(Math.abs(minutesPassed / 60));
    const date = getDate(mostRecent);

    if (secondsPassed < 60) return getRecencyString(secondsPassed, "Second");
    if (minutesPassed < 60) return getRecencyString(minutesPassed, "Minute");
    if (hoursPassed < 24) return getRecencyString(hoursPassed, "Hour");
    return date;
}