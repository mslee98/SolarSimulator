import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Weather } from './Weather';
import { Stats } from 'three/examples/jsm/libs/stats.module';

/** 윤관석 생성을 위한 후처리 방식 */
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { radToDeg } from 'three/src/math/MathUtils';
// import { FXAAShader } from 'three/examples/jsm/postprocessing/FXAAShader';

export class Simulator {
    constructor() {

        this.testArr = ['snow', 'sunny', 'rain'];

        //common - 공통으로 사용하는 Lib
        this.textureLoader = new THREE.TextureLoader();

        this.loadingManager = new THREE.LoadingManager();

        this.loadingManager.onStart = () => {
            console.log("start");
        }

        this.loadingManager.onLoad = () => {
            document.querySelector("#loadingDiv").style.display = 'none';
        }

        this.GLTFLoader = new GLTFLoader(this.loadingManager);
        this.clock = new THREE.Clock();

        //기본 구조물 제외한 메쉬 배열
        this.meshes = [];
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
        this.scene.fog = new THREE.Fog( this.scene.background, 1, 5000 );
        
        // const canvas = document.querySelector("#three-canvas");
        const container = document.querySelector("#container");

        this.renderer = new THREE.WebGLRenderer({
            // canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.enabled = true;
        
        this.camera = new THREE.PerspectiveCamera(
            30, 
            window.innerWidth / window.innerHeight,
            1, 
            5000
            );
        this.camera.position.set(643.1305084273803, 139.06853155654287, 238.83695832229586);
        
        
        
        const cameraRot = new THREE.Euler(
            {
                x: -0.5485691941689252,
                y: 0,
                z: 0
            })

        const cameraPos = 
            {
                x: 168.7505884033234,
                y: 30.050791561937714,
                z: 29.378969301287906
            };

        window.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                
                new TWEEN.Tween(this.camera.position).to(cameraPos,2500).easing(TWEEN.Easing.Quadratic.InOut).start();
                // new TWEEN.Tween(this.camera.rotation).to(cameraRot,2500).start();
                console.log(this.camera.position);
            }
        });
        // this.camera.rotation.set(-0.5256591128277844, 0.9588157043076128, 0.4433008281004193);
        

            // setTimeout(() => {
            //     this.cameraInitMovePos = new TWEEN.Tween(this.camera.position).to({
            //         x: 232.8060809659496,
            //         y: 46.316399327339255,
            //         z: 39.18648437646028,
            //     },2000).easing(TWEEN.Easing.Quadratic.Out).start();
    
            //     this.cameraInitMoveRot = new TWEEN.Tween(this.camera.rotation).to({
            //         x: -1.3884179381598099,
            //         y: 1.3498256347676325,
            //         z: 1.3839767101982794,
            //     },2000).easing(TWEEN.Easing.Quadratic.Out).start();

            // }, 2000);

        
        this.weather = new Weather({
            scene: this.scene,
            renderer: this.renderer,
            textureLoader: this.textureLoader,
            weatherInfo: 'snow'
        });

        setInterval(() => {
            this.weather.change(this.testArr[Math.floor(Math.random()*3)]);
        }, 10000);

        /** Postprocessing */
        this.composer = new EffectComposer(this.renderer);

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);

        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), 
            this.scene, 
            this.camera
        );

        this.outlinePass.edgeStrength = Number(5); //Outline 두께
        this.outlinePass.edgeGlow = Number(1);//번짐?
        this.outlinePass.edgeThickness = Number(1);//
        // this.outlinePass.pulsePeriod = Number(0);
        this.outlinePass.visibleEdgeColor.set("#ff0000");
        // this.outlinePass.hiddenEdgeColor.set("#190a05");
        // this.outlinePass.selectedObjects = this.meshes;

        this.composer.addPass(this.outlinePass);

        setTimeout(this.weather.change(this.testArr[Math.floor(Math.random() * 3)]), 10000);

        this._setUpLight();
        this._setUpDom();
        this._setUpGround();
        this._setUpControls();
        // this._setUpModel();


        // this._setUpCloud();
        

        this._animation();
        
        window.addEventListener('resize', this._resize.bind(this));
        // window.addEventListener('resize', this._resize);

        this.renderer.domElement.addEventListener('mousemove', this._onMouseMove.bind(this), false);
        this.renderer.domElement.addEventListener('dblclick', this._onMouseDblClick.bind(this), false);    
    }

    /** Get Mouse Coordinates */
    _getMouseCoordinates(e) {
        const x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        const y =  -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

        return new THREE.Vector2(x,y);
    }

    _onMouseMove(e) {

        const mouse = this._getMouseCoordinates(e);

        const raycaster = new THREE.Raycaster();

        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.meshes);

        if(intersects.length > 0) {
            const selectedObject = intersects[0].object;

            this._addSelectedObject(selectedObject);
            this.outlinePass.selectedObjects = this.selectedObjects;
        } else {
            this.outlinePass.selectedObjects = [];
        }
    }

    /** object root search 
     *  Modeling 파일 수정 해야함 패널 따로 / 건물 따로 등
     */
    _addSelectedObject(obj) {
        this.selectedObjects = [];

        const resultObj = obj.parent.parent.parent;

        this.selectedObjects.push(resultObj);
    }

    _onMouseDblClick(e) {

        //only building
        const mouse = this._getMouseCoordinates(e);

        const raycaster = new THREE.Raycaster();

        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.meshes);

        if(intersects.length > 0) {

            const object = intersects[0].object.parent.parent.parent.parent.parent.userData;
            console.log(object);

            if(object === 'kepko') {

            }
        }
    }

    
    _setUpLight() {

        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        this.hemiLight.color.setHSL( 0.6, 1, 0.6 );
        this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        this.hemiLight.position.set( 0, 150, 0 );
        this.scene.add( this.hemiLight );
        
        // const hemiLightHelper = new THREE.HemisphereLightHelper( this.hemiLight, 10);
        // this.scene.add(this.hemiLightHelper);
        
        this.dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        this.dirLight.color.setHSL( 0.1, 1, 0.95 );
        this.dirLight.position.set(0, 200, 0);
        //dirLight.position.multiplyScalar( 30 );
        
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
	    this.dirLight.shadow.mapSize.height = 2048;
        const d = 100;
        
        this.dirLight.shadow.camera.left = - d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = - d;
        
        this.dirLight.shadow.camera.far = 3500;
        this.dirLight.shadow.bias = - 0.0001;
        
        this.scene.add( this.dirLight );

        const dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 50 );
        // this.scene.add( dirLightHelper );
        
    }

    _setUpDom() {
        const vertexShader = document.getElementById( 'vertexShader' ).textContent;
        const fragmentShader = document.getElementById( 'fragmentShader' ).textContent;

        const uniforms = {
            'topColor': { value: new THREE.Color( 0x0077ff ) },
            'bottomColor': { value: new THREE.Color( 0xffffff ) },
            'offset': { value: 33 },
            'exponent': { value: 0.6 }
        };
        uniforms[ 'topColor' ].value.copy( this.hemiLight.color );
    
        this.scene.fog.color.copy( uniforms[ 'bottomColor' ].value );
    
        const skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
        const skyMat = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        } );
        
        const sky = new THREE.Mesh( skyGeo, skyMat );
        this.scene.add( sky );
    }

    _setUpGround() {
        const groundGeo = new THREE.PlaneGeometry( 1000, 1000 ,10, 10);

        const groundGeoVertices = groundGeo.attributes.position.array;

        for(let i = 2; i < groundGeoVertices.length; i += 3) {
            if(groundGeoVertices[i - 2] > 250 || groundGeoVertices[i - 1] > 250 || groundGeoVertices[i - 1] < -250 || groundGeoVertices[i - 2] < -250) {
                groundGeoVertices[i] = Math.random() * 50 - 25;
            }
        };

        groundGeo.attributes.position.array = groundGeoVertices; 

        const groundMat = new THREE.MeshLambertMaterial( { color: 0xffffff, visible: true, wireframe: false } );
        groundMat.color.setHSL( 0.095, 1, 0.75 );

        const ground = new THREE.Mesh( groundGeo, groundMat );
        ground.position.y = 0;
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add( ground );

        this.axesHelper = new THREE.AxesHelper(500,500,500);
        this.scene.add(this.axesHelper);

        this.gridHelper = new THREE.GridHelper(500, 500, 10, 10);
        // this.scene.add(this.gridHelper);
    }

    _setUpControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI /2 - 0.2;
        this.controls.maxDistance = 700;
        this.controls.minDistance = 100;
        this.controls.pasSpeed = 0.5;
        this.controls.rotateSpeed = 0.2;
        this.controls.zoomSpeed = 0.5;
        this.controls.enableDamping = true;
        // this.controls.screenSpacePanning = true;
        this.controls.update();
    }

    _setUpModel() {

        this.GLTFLoader.load('assets/models/solar_panel_test.glb', gltf => {
            const mesh = gltf.scene;

            gltf.scene.traverse( (item) => {
                if(item.isMesh) {
                    item.castShadow = true;
                    item.receiveShadow = true;
                }
            })

            const s = 0.35;
            mesh.scale.set( s, s, s );
            mesh.position.set(0, 1, -35);

            this.scene.add( mesh );

            this.meshes.push(mesh);
        });

        this.GLTFLoader.load('assets/models/kepco_solar.glb', gltf => {
            const mesh = gltf.scene;

            gltf.scene.traverse( (item) => {
                if(item.isMesh) {
                    item.castShadow = true;
                    item.receiveShadow = true;
                }
            })

            const s = 0.35;
            mesh.scale.set( s, s, s );
            mesh.position.set(0, 1, 35);

            this.scene.add( mesh );
            this.meshes.push(mesh);
            mesh.userData = 'kepko'
        });
    }

    _resize() {

        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // _setUpCloud() {
    //     this.cloudTexture = textureLoader.load()
    // }

    
    _animation() {

        let time;//0.7


        if(this.simulatorYn) {
            time = this.clock.getElapsedTime() * 9;//0.7
            window.simulatorChart._update(time);
        } else {
            time = this.clock.getElapsedTime() * 0.7
        }
        // console.log(this.camera.rotation);
        //테스트 애니메이션 Start
        

        // 테스트 애니메이션 End

        // console.log(this.camera);

        this.dirLight.position.x = Math.cos(time) * -100;
	    this.dirLight.position.y = Math.sin(time) * 50;

        // console.log(Math.sin(time) * 10);
        this.controls.update();
        this.weather.update();


        TWEEN.update();
        requestAnimationFrame(this._animation.bind(this));
        this._render();
    }

    _render() {
        this.composer.render();
        // this.renderer.render(this.scene, this.camera);
    }

    _testModeling() {
        
        this._setUpModel()
    }

    _testVariable() {
        //변수주고 dirLight 빠르게 돌아가게끔

        this.simulatorYn = true;
    }

}