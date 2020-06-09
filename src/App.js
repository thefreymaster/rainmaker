import React from 'react';
import './App.css';
import Zones from "./components/Zones";
import { Layout, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShower, faHamburger, faBars, faFaucet } from '@fortawesome/free-solid-svg-icons'
import { isMobile } from 'react-device-detect';
import { Calendar } from './components/Zones/Calendar';
import Details from './components/Details';

import Container from './common/DZContainer';
import Flex from './common/DZFlex';

const { Header, Footer, Content } = Layout;

export const GREEN = "#38d67c";


function App() {
  const [height, setHeight] = React.useState(window.innerHeight);
  const [open, setOpen] = React.useState(false);
  const inline = {
    zones: {
      width: '100%',
      flexWrap: 'wrap',
      paddingTop: 20,
      paddingRight: 20,
    },
    calendar: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
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
    <Container backgroundColor="#353535">
      <Flex width="20%">
        <Flex width="100%" margin="30px 30px 30px 30px" borderRadius backgroundColor={GREEN}>
          Drizzle
        </Flex>
      </Flex>
      <Flex width="80%">
        <Flex height="100%" width="33%" margin="30px 30px 30px 0px" direction="column">
          <Flex height="100px" width="100%" backgroundColor={GREEN}>
            USAGE GAL
          </Flex>
          <Flex height="calc(50% - 110px)" width="100%" margin="30px 30px 30px 0px" backgroundColor={GREEN}>

          </Flex>
          <Flex height="calc(50% - 110px)" width="100%" margin="0px 30px 0px 0px" backgroundColor={GREEN}>

          </Flex>
        </Flex>
        <Flex height="100%" width="66%" margin="30px 30px 30px 0px" direction="column">
          <Flex direction="row">
            <Flex height="100px" width="50%" margin="0px 30px 30px 0px" backgroundColor={GREEN}>
              USAGE HR
            </Flex>
            <Flex height="100px" width="50%" margin="0px 0px 30px 0px" backgroundColor={GREEN}>
              USAGE %/MONTH
            </Flex>
          </Flex>
          <Flex height="calc(100% - 190px)" width="100%" margin="0px 30px 30px 0px" backgroundColor={GREEN}>
            USAGE %/MONTH
          </Flex>
        </Flex>

      </Flex>
    </Container>
  );
}

export default App;
