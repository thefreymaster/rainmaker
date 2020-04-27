import React, { useState, useLayoutEffect } from 'react';
import { Switch, Card, Avatar } from 'antd';
import { setZoneOff, setZoneOn, getZoneImage, getZones } from '../../api/rest';
import io from 'socket.io-client';
import Timer from "react-compound-timer"
const socket = io('http://localhost:6700');


const Zones = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);


    useLayoutEffect(() => {
        socket.on('zones_update', (data) => {
            console.log(data)
            setZones(data)
        })
        getZones().then(({ data }) => {
            setZones(data);
            setLoading(false);
        })
    }, [])
    if (loading) {
        return "Loading"
    }
    return zones.map(zone => {
        return <Zone zone={zone} setZones={setZones} />
    })
}

const Zone = ({ zone, setZones }) => {
    return (
        <Card key={zone.zone} cover={
            <img
                style={{
                    width: (window.innerWidth) / 5,
                    filter: zone.active ? "grayscale(0)" : "grayscale(1)",
                    transition: "filter 350ms ease-in-out"
                }}
                src={`/api/zone/image/${zone.zone}`}
            />
        }
            style={{ width: (window.innerWidth) / 5 }}>
            <Card.Meta
                avatar={<i class="fas fa-tint"></i>}
                title={zone.name}
                description={zone.uptime ? <Time time={zone.uptime} /> : "Not Watering"}
            />
            <br />
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Switch onChange={() => zone.active ? setZoneOff({ zone, setZones }) : setZoneOn({ zone, setZones })} checked={zone.active} defaultChecked={zone.active} />
                <Action zone={zone} />
            </div>
        </Card>
    )
}

const Time = ({ time }) => {
    return (
        <Timer
            initialTime={(new Date() - Date.parse(time))}>
            <Timer.Minutes />:<Timer.Seconds /> minutes
        </Timer>
    )
}

const Title = ({ zone }) => {
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div>{zone.name}</div>
            <Uptime zone={zone} />
        </div>
    )
}

const Action = ({ zone }) => {
    return (
        <div style={{
            marginLeft: 10,
            fontWeight: zone.active ? 700 : 300,
            color: zone.active && "#1890ff"
        }}>{zone.active ? "Active" : "Inactive"}</div>
    )
}

const Uptime = ({ zone }) => {
    if (zone.uptime === null) {
        return null
    }
    return (
        <div>test</div>
    )
}

export default Zones;