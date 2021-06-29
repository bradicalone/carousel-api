import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import './carousel.css'

const ItemList = props => {
    return (
        <>
            <div className="carousel-list">
                {props.assets.length ? props.assets.map(item => {
                    return (
                        <React.Fragment key={item.title}>
                            <span className="dot"></span>
                        </React.Fragment>
                    )
                }): null}
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        assets: state.data
    }
}
export default connect(mapStateToProps)(ItemList);