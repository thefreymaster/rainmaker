import React from 'react';

const Flex = (props) => {
    const inline = {
        color: 'white',
        fontSize: 18,
    }
    return <div style={inline}>{props.children}</div>
}

export default Flex;