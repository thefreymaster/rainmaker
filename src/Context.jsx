import React from 'react';

const defaultState = {
    zones: [{
        "name": "Front Yard Center",
        "zone": "1",
        "active": false,
        "uptime": 0
    },
    {
        "name": "Front Yard Right",
        "zone": "2",
        "active": false,
        "uptime": 0
    },
    {
        "name": "Backyard",
        "zone": "4",
        "active": false,
        "uptime": 0
    },
    {
        "name": "Front Yard Flower Beds",
        "zone": "5",
        "active": false,
        "uptime": 0
    }],
    usage: {
        amount: 0,
        time: 0,
        change: 0,
    }
}

export const Context = React.createContext(defaultState);

export const Provider = (props) => {
    return (
        <Context.Provider>
            {props.children}
        </Context.Provider>
    )
}