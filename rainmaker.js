const express = require('express');
const app = express();
const port = 6700;
const WebSocket = require('ws');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const os = require('os');
const networkInterfaces = os.networkInterfaces();

db.defaults({
    zones: [
        {
            name: "Front Yard Center",
            zone: "1",
            active: false,
        },
        {
            name: "Front Yard Right",
            zone: "2",
            active: false,
        },
        {
            name: "Flower Beds",
            zone: "3",
            active: false,
        },
        {
            name: "Backyard",
            zone: "4",
            active: false,
        },
        {
            name: "Backyard Flower Beds",
            zone: "5",
            active: false,
        },
        {
            name: "None",
            zone: "6",
            active: false,
        },
    ], system: {
        active: true
    }
}).write()

app.get('/api/zone/on/:zone', (req, res) => {
    const { zone } = req.params;
    console.log({ zone, route: "/api/zone/on/:zone", value: true })
    db.get('zones')
        .find({ zone: zone })
        .assign({ active: true })
        .write()
    res.send(db.get('zones')
        .find({ zone })
        .value()
    )
})

app.get('/api/zone/off/:zone', (req, res) => {
    const { zone } = req.params;
    console.log({ zone, route: "/api/zone/off/:zone", value: false })
    db.get('zones')
        .find({ zone: zone })
        .assign({ active: false })
        .write()
    res.send(db.get('zones')
        .find({ zone })
        .value()
    )
})

app.get('/api/zone/:zone', (req, res) => {
    const { zone } = req.params;
    const { active } = db.get('zones')
        .find({ zone })
        .value()
    res.send(active)
})

app.get('/api/zones', (req, res) => {
    res.send(db.get('zones'))
})


app.get('/api/zones/on', (req, res) => {
    const zones = db.get('zones').value()
    zones.map(zone => zone.active = true)
    res.send(db.get('zones').value())
})


app.get('/api/zones/off', (req, res) => {
    const zones = db.get('zones').value()
    zones.map(zone => zone.active = false)
    res.send(db.get('zones').value())

})

app.get('/api/status', (req, res) => {
    console.log({ route: "/api/status" })
    res.send({
        active: true,
        version: '1.0.0',
        app: 'Rainmaker',
        uptime: `${process.uptime().toFixed(0)} seconds`,
        ip: networkInterfaces
    })
})

app.get('/api', (req, res) => {
    res.send({
        status: {
            description: "Get the status of the server",
            route: "/api/status"
        },
        zones: {
            description: "Get the status of all zones",
            route: "/api/zones",
            on: {
                description: "Turn all zones on",
                route: "/api/zones/on",
            },
            off: {
                description: "Turn all zones off",
                route: "/api/zones/off",
            }
        },
        zone: {
            description: "Get the status of one zone",
            route: "/api/zone/:zone_id",
            on: {
                description: "Set a zone to active",
                route: "/api/zone/on/:zone_id"
            },
            off: {
                description: "Set a zone to inactive",
                route: "/api/zone/off/:zone_id"
            }
        }
    })
})

app.listen(port, () => console.log(`Rainmaker running on: ${port}`));