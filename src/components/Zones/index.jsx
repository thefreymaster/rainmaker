import React, { useState, useLayoutEffect } from 'react';
import { Switch, Card, Avatar } from 'antd';
import { setZoneOff, setZoneOn, getZoneImage } from '../../api/rest';
import Zone1 from "../../images/zone_1.jpg";
import Zone2 from "../../images/zone_2.jpg";
import Zone3 from "../../images/zone_3.jpg";
import Zone4 from "../../images/zone_4.jpg";
import Zone5 from "../../images/zone_5.jpg";


const Zones = ({ zones, setZones }) => {
    return zones.map(zone => {
        return <Zone zone={zone} setZones={setZones} />
    })
}

const Zone = ({ zone, setZones }) => {
    return (
        <Card key={zone.zone} cover={
            <img
                style={{ width: (window.innerWidth) / 4 }}
                src={`/api/zone/image/${zone.zone}`}
            />
        }
            style={{ width: (window.innerWidth) / 4 }}>
            <Card.Meta
                avatar={<i class="fas fa-tint"></i>}
                title={zone.name}
                description={zone.uptime ? `Running for ${((new Date() - Date.parse(zone.uptime)) / 1000 / 60).toFixed(2)} minutes` : null}
            />
            <br />
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Switch onChange={() => zone.active ? setZoneOff({ zone, setZones }) : setZoneOn({ zone, setZones })} checked={zone.active} defaultChecked={zone.active} />
                <Action zone={zone} />
            </div>
        </Card>
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