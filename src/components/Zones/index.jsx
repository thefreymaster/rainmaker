import React, { useState, useLayoutEffect } from 'react';
import { Switch, Card } from 'antd';
import { setZoneOff, setZoneOn, getZones } from '../../api/rest';
import io from 'socket.io-client';
import Timer from "react-compound-timer"
import {
    isMobile
} from "react-device-detect";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:6700' : 'http://192.168.124.69:6700/');

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
        return (
            <div style={{
                minWidth: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Loader type="Grid" color="#001529" height={80} width={80} />
            </div>
        )
    }
    return zones.map(zone => {
        return (
            <div key={zone.zone} style={{ paddingLeft: isMobile ? 0 : 20, paddingBottom: 20, minHeight: '100% !important' }}>
                <Zone zone={zone} setZones={setZones} />
            </div>
        )
    })
}

const Zone = ({ zone, setZones }) => {
    return (
        <Card style={{ minHeight: '100% !important' }} key={zone.zone} cover={
            <img
                style={{
                    width: isMobile ? window.innerWidth : ((window.innerWidth) - 100) / 4,
                    transition: "filter 350ms ease-in-out",
                    height: 140,
                    objectFit: 'cover',
                }}
                alt="lawn"
                src={`/api/zone/image/${zone.zone}`}
            />
        }
            style={{ width: isMobile ? window.innerWidth : ((window.innerWidth) - 100) / 4 }}>
            <Card.Meta
                avatar={<i className="fas fa-tint"></i>}
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

// const Title = ({ zone }) => {
//     return (
//         <div style={{ display: "flex", flexDirection: "row" }}>
//             <div>{zone.name}</div>
//             <Uptime zone={zone} />
//         </div>
//     )
// }

const Action = ({ zone }) => {
    return (
        <div style={{
            marginLeft: 10,
            fontWeight: zone.active ? 700 : 300,
            color: zone.active && "#6b9b6f"
        }}>{zone.active ? "Active" : "Inactive"}</div>
    )
}

// const Uptime = ({ zone }) => {
//     if (zone.uptime === null) {
//         return null
//     }
//     return (
//         <div>test</div>
//     )
// }

export default Zones;