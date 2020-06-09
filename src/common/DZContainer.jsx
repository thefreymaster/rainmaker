import React from 'react';

const Container = (props) => {
    const inline = {
        display: 'flex',
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        height: window.innerHeight,
        width: window.innerWidth,
        backgroundColor: props.backgroundColor,
    }
    return <div style={inline}>{props.children}</div>
}

export default Container;