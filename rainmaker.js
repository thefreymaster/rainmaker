const express = require('express');
const app = express();
const path = require('path')

const port = 6700;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const os = require('os');
const networkInterfaces = os.networkInterfaces();

app.use(express.json());
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/images'));

const server = require('http').Server(app);
const io = require('socket.io')(server);

const gpio = require("gpio");

const pinYellow = gpio.export(6);

const pinRed = gpio.export(16);

const pinOrange = gpio.export(13);

const pinBlue = gpio.export(24);

const pinGreen = gpio.export(26);

const pins = {
    1: pinBlue,
    2: pinGreen,
    3: pinYellow,
    4: pinOrange,
    5: pinRed
}

const defaultDB = {
    zones: [
        {
            name: "Front Yard Center",
            zone: "1",
            active: false,
            uptime: null,
        },
        {
            name: "Front Yard Right",
            zone: "2",
            active: false,
            uptime: null,
        },
        {
            name: "Flower Beds",
            zone: "3",
            active: false,
            uptime: null,
        },
        {
            name: "Backyard",
            zone: "4",
            active: false,
            uptime: null
        },
        {
            name: "Front Yard Flower Beds",
            zone: "5",
            active: false,
            uptime: null,
        }
    ], system: {
        active: true
    }
}

db.defaults(defaultDB).write()

app.get('/api/zone/on/:zone', (req, res) => {
    const { zone } = req.params;
    console.log({ zone, route: `/api/zone/on/${zone}`, value: true })
    db.get('zones')
        .find({ zone: zone })
        .assign({ active: true, uptime: new Date() })
        .write()
    io.emit('zones_update', db.get('zones').value());
    pins[zone].set(0);
    res.send(db.get('zones')
        .value()
    )
})

app.get('/api/zone/off/:zone', (req, res) => {
    const { zone } = req.params;
    console.log({ zone, route: `/api/zone/off/${zone}`, value: false })
    db.get('zones')
        .find({ zone: zone })
        .assign({ active: false, uptime: null })
        .write()
    io.emit('zones_update', db.get('zones').value());
    pins[zone].set();
    res.send(db.get('zones')
        .value()
    )
})

app.get('/api/zone/:zone', (req, res) => {
    const { zone } = req.params;
    const zoneToReturn = db.get('zones')
        .find({ zone: zone })
        .value()
    res.send(zoneToReturn.active)
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

app.get("/api/zone/image/:id", (req, res) => {
    const { id } = req.params;
    res.sendFile(path.join(__dirname, '/images', `zone_${id}.jpg`));
})

server.listen(port, () => {
    setTimeout(() => {
        pinBlue.set();
        pinGreen.set();
        pinOrange.set();
        pinRed.set();
        pinYellow.set();
        console.log('All pins set to off..');
        console.log('Setting all db options to off..')
        db.setState(defaultDB).write();
        console.log('Ready.')
        console.log(`Rain Maker API running on: ${port}`)
    }, 1000);
});