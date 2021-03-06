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

    const objectPosList =
        [
            {
                ani: 1, w: 0.3, l: 1.1, b: 0.4, p: 'insect'
            }
        ]
    useEffect(
        () => {

            audioList.bodyAudio1.src = prePathUrl() + "sounds/origin/EP_02_Audio_02.mp3" //hello voice
            audioList.bodyAudio2.src = prePathUrl() + "sounds/origin/EP_02_Audio_46.mp3"   //exlain voice  

            moveFunc(aniObjectRef, 0, 'translateX(-35%)')


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
        moveFunc(aniObjectRef, introDuration, 'translateX(20%)')

        setTimeout(() => {
            setAniState(1)
            audioList.bodyAudio1.play();
            setTimeout(() => {
                goFunc()
            }, audioList.bodyAudio1.duration * 1000);
        }, introDuration * 1000);
    }

    function goFunc() {
        setAniState(0)
        let moveDuration = durationList[1]

        moveFunc(backgroundRef, moveDuration, 'translateX(-45%)')
        moveFunc(aniObjectRef, moveDuration, 'translateX(55%)')

        setTimeout(() => {
            setAniState(2)
            audioList.bodyAudio2.play()
            setTimeout(() => {
                zoomFunc()
            }, 2000);

        }, moveDuration * 1000);
    }

    function zoomFunc() {
        moveFunc(backgroundRef, durationList[2], 'scale(0.6) translate(-40%,20%)')

        setTimeout(() => {
            nextFunc()
        }, durationList[2] * 1000 + 3000);
    }

    React.useImperativeHandle(ref, () => ({
        playGame: () => {
            setTimeout(() => {
                introFunc()
            }, 500);

        },
    }))



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
                    posInfo={{ l: 0.0, b: -0.2 }}
                    url={"movebg/SB02_BG_12.svg"} />

                <BaseImage
                    scale={1.7}
                    posInfo={{ l: 0.0, b: -0.3 }}
                    url={"fg/SB02_BG_12_FG.svg"} />


                {objectPosList.map(objectPos => {
                    if (objectPos.ani)
                        return <Player

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
                    else
                        return <BaseImage
                            scale={objectPos.w}
                            posInfo={{ l: objectPos.l, b: objectPos.b }}
                            url={"fg/" + objectPos.p + ".svg"} />

                }

                )}



                {/* character */}
                <BaseDiv ref={aniObjectRef}
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
                                    bottom: '45%',
                                    pointerEvents: 'none',
                                    overflow: 'visible',
                                    transform: 'scale(' + animationScaleList[index].s +
                                        '%) translate(' + animationScaleList[index].t + ')'
                                }}
                            >
                            </Player>
                        )
                    }
                </BaseDiv>

            </div>
        </div>
    );
})