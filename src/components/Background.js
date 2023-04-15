import * as THREE from 'three'
import { useRef, Suspense, useState } from 'react';
import { extend, useFrame } from '@react-three/fiber'

import backgroundColor from './DropDown';

import { GradientShader3Material } from "./../shaders/gradient3";
import { ParticlizeImgShaderMaterial } from "./../shaders/particlizeImg";
import { BgGradientShaderMaterial } from '../shaders/bggradient';
import { ImgBgShaderMaterial } from '../shaders/imgbgshader';
import { extractColors } from 'extract-colors'

extend({ GradientShader3Material });
extend({ ParticlizeImgShaderMaterial });
extend({ BgGradientShaderMaterial });
extend({ ImgBgShaderMaterial });



var clock = new THREE.Clock();

export function Background(props) {
  const ref = useRef();
  
  const texture = props.texture;

  //needed to use promise variable type from extractColors (async)
  const [imgColors, setImgColors] = useState([0, 0, 0]);

  //receives theme chosen from dropdown. currently in form of string description, ie 'party' and 'mood'
  //will be undefined if no option is chosen. not sure how to set a default without making the dropdown display the default also :/
  const bgc = backgroundColor.theme;
  //testing: console.log(bgc);

  var idx = 0;
  for (var i = 0; i < props.freq.length; i++) {
    if (props.freq[i] >= props.freq[idx]) {
      idx = i;
    }
  }
  idx /= 2;

  //texture to image
  const image = texture.image

  //function to extract colors, then updates state with extracted colors
  extractColors(image)
  .then(async (value) => {
    let id = await value

    let imgColor1 = new THREE.Color(id[0].hex)
    let imgColor2 = new THREE.Color(id[1].hex)
    let imgColor3 = new THREE.Color(id[2].hex)
  
    setImgColors([imgColor1, imgColor2, imgColor3])
  })
  

  const colors = [new THREE.Color(0.5, 0.2, 0.2), 
    new THREE.Color(0.604, 0.388, 0.141), 
    new THREE.Color(0.502, 0.502, 0.0), 
    new THREE.Color(0.275, 0.6, 0.565),
    new THREE.Color(0.0, 0.0, 0.459),
    new THREE.Color(0.863, 0.745, 1.0),
    new THREE.Color(0.667, 1.0, 0.765),
    new THREE.Color(0.98, 0.745, 0.831),
    new THREE.Color(1.0, 0.847, 0.694),
    new THREE.Color(1.0, 0.98, 0.784)]

  const color = colors[idx];

  /*
  const color1 = new THREE.Color(0x1f2b14);
  const color2 = new THREE.Color(0xd1e9ad);
  const color3 = new THREE.Color(0x6b894b);

  const color4 = new THREE.Color(0x0f5472);
  const color5 = new THREE.Color(0x788ea9);
  const color6 = new THREE.Color(0xc3bbd7);
  */

  var shader;
  switch (bgc) {
    case "image":
      shader = <imgBgShaderMaterial uTime={clock.getElapsedTime()} uColor1={imgColors[0]} uColor2={imgColors[1]} uColor3={imgColors[2]} uTexture={texture} ref={ref} />;
      break;
    case "mood":
      shader = <bgGradientShaderMaterial uFreqArray={props.freq} uTime={clock.getElapsedTime()} uColor1={color} uTexture={texture} ref={ref} />;
      break;
    default:
      shader = <bgGradientShaderMaterial uFreqArray={props.freq} uTime={clock.getElapsedTime()} uColor1={color} uTexture={texture} ref={ref} />;
      break;
  }


  return (
    <group>
      <mesh position={[0.5, 0.5, -1]}>
        <planeGeometry args={[5, 3, 8, 8]} />
        {shader}
        {/* <bgGradientShaderMaterial uFreqArray={props.freq} uTime={clock.getElapsedTime()} uColor1={color} uTexture={texture} ref={ref} /> */}
        {/* <imgBgShaderMaterial uTime={clock.getElapsedTime()} uColor1={color1} uColor2={color2} uColor3={color3} uTexture={texture} ref={ref} /> */}
      </mesh>
      {/* <mesh position={[0, 0, -1]}>
        <planeGeometry args={[3, 2, 8, 8]}/>
        <meshBasicMaterial/>
      </mesh> */}
    </group>
  )
}