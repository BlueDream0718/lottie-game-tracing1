import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components'
import { prePathUrl } from "../../components/CommonFunctions";
import { Player } from '@lottiefiles/react-lottie-player';

import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';
import { returnVoicePath } from "../../components/CommonFunctions"

const BaseDiv = styled.div`
position: absolute;
width: 100%;
height: 100%;
left : 0%;
top : 0%;
`

export default React.forwardRef(function LetterExplain({ nextFunc, audioList, _geo, _baseGeo }, ref) {


    const characterList = [useRef(), useRef(), useRef()];
    const backgroundRef = useRef();
    const aniObjectRef = useRef();

    const [aniState, setAniState] = useState(0)
    const animationPathList = [
        'normal',
        'hi',
        'point_horizon',
        // 'point_stand'
    ]

    const animationScaleList = [
        { s: '100', t: '10%, 10%', },
        { s: '80', t: '8% ,15%' },
        { s: '100', t: '10%, 10%' },
        // { s: '120', t: '15%, 0%' },
    ]

    const durationList = [
        3, //intro
        3, //go
        3 //zoom
    ]


    useEffect(
        () => {

            audioList.bodyAudio1.src = returnVoicePath(0, '01') //hello voice
            audioList.bodyAudio2.src = returnVoicePath(0, '02')   //exlain voice    

            moveFunc(aniObjectRef, 0, 'translateX(130%)')
            moveFunc(backgroundRef, 0, 'translateX(-50%)')

            setTimeout(() => {
                introFunc()
            }, 1000);


            return () => {
            }
        }, []
    )

    function moveFunc(obj, transition, transform) {
        obj.current.style.transition = transition + 's'
        obj.current.style.transform = transform
    }


    function introFunc() {
        let introDuration = durationList[0]
        moveFunc(aniObjectRef, introDuration, 'translateX(80%)')

        setTimeout(() => {
            setAniState(1)

            setTimeout(() => {
                goFunc()
            }, 2000);
        }, introDuration * 1000);
    }

    function goFunc() {
        setAniState(0)
        let moveDuration = durationList[1]

        moveFunc(backgroundRef, moveDuration, 'translateX(30%)')
        moveFunc(aniObjectRef, moveDuration, 'translateX(20%)')

        setTimeout(() => {
            setAniState(2)

            setTimeout(() => {
                zoomFunc()
            }, 2000);

        }, moveDuration * 1000);
    }

    function zoomFunc() {
        moveFunc(backgroundRef, durationList[2], 'scale(0.6) translate(0%,20%)')

        setTimeout(() => {
            // nextFunc()
        }, durationList[2] * 1000 + 2000);
    }

    React.useImperativeHandle(ref, () => ({
        playGame: () => {
            setTimeout(() => {
                introFunc()
            }, 500);

        },
    }))

    const objectPos = {
        ani: 1, w: 0.12, l: -0.05, b: 0.15, p: 'man'
    }

    return (
        <div className="aniObject">
            <div ref={backgroundRef}
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px",
                    left: _baseGeo.left + "px"
                    , bottom: 0 + 'px',
                    pointerEvents: 'none'
                }}>
                {/* bg */}
                <BaseImage
                    scale={2}
                    posInfo={{ l: -0.5, b: -0.2 }}
                    url={"movebg/SB02_BG_29.svg"} />

                {
                    objectPos.ani && <Player

                        loop
                        autoplay

                        keepLastFrame={true}
                        src={prePathUrl() + 'lottieFiles/character/' + objectPos.p + '.json'}
                        style={{
                            position: 'absolute',
                            width: objectPos.w * 100 + '%',
                            left: objectPos.l * 100 + '%',
                            bottom: objectPos.b * 100 + '%',
                            pointerEvents: 'none',
                            overflow: 'visible',
                        }}
                    >
                    </Player>
                }
                {
                    !objectPos.ani &&
                    <BaseImage
                        scale={objectPos.w}
                        posInfo={{ l: objectPos.l, b: objectPos.b }}
                        url={"fg/" + objectPos.p + ".svg"} />
                }
                {/* character */}



                <BaseImage
                    scale={0.6}
                    posInfo={{ l: -0.2, b: -0.1 }}
                    url={"fg/SB02_BG_29_FG.svg"} />
                <BaseDiv
                    ref={aniObjectRef}

                >
                    {
                        animationPathList.map((value, index) =>
                            <Player
                                ref={characterList[index]}
                                loop
                                autoplay
                                className={aniState == index ? 'showObject' : 'hideObject'}
                                keepLastFrame={true}
                                src={prePathUrl() + 'lottieFiles/character/bee_' + value + '.json'}
                                style={{
                                    position: 'absolute',
                                    width: '15%',
                                    left: '20%',
                                    bottom: '50%',
                                    pointerEvents: 'none',
                                    overflow: 'visible',
                                    transform: 'scale(' + animationScaleList[index].s +
                                        '%) translate(' + animationScaleList[index].t + ') rotateY(180deg)'
                                }}
                            >
                            </Player>
                        )
                    }
                </BaseDiv>

            </div>
        </div >
    );
})