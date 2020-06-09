import React from 'react';

const Flex = (props) => {
    const inline = {
        display: 'flex',
        flexDirection: props.direction,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        height: props.height,
        width: props.width,
        backgroundColor: props.backgroundColor,
        padding: props.padding,
        margin: props.margin,
        borderRadius: 20,
        flexWrap: props.flexWrap,
    }
    return <div style={inline}>{props.children}</div>
}

export default Flex;