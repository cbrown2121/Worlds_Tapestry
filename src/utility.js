// DATE TIME FUNCTIONS ==================================================================

const convertToLocalTime = (UTCDateTime) => {
    let date = new Date(UTCDateTime);
    let offset = new Date().getTimezoneOffset() / 60;
    date.setHours(date.getHours() - offset);
    
    return date;
}

export const getDate = (dateTime) => {
    const date = convertToLocalTime(new Date(dateTime));

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

const getRecencyString = (difference, type) => {
    let ending = (difference === 1) ? type : `${type}s`;
    return `${difference} ${ending} Ago`;
}

export const calculateRecency = (mostRecent) => { 
    if (mostRecent == null) return null;

    let localDateTime = convertToLocalTime(mostRecent);
    let currentDateTime = new Date();

    const milliseconds = currentDateTime - localDateTime;

    const secondsPassed = Math.floor(milliseconds / 1000);
    const minutesPassed = Math.floor(Math.abs(secondsPassed / 60));
    const hoursPassed = Math.floor(Math.abs(minutesPassed / 60));
    const daysPassed = Math.floor(hoursPassed / 24);

    if (0 < daysPassed) return getDate(localDateTime);
    if (0 < hoursPassed) return getRecencyString(hoursPassed, "Hour");
    if (0 < minutesPassed) return getRecencyString(minutesPassed, "Minute");
    return getRecencyString(secondsPassed, "Second");
}

// GET
export const universalDatabaseFetch = async (endpoint) => {
    try {
        const response = await fetch(`http://localhost:5000/${ endpoint }`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Network response error");
        }

        return await response.json();

    } catch (error) {
        console.log(`Data was submitted unsuccessfully: ${error}`);
    }
}

// POST PUT DELETE
export const universalDatabaseInteraction = async (method, endpoint, body) => {
    try {
        const response = await fetch(`http://localhost:5000/${ endpoint }`, {
            method: method,
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error("Network response error");
        }

        return await response.json();

    } catch (error) {
        console.log(`Data was submitted unsuccessfully: ${error}`);
    }
}

export const convertFormToData = (event, passToEndPoint) => {
    let processedData = {};

    new FormData(event.currentTarget).forEach((value, key) => {
        processedData[key] = value;
    });

    for (let i = 0; i < passToEndPoint.length; i++) {
        let keyPair = passToEndPoint[i];
        processedData[keyPair.key] = keyPair.value;
    }

    return processedData;
}

export const universalFormSubmit = (body, endpoint, method, processedData) => {
    return universalDatabaseInteraction(method, endpoint, processedData);
}