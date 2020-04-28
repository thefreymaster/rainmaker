import React, { useLayoutEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getZones } from './api/rest';
import Zones from "./components/Zones";
import io from 'socket.io-client';
import { Layout } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faWater, faShower } from '@fortawesome/free-solid-svg-icons'
import { isMobile } from 'react-device-detect';

const { Header, Footer, Sider, Content } = Layout;


function App() {
  const [height, setHeight] = React.useState(window.innerHeight - 129)
  const inline = {
    zones: {
      height: height,
      flexWrap: "wrap"
    }
  }

  window.addEventListener('resize', () => {
    setHeight(window.innerHeight - 129)
  })

  return (
    <Layout>
      <Header>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: isMobile ? "center" : "flex-start", alignItems: "center" }}>
          <FontAwesomeIcon color="white" icon={faShower} />
          <div style={{ color: "white", fontWeight: 900, marginLeft: 10 }}>Rain Maker</div>
        </div>
      </Header>
      <Layout>
        <Content>
          <div className="zones-container" style={inline.zones}>
            <Zones />
          </div>
        </Content>
      </Layout>
      <Footer>
        <div style={{ display: "flex", justifyContent: "center", fontSize: 11, color: "#b4b6ba" }}>
          Canvas 23 Studios
        </div>
      </Footer>
    </Layout>

  );
}

export default App;
