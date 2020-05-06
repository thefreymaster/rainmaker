import React from 'react';
import './App.css';
import Zones from "./components/Zones";
import { Layout, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShower, faHamburger, faBars } from '@fortawesome/free-solid-svg-icons'
import { isMobile } from 'react-device-detect';
import { Calendar } from './components/Zones/Calendar';
import Details from './components/Details';

const { Header, Footer, Content } = Layout;


function App() {
  const [height, setHeight] = React.useState(window.innerHeight);
  const [open, setOpen] = React.useState(false);
  const inline = {
    zones: {
      width: isMobile ? '100%' : '85%',
      flexWrap: 'wrap',
      paddingTop: 20,
      paddingRight: 20,
    },
    calendar: {
      maxHeight: window.innerHeight - 128,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '15%',
      title: {
        position: 'relative',
        top: 20,
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
          <div style={{ color: "white", fontWeight: 900, marginLeft: 10 }}>Rain Maker</div>
          <div style={{ flexGrow: 1 }} />
          <Button style={{color: 'white'}} type="link"  onClick={() => setOpen(!open)} icon={<FontAwesomeIcon icon={faBars} />} />
        </div>
      </Header>
      <Layout>
        <Content>
          <div style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            <div className="zones-container" style={inline.zones}>
              <Zones />
            </div>
            {!isMobile &&
              <div className="calendar-container" style={inline.calendar}>
                <Calendar />
              </div>
            }
          </div>

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
