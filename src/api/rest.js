import axios from 'axios';

export const getZones = () => axios.get('/api/zones')
    .then(response => response)
    .catch(function (error) {
        // handle error
        console.log(error);
    })

export const setZoneOn = ({ zone, setZones }) => {
    axios.get(`/api/zone/on/${zone.zone}`)
        .then(response => {
            setZones(response.data)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

export const setZoneOff = ({ zone, setZones }) => axios.get(`/api/zone/off/${zone.zone}`)
    .then(response => setZones(response.data))
    .catch(function (error) {
        // handle error
        console.log(error);
    })

export const getCalendarEntries = () => axios.get('/api/calendar')
    .then(response => response)
    .catch(function (error) {
        // handle error
        console.log(error);
    })

export const getCalendarEntriesCount = () => axios.get('/api/calendar/count')
    .then(response => response)
    .catch(function (error) {
        // handle error
        console.log(error);
    })

