import React, { useLayoutEffect } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar'
import { Card, Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getCalendarEntries } from '../../api/rest';
import io from 'socket.io-client';
import { faFaucet, faCalendarDay } from '../../../../../../node_modules/@fortawesome/free-solid-svg-icons';

const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:6700' : 'http://192.168.124.69:6700/'); console.log(process.env.NODE_ENV)
const from = new Date(2020, 0, 1)
const to = new Date(2020, 11, 31)

const commonProps = {
  minWidth: '100%',
  minHeight: '100%',
  margin: {
    top: 50,
    right: 10,
    bottom: 10,
    left: 50,
  },
  from: from.toISOString(),
  to: to.toISOString(),
}

const theme = {
  axis: {
    textColor: '#eee',
    fontSize: '14px',
    tickColor: '#eee',
  },
  grid: {
    stroke: '#888',
    strokeWidth: 1
  },
};

export const Calendar = () => {
  const [calendar, setCalendarData] = React.useState([]);
  useLayoutEffect(() => {
    socket.on('calendar_update', (data) => {
      console.log(data)
      setCalendarData(data)
    })
    getCalendarEntries().then(({ data }) => {
      setCalendarData(data);
    })
  }, [])
  return (
    <div style={{ paddingLeft: 20, paddingBottom: 20, paddingRight: 20 }}>
      <Card cover={
        <div style={{ width: '100%', height: window.innerHeight - 570, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ResponsiveCalendar
            data={calendar}
            colors={['#2d472a', '#5f8b63', '#7fc085', '#91b594', '#5d9761']}
            align="center"
            emptyColor="#f3f3f3"
            {...commonProps}
          />
        </div>
      }>
        <Card.Meta
          avatar={<Avatar icon={<FontAwesomeIcon icon={faCalendarDay} />} />}
          title="Watering Calendar"
          description="Days with active watering"
        />
      </Card>
    </div>
  )
}
