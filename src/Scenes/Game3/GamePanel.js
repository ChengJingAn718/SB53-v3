import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum, setRepeatAudio, startRepeatAudio, stopRepeatAudio } from "../../components/CommonFunctions"

import Lottie from "react-lottie-segments";
import loadAnimation from '../../utils/loadAnimation'

var isGameStarted = false;

let animationList = []
new loadAnimation('main/Chick_1.json').then(result => {
    animationList[1] = result;
}, () => { });

new loadAnimation('main/Chicken1_1.json').then(result => {
    animationList[2] = result;
}, () => { });

new loadAnimation('main/Chicken2_1.json').then(result => {
    animationList[0] = result;
}, () => { });

let timerList = []
//3.5,-3.5,
// 5,-5

let isGamestoneted = false;
let currentNum = 0;
let stepNumRange = 10;
let currentStep = 0
let movingSceneNum = 0;

export default function Scene2({ finishGame, _baseGeo, _geo, stopSound }) {
    const audioList = useContext(UserContext)



    const [isStopAni, setStopAni] = useState(false)
    const baseRef = useRef()
    const backRef = useRef()

    const greenstone = useRef();
    const redstone = useRef();

    const spaceEmpty = useRef();
    const spaceShip = useRef();

    const targetRange = 0.062
    const stepRange = -0.04
    const foodAreaLength = 0.24

    const layoutstonetPos = { x: -5, y: -0.5 }
    const translatestonetPos = { x: 5, y: -0.5 }

    const characterList = Array.from({ length: 4 }, ref => useRef())
    const disableStone = Array.from({ length: 50 }, ref => useRef())
    const stoneList = Array.from({ length: 50 }, ref => useRef())
    const stoneBaseList = Array.from({ length: 50 }, ref => useRef())
    const numberList = Array.from({ length: 100 }, ref => useRef())
    const starRefList = Array.from({ length: 5 }, ref => useRef())

    const sparkBaseRef = useRef()
    const sparkRefList = [useRef(), useRef(), useRef()]
    // width : + -> -
    // height : - ->+
    const movingSceneList = [
        0,
        0.45,
        0.8,
        1.2,
        1.65,
        2.1,
        2.5,
        2.9,
        3.4,
        3.9,
        4.4
    ]

    const movingSceneHeight = [
        0,
        0.18,
        0.35,
        0.55,
        0.67,
        0.88,
        0.97,
        1.18,
        1.35,
        1.68,
    ]

    const stoneHeightList = [
        0, 0.35, 0.62, 0.9, 1.3, 1.3
    ]

    const heightList = [
        0, -1, -2, -3, -4, -5, -6, -7, -8, -9,
        -8, -9, -10, -11, -12, -11, -12, -13, -14, -15,
        -15, -16, -17, -18, -19, -18, -19, -20, -21, -22,
        -22, -24, -25, -26, -27, -28, -29, -30, -31, -32,
        -32, -33, -34, -35, -36, -37, -38, -39, -40, -41,

    ]

    useEffect(
        () => {
            isGamestoneted = true;

            setRepeatAudio(audioList.repeatAudio)

            setTimeout(() => {
                setStopAni(true)
            }, 100);
            greenstone.current.style.opacity = 0
            redstone.current.style.opacity = 0



            characterList.map((character, index) => {
                if (index > 0)
                    character.current.setClass('hideObject')
            })

            backRef.current.style.transition = '0s'

            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                movingSceneList[movingSceneNum])) + 'px, '
                + _baseGeo.height * (translatestonetPos.y + movingSceneHeight[movingSceneNum]) + 'px)'

            return () => {

                isGamestoneted = false;
                currentNum = 0;
                currentStep = 0

                movingSceneNum = 0;

                audioList.clapAudio.pause();
                audioList.clapAudio.currentTime = 0;
            }
        }, []
    )



    if (isGamestoneted)
        reRenderingFunc()

    function reRenderingFunc() {
        backRef.current.style.transition = '0s'

        backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
            movingSceneList[movingSceneNum])) + 'px, '
            + _baseGeo.height * (translatestonetPos.y + movingSceneHeight[movingSceneNum]) + 'px)'

        characterList[0].current.setPosInfo({
            l: layoutstonetPos.x + 0.1 + targetRange * currentNum + foodAreaLength * currentStep,
            b: layoutstonetPos.y + 0.28 + stepRange * heightList[currentNum]
        })
    }

    function playEatingAni() {
        movingSceneNum++;

        let timeCount = 0;
        characterList[0].current.setClass('showObject')
        characterList[timeCount].current.setPosInfo({
            l: layoutstonetPos.x + 0.15 +
                targetRange * (currentNum) + (currentStep - 1) * foodAreaLength + timeCount * 0.12,
            b: layoutstonetPos.y + 0.28 + stepRange * heightList[currentNum] + 0.03
        })
        let interval = setInterval(() => {
            characterList[timeCount].current.setClass('hideObject')

            if (timeCount == 1) {
                clearInterval(interval)
            }
            else {
                timeCount++
                characterList[timeCount].current.setPosInfo({
                    l: layoutstonetPos.x + 0.15 +
                        targetRange * (currentNum) + (currentStep - 1) * foodAreaLength + timeCount * 0.12,
                    b: layoutstonetPos.y + 0.28 + stepRange * heightList[currentNum] + 0.03
                })
                characterList[timeCount].current.setClass('showObject')
            }
        }, 200);

        setTimeout(() => {


            characterList[0].current.setPosInfo({
                l: layoutstonetPos.x + 0.1 + targetRange * currentNum + foodAreaLength * currentStep,
                b: layoutstonetPos.y + 0.28 + stepRange * heightList[currentNum]
            })

            characterList[0].current.setClass('showObject')


            setTimeout(() => {
                setTimeout(() => {
                    baseRef.current.style.pointerEvents = ''
                    audioList.successAudio.play();
                }, 2000);

                backRef.current.style.transition = '2s'
                backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                    movingSceneList[movingSceneNum])) + 'px, '
                    + _baseGeo.height * (translatestonetPos.y + movingSceneHeight[movingSceneNum]) + 'px)'
            }, 500);


        }, 400);

    }

    function clickFunc(num) {


        stopRepeatAudio();
        if (currentNum == 0)
            stopSound()


        if (num >= currentNum) {
            let currentstone = stoneBaseList[num]
            currentstone.current.style.transition = '0.1s'
            currentstone.current.style.transform = 'scale(0.95)'
            setTimeout(() => {
                currentstone.current.style.transform = 'scale(1)'
            }, 100);

            redstone.current.style.opacity = 0
            greenstone.current.style.opacity = 0

            if (num + 1 == currentNum + stepNumRange) {

                audioList.jumpAudio.currentTime = 0
                audioList.jumpAudio.play();

                audioList.buzzAudio.pause();
                audioList.tingAudio.currentTime = 0;
                audioList.tingAudio.play();


                baseRef.current.style.pointerEvents = 'none'

                stoneBaseList[currentNum].current.style.cursor = 'default'
                stoneBaseList[currentNum + 1].current.style.cursor = 'default'

                currentNum += stepNumRange;
                showButtonAni(greenstone, num)

                setTimeout(() => {

                    for (let i = 1; i < 4; i++) {
                        characterList[i].current.setPosInfo({
                            l: layoutstonetPos.x + 0.12 +
                                targetRange * (currentNum - stepNumRange - 1 + i * 3) + foodAreaLength * currentStep,
                            b: layoutstonetPos.y + 0.22 + stepRange * heightList[currentNum - stepNumRange - 1 + i * 3] +
                                [0, 0.2, 0.17, 0.13][i]
                        })
                    }

                    let num = 0;
                    let interval = setInterval(() => {
                        characterList[num].current.setClass('hideObject')

                        characterList[0].current.setPosInfo({
                            l: layoutstonetPos.x + 0.1 + targetRange * currentNum + foodAreaLength * currentStep,
                            b: layoutstonetPos.y + 0.22 + stepRange * heightList[currentNum - 1]
                        })

                        if (num == 3) {
                            clearInterval(interval)
                            characterList[0].current.setClass('showObject')

                        }
                        else {
                            num++
                            characterList[num].current.setClass('showObject')
                        }
                    }, 150);

                    sparkBaseRef.current.style.left = (layoutstonetPos.x + 0.13 + targetRange * currentNum + foodAreaLength * currentStep) * 100 + "%"
                    sparkBaseRef.current.style.bottom = (layoutstonetPos.y + 0.22 + stepRange * heightList[currentNum - 1]) * 100 + "%"

                    setTimeout(() => {
                        let num = 0;
                        sparkRefList[0].current.setClass('showObject')
                        let interval = setInterval(() => {
                            sparkRefList[num].current.setClass('hideObject')
                            if (num < 2) {
                                num++
                                sparkRefList[num].current.setClass('showObject')
                            }
                            else {
                                clearInterval(interval)
                            }
                        }, 100);
                    }, 600);



                    setTimeout(() => {

                        for (let i = currentNum - 10; i < currentNum; i++) {
                            if ((i + 1) % 10 != 0) {
                                disableStone[i].current.setClass('showObject')
                                stoneList[i].current.setClass('hideObject')
                                numberList[i].current.setStyle({ opacity: 0.4 })
                            }
                            stoneBaseList[i].current.style.cursor = 'default'
                        }

                        if (currentNum % 10 == 0) {
                            starRefList[currentStep].current.setClass('hide')
                            currentStep++;
                            movingSceneNum++;

                            baseRef.current.style.pointerEvents = 'none'

                            backRef.current.style.transition = '2s'
                            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                                movingSceneList[movingSceneNum])) + 'px, '
                                + _baseGeo.height * (translatestonetPos.y + movingSceneHeight[movingSceneNum]) + 'px)'




                            setTimeout(() => {
                                if (currentStep < 5) {
                                    startRepeatAudio()
                                    playEatingAni();
                                }
                                else {
                                    stopRepeatAudio();

                                    movingSceneNum++
                                    isGamestoneted = false;

                                    characterList[0].current.setClass('hideObject')
                                    spaceEmpty.current.setClass('hideObject')
                                    spaceShip.current.setClass('upDownAni1')

                                    backRef.current.style.transition = '2s'
                                    backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                                        movingSceneList[movingSceneNum])) + 'px, '
                                        + _baseGeo.height * (translatestonetPos.y + movingSceneHeight[movingSceneNum]) + 'px)'

                                    setTimeout(() => {
                                        setTimeout(() => {
                                            spaceShip.current.setClass('movingRight')
                                            setTimeout(() => {
                                                spaceShip.current.setStyle({
                                                    transform: 'translateX(' + _baseGeo.width * 1 + 'px)'
                                                })
                                                setTimeout(() => {
                                                    audioList.wooAudio.play();
                                                }, 200);
                                            }, 500);
                                        }, 4000);

                                        audioList.clapAudio.play();

                                        setTimeout(() => {
                                            baseRef.current.style.transition = '0.7s'
                                            baseRef.current.style.opacity = 0

                                            setTimeout(() => {
                                                finishGame();
                                            }, 700);

                                        }, 6000);
                                    }, 2000);
                                }

                                greenstone.current.style.opacity = 0

                            }, 2000);

                        }

                        else {
                            for (let i = currentNum - 2; i < currentNum; i++) {
                                stoneBaseList[i].current.style.cursor = 'default'
                            }
                            baseRef.current.style.pointerEvents = ''
                            startRepeatAudio()
                        }


                    }, 1000);
                }, 200);
            }
            else {

                audioList.tingAudio.pause();

                audioList.buzzAudio.currentTime = 0;
                audioList.buzzAudio.play();

                startRepeatAudio();

                showButtonAni(redstone, num)
            }
        }
    }

    function showButtonAni(obj, num) {

        //0., 0.153 , 0.223 , 0.157

        obj.current.style.transition = '0.0s'
        obj.current.style.opacity = '0'
        obj.current.style.bottom = (layoutstonetPos.y + 0.223 + heightList[num] * stepRange) * 100 + '%'
        if (obj == redstone)
            obj.current.style.left = (layoutstonetPos.x + 0.157 + num * targetRange + foodAreaLength * currentStep) * 100 + '%'
        else
            obj.current.style.left = (layoutstonetPos.x + 0.155 + num * targetRange + foodAreaLength * currentStep) * 100 + '%'

        setTimeout(() => {
            obj.current.style.transition = '0.5s'
            obj.current.style.opacity = 1
        }, 100);
    }


    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                ref={backRef}
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",
                }}>
                <img
                    style={{
                        width: '100%',
                        left: '0%', bottom: '0%',
                        transform: 'scale(15)'
                    }}
                    src={prePathUrl() + "images/SB_53_BG/SB54_PAN_bg_Space_01.svg"}
                />
                <img
                    style={{
                        width: '100%',
                        left: '0%', bottom: '0%',
                        transform: 'scale(15)'
                    }}
                    src={prePathUrl() + "images/SB_53_BG/SB54_PAN_bg_Space_02.svg"}
                />
                <img
                    style={{
                        width: '100%',
                        left: '0%', bottom: '0%',
                        transform: 'scale(15)'
                    }}
                    src={prePathUrl() + "images/SB_53_BG/SB54_PAN_bg_Space_03.svg"}
                />




                {Array.from(Array(5).keys()).map(value =>
                    <BaseImage
                        scale={0.4}
                        posInfo={{
                            b: layoutstonetPos.y - 0.25 + stoneHeightList[value],
                            l: layoutstonetPos.x - 0.14 + foodAreaLength * value + targetRange * 10 * value
                        }}
                        url={'SB_53_BG-Intro/Game3/SB_53_Intro_game3_stone_01 .svg'}
                    />
                )}



                {
                    Array.from(Array(50).keys()).map(value =>

                        <div
                            ref={stoneBaseList[value]}
                            onClick={() => { clickFunc(value) }}
                            style={{
                                position: 'absolute',
                                width: '8%',
                                height: '8%',
                                cursor: 'pointer',
                                // overflow: 'hidden',
                                bottom: (layoutstonetPos.y + 0.2 + heightList[value] * stepRange) * 100 + '%',
                                left: (layoutstonetPos.x + 0.18 +
                                    foodAreaLength * parseInt(value / 10) +
                                    value * targetRange) * 100 + '%',

                            }}>

                            < BaseImage
                                scale={1.5}
                                posInfo={{ t: -0.8, l: -0.3 }}
                                ref={stoneList[value]}
                                url={'SB_53_Prop-Interactive/SB_53_PI_game3_star_01.svg'}
                            />
                            < BaseImage
                                scale={1.5}
                                posInfo={{ t: -0.61, l: -0.3 }}
                                className='hideObject'
                                ref={disableStone[value]}
                                url={'SB_53_Prop-Interactive/SB_53_PI_game3_star_inactive_01.svg'}
                            />

                            < BaseImage
                                ref={numberList[value]}
                                scale={0.4}
                                posInfo={{ l: value == 49 ? 0.2 : 0.23, t: value > 9 ? 0.2 : 0.15 }}
                                url={'SB_53_Text-Interactive/SB_53_TI_Game3_0' + generateStandardNum(value + 1) + '.svg'}
                            />
                        </div>
                    )
                }


                <div
                    ref={sparkBaseRef}
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        width: '5%',
                        height: '5%',
                        left: 0 * 100 + '%',
                        bottom: 0 * 100 + '%'
                    }}
                >
                    {
                        Array.from(Array(3).keys()).map(value =>
                            <BaseImage
                                ref={sparkRefList[value]}
                                className='hideObject'
                                style={{ transform: 'scale(' + [1.5, 2, 3][value] + ')' }}
                                url={'magic/sb_52_magic_wand_sparkels_' + (1 + value) + '.svg'}
                            />
                        )
                    }
                </div>


                <BaseImage
                    ref={spaceShip}
                    scale={0.2}
                    posInfo={{
                        b: layoutstonetPos.y + 0.6 + stoneHeightList[5],
                        l: layoutstonetPos.x + 4.25
                    }}
                    className='hideObject'
                    url={'SB_53_Prop-Interactive/SB53_Spaceship_01.svg'}

                />

                <BaseImage
                    ref={spaceEmpty}
                    scale={0.2}
                    posInfo={{
                        b: layoutstonetPos.y + 0.58 + stoneHeightList[5],
                        l: layoutstonetPos.x + 4.24
                    }}
                    className='upDownAni'
                    url={'SB_53_Prop-Interactive/SB_53_PI_game3_spaceship_01.svg'}

                />

                <div
                    ref={greenstone}
                    style={{
                        position: 'absolute',
                        width: '12%',
                        height: '12%',
                        pointerEvents: 'none',
                        bottom: (layoutstonetPos.y + 0.223 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutstonetPos.x + 0.153) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB_53_Prop-Interactive/SB_53_PI_game3_star_green_HL_01.svg'}
                    />
                </div>

                <div
                    ref={redstone}
                    style={{
                        position: 'absolute',
                        width: '12%',
                        height: '12%',
                        pointerEvents: 'none',
                        bottom: (layoutstonetPos.y + 0.223 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutstonetPos.x + 0.157) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB_53_Prop-Interactive/SB_53_PI_game3_star_red_HL_01.svg'}
                    />
                </div>


                {Array.from(Array(4).keys()).map(value =>
                    <BaseImage
                        scale={0.1}
                        ref={characterList[value]}
                        posInfo={{
                            l: layoutstonetPos.x + 0.12 + 0.25 * value,
                            b: layoutstonetPos.y + 0.28 + [0, 0.15, 0.12][value]
                        }}
                        style={{ transform: 'scale(2) translateY(-10%)' }}
                        url={'animations/SB53_Alien_pose_0' + [value + 1] + '.svg'}
                    />
                )}
                {/* {Array.from(Array(4).keys()).map(value =>
                    <BaseImage
                        scale={0.05}
                        posInfo={{
                            l: layoutstonetPos.x + 0.12,
                            b: layoutstonetPos.y + 0.35
                        }}
                        // style={{ transform: 'rotate(180deg)' }}
                        url={'animations/SB53_intro_eyeblink_0' + [1 + value] + '.svg'}
                    />
                )} */}
            </div>

            <div
                style={{
                    position: "fixed", width: _geo.width * 0.25 + "px",
                    right: _geo.width * (0.01) + 'px'
                    , top: 0.04 * _geo.height + 'px'
                }}>
                <BaseImage
                    url={'SB_53_Icons/SB_53_ICON_03.svg'}
                />
            </div>

            {
                Array.from(Array(5).keys()).map(value =>
                    <div
                        style={{
                            position: "fixed", width: _geo.width * 0.042 + "px",
                            right: _geo.width * (value * 0.042 + 0.03) + 'px'
                            , top: 0.055 * _geo.height + 'px'
                        }}>
                        <BaseImage
                            url={'SB_53_Icons/ICON_01.png'}
                        />
                        <BaseImage
                            ref={starRefList[4 - value]}
                            url={'SB_53_Icons/ICON_02.png'}
                        />
                    </div>)
            }

        </div >
    );

}
