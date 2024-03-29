const express = require('express');
const app = express();
const path = require('path');
const _ = require('lodash');

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

const relay1 = gpio.export(5, {
    direction: gpio.DIRECTION.OUT,
    ready: function () {
        console.log("Pin 1 ready.");
        relay1.set();

    }
});

const relay2 = gpio.export(6, {
    direction: gpio.DIRECTION.OUT,
    ready: function () {
        console.log("Pin 2 ready.")
        relay2.set();

    }
});

const relay3 = gpio.export(13, {
    direction: gpio.DIRECTION.OUT,
    ready: function () {
        console.log("Pin 3 ready.")
        relay3.set();

    }
});

const relay4 = gpio.export(19, {
    direction: gpio.DIRECTION.OUT,
    ready: function () {
        console.log("Pin 4 ready.")
        relay4.set();
    }
});

const relay5 = gpio.export(26, {
    direction: gpio.DIRECTION.OUT,
    ready: function () {
        console.log("Pin 5 ready.")
        relay5.set();

    }
});

const pins = {
    1: relay1,
    2: relay2,
    3: relay3,
    4: relay4,
    5: relay5
}

const defaultZones = [
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
]

const defaultDB = {
    zones: defaultZones,
    calendar: [],
    system: {
        active: true
    }
}

db.defaults(defaultDB).write()

app.get('/api/zone/on/:zone', (req, res) => {
    const { zone } = req.params;
    console.log({ zone, route: `/api/zone/on/${zone}`, value: true })
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? `0${today.getMonth() + 1}` : today.getMonth();
    const date = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
    db.get('calendar')
        .push({ day: `${year}-${month}-${date}`, value: 1 })
        .write()
    db.get('zones')
        .find({ zone: zone })
        .assign({ active: true, uptime: new Date() })
        .write()
    io.emit('zones_update', db.get('zones').value());
    io.emit('calendar_update', db.get('calendar').value());
    io.emit('calendar_count_update', db.get('calendar')
        .filter(item => new Date().getMonth === new Date(item.x).getMonth())
        .value());
    pins[zone].set(0);
    res.send(db.get('zones')
        .value()
    )
})

app.get('/api/calendar', (req, res) => {
    res.send(db.get('calendar'))
})

app.get('/api/calendar/count', (req, res) => {
    const count = db.get('calendar')
        .filter(item => {
            console.log({ today: new Date().getMonth() })
            console.log({ db: new Date(item.day).getMonth() })
            if (new Date().getMonth() === new Date(item.day).getMonth()) {
                return item;
            }
        })
        .value()
    res.send(_.uniqBy(count, 'day'))
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
        .find({ zone })
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
        db.assign('zones', defaultZones).write();
        relay1.set();
        relay2.set();
        relay3.set();
        relay4.set();
        relay5.set();
        console.log('All pins set to off..');
        console.log('Setting all db options to off..')

        console.log('Ready.')
        console.log(`Rain Maker API running on: ${port}`)
        setTimeout(() => {
            relay1.set();
            relay2.set();
            relay3.set();
            relay4.set();
            relay5.set();
            console.log('Second failsafe ran, all pins set to off..');
            setTimeout(() => {
                relay1.set();
                relay2.set();
                relay3.set();
                relay4.set();
                relay5.set();
                console.log('Third failsafe ran, all pins set to off..');
            }, 10000);
        }, 5000);
    }, 1500);
});