import React, { useLayoutEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getZones } from './api/rest';
import Zones from "./components/Zones";
import io from 'socket.io-client';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;


function App() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = io('http://localhost:6700');

  socket.on('zones_update', (data) => {
    setTimeout(() => {
      setZones(data)
    }, 1000);
  })
  
  const inline = {
    zones: {
      height: window.innerHeight - 64,
      flexWrap: "wrap"
    }
  }

  useLayoutEffect(() => {
    socket.on('zones_update', (data) => {
      console.log(data);
    })
    getZones().then(({ data }) => {
      setZones(data);
      setLoading(false);
    })
  }, [])
  return (
    <Layout>
      <Header>
        <div style={{display: "flex", flexDirection: "row"}}>
          <div style={{ color: "white", fontWeight: 900 }}>Rainmaker</div>
        </div>
      </Header>
      <Layout>
        <Content>
          <div className="zones-container" style={inline.zones}>
            {loading ? "Loading" : <Zones setZones={setZones} zones={zones} />}
          </div>
        </Content>
      </Layout>
    </Layout>

  );
}

export default App;
