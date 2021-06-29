import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { getAssets } from '../../actions/carouselAssets';
import Controls from './Controls'
import ItemList from './ItemList'
import { ShowItems } from '../../ShowItems';
import './carousel.css'

const Carousel = props => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    const [util, setUtil] = useState({})
    const data = props.assets

    useEffect(() => {
        props.dispatch(getAssets('/'))
    }, []);

    function load() {
        Promise.all(Array.from(document.querySelectorAll('.carousel-image img')).map(img => {
            if (img.complete)
                return Promise.resolve(img.naturalHeight !== 0);
            return new Promise(resolve => {
                img.addEventListener('load', () => resolve(true));
                img.addEventListener('error', () => resolve(false));
            });
        })).then(results => {
            if (results.every(res => res)) {
                const showItems = new ShowItems() 
                setUtil(showItems)
                showItems.checkWidth()
                window.onresize = () => {
                    showItems.checkWidth()
                }
            }
            else
                console.log('some images failed to load, all finished loading');
        });
    }
    useEffect(() => {
        if(props.assets.length){
            load()
        } 
    }, [props.assets])

    return (
        <div className="container-xl">
            <div className="carousel-title">
                <h1>Spring Collection</h1>
            </div>
            <div className="c-carousel">
                <div className="c-carousel-wrap">
                    <div className="carousel-item-array">
                        {(() => {
                            return (
                                data.length ? data.map((asset, i) => {
                                    return (
                                        <div className="c-carousel-item" key={i}>
                                            <div className="carousel-image">
                                                {asset.media.desktop && <img className="desktop" src={asset.media.desktop}></img>}
                                                {asset.media.mobile && <img className="mobile" src={asset.media.mobile}></img>}
                                            </div>
                                            <div className={size[0] > 767 ? "carousel-content desktop" : "carousel-content mobile"}>
                                                <h1>{asset.title}</h1>
                                                {asset.heading && <p>{asset.heading}</p>}
                                                <div className="btn-group">
                                                    <a className="carousel-btn" href={asset.cta[0].url}>{asset.cta[0].label}</a>
                                                    {asset.cta[1] ? <a className="carousel-btn" href={asset.cta[1].url}>{asset.cta[1].label}</a> : null}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : null
                            )
                        })()}
                    </div>
                    <Controls rotate={util}/>
                </div>
            </div>
            <ItemList util={util}/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        assets: state.data
    }
}
export default connect(mapStateToProps)(Carousel);