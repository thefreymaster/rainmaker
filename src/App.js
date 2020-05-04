import React from 'react';
import './App.css';
import Zones from "./components/Zones";
import { Layout, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShower } from '@fortawesome/free-solid-svg-icons'
import { isMobile } from 'react-device-detect';
import { Calendar } from './components/Zones/Calendar';
import Details from './components/Details';

const { Header, Footer, Content } = Layout;


function App() {
  const [height, setHeight] = React.useState((window.innerHeight - 128) / 2);
  const [open, setOpen] = React.useState(false);
  const inline = {
    zones: {
      height,
      flexWrap: "wrap"
    },
    calendar: {
      height,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      title: {
        position: 'relative',
        top: 70,
        fontWeight: 500
      }
    },
  }

  window.addEventListener('resize', () => {
    setHeight(window.innerHeight - 129)
  })

  return (
    <Layout>
      <Header>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: isMobile ? "center" : "flex-start", alignItems: "center" }}>
          <FontAwesomeIcon color="white" icon={faShower} />
          <div style={{ color: "white", fontWeight: 900, marginLeft: 10, fontFamily: `'Comfortaa', cursive` }}>Rain Maker</div>
          <div style={{ flexGrow: 1 }} />
          <Button onClick={() => setOpen(!open)} shape="circle" icon={<FontAwesomeIcon icon={faShower} />} />
        </div>
      </Header>
      <Layout>
        <Content>
          <div className="zones-container" style={inline.zones}>
            <Zones />
          </div>
          {!isMobile &&
            <div className="calendar-container" style={inline.calendar}>
              <div style={inline.calendar.title}>Days Watered</div>
              <Calendar />
            </div>
          }
          <Details
            open={open}
            setOpen={setOpen}
          />
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
