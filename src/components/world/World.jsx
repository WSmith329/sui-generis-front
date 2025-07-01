import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, Lightformer, useTexture, Text, useFont, Image } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three'

import Model from './Model'
import CameraController from './CameraController'
import { useMouseReactivePosition, useScrollReactivePosition } from './ReactivePosition'

import { MeshLambertMaterial, PCFShadowMap, PCFSoftShadowMap, ReinhardToneMapping, VSMShadowMap } from 'three';
import { useRef } from 'react';
import { lerp } from 'three/src/math/MathUtils';
import throttle from 'lodash.throttle';


function Floor() {
    let position = [0, -2.5];

    const mousePos = useMouseReactivePosition(position[0], position[1])
    const { position: scrollPos, scrollProgress } = useScrollReactivePosition(position[0], position[1])

    const ref = useRef()
    const refBelow = useRef()

    const holeRadius = 2.5 * scrollProgress

    const shape = React.useMemo(() => {
        const shape = new THREE.Shape()
        shape.moveTo(-10, -10)
        shape.lineTo(10, -10)
        shape.lineTo(10, 10)
        shape.lineTo(-10, 10)
        shape.lineTo(-10, -10)
      
        if (holeRadius > 0) {
          const holePath = new THREE.Path()
          holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false)
          shape.holes = [holePath]
        } else {
          shape.holes = []
        }
      
        return shape
      }, [holeRadius])

    useFrame(() => {
        if (ref.current) {
            ref.current.position.x = mousePos.x
            ref.current.position.y = mousePos.y + (scrollPos.y - position[1])
            ref.current.position.z = 0
            ref.current.rotation.x = -Math.PI / 2
        }
        if (refBelow.current) {
            refBelow.current.position.x = mousePos.x
            refBelow.current.position.y = mousePos.y + (scrollPos.y - position[1]) - 0.02
            refBelow.current.position.z = 0
            refBelow.current.rotation.x = Math.PI / 2
        }
    })

    return (
        <>
            <mesh ref={ref} receiveShadow>
                <shapeGeometry args={[shape]} />
                <meshLambertMaterial color='#f5e9d5' />
            </mesh>
            <mesh ref={refBelow} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
                <shapeGeometry args={[shape]} />
                <meshLambertMaterial color='#f5e9d5' />
            </mesh>
        </>
    )
}

function HeroTextImage({ url, x, y }) {
    const { position: scrollPos, scrollProgress } = useScrollReactivePosition(x, y)
    const ref = useRef()

    useFrame(() => {
        if (ref.current) {
            ref.current.position.y = scrollPos.y - y
        }
    })

    return (
        <Image
            ref={ref}
            position={[x, y, -2]}
            url={url}
            scale={[5.5, 2, 1]}
            transparent
        />
    )
}

function Wall({ position, rotation }) {
    const mousePos = useMouseReactivePosition(position[0], position[1])
    const { position: scrollPos, scrollProgress } = useScrollReactivePosition(position[0], position[1])
    const ref = useRef()

    useFrame(() => {
        if (ref.current) {
            ref.current.position.x = mousePos.x
            ref.current.position.y = mousePos.y + (scrollPos.y - position[1])
        }
    })

    return (
        <mesh ref={ref} position={position} rotation={rotation} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshLambertMaterial color='#f5e9d5' />
        </mesh>
    )
}


export default function World() {

    return (
        <div id='canvas-container'>
            <Canvas id='canvas' shadows gl={{ alpha: true }}>
                <Suspense fallback={null}>
                    <HeroTextImage url='/images/Sui.png' x={-5} y={0} />
                    <HeroTextImage url='/images/Generis Serif.png' x={5} y={0} />

                    <Model />

                    <Floor />
                    {/* <FloorText text='ONE OF A KIND.' /> */}

                    <group>
                        {/* Back wall */}
                        <Wall position={[0, 7.5, -10]} />

                        {/* Left wall */}
                        <Wall position={[-10, 7.5, 0]} rotation={[0, Math.PI / 2, 0]} />

                        {/* Right wall */}
                        <Wall position={[10, 7.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
                    </group>

                    <spotLight position={[0, 10, 10]} intensity={1000} color={0xffffff} castShadow shadow-mapSize-width={1024 * 4} shadow-mapSize-height={1024 * 4} />
                    <rectAreaLight
                        position={[0, 0, 15]}
                        rotation={[0, 0, 0]}
                        width={30}
                        height={10}
                        intensity={10}
                        color={0xffffff}
                    />
                    <hemisphereLight args={[0xfff8e7, 0xfff8e7, 4]} />

                    {/* <CameraController /> */}
                </Suspense>
            </Canvas>
        </div>
    )
}