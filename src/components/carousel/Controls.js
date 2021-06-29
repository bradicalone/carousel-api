import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { getAssets } from '../../actions/carouselAssets';
import { ShowItems } from '../../ShowItems';
import './carousel.css'

const Controls = props => {
    const rotate = props?.rotate?.rotate
    return (
        <>
            <div className="c-left-btn" onClick={(e) => {rotate(e)}}>
                <span className="c-btn"></span>
            </div>
            <div className="c-right-btn" onClick={(e) => {rotate(e)}}>
                <span className="c-btn"></span>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        assets: state.data
    }
}
export default connect(mapStateToProps)(Controls);