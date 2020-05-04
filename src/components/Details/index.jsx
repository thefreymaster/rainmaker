import React from 'react';
import Drawer from 'react-drag-drawer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShower } from '@fortawesome/free-solid-svg-icons'

const Details = (props) => {
    return (
        <Drawer
            open={props.open}
            onRequestClose={props.setOpen}
        >
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <FontAwesomeIcon color="white" icon={faShower} size="6x" />
                <div style={{ color: "white", fontWeight: 900, fontSize: 36, fontFamily: `'Comfortaa', cursive` }}>Rain Maker</div>
            </div>
        </Drawer>
    )
}

export default Details;