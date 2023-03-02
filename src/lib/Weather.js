import * as THREE from 'three';

export class Weather {
    constructor(info={}) {
        this.scene = info.scene;
        this.renderer = info.renderer;
        this.weatherInfo = info.weatherInfo || 'snow';
        this.weatherRange = info.weatherRange || 500;
        this.numberOfParticles = info.numberOfParticles || 15000;
        this.textureLoader = info.textureLoader

        this.weather;

        this.rainDropMap = this.textureLoader.load('assets/images/raindrop.png');
        this.snowMap = this.textureLoader.load('assets/images/snowflake4.png');


        this.rainMaterial = new THREE.PointsMaterial({
            size: 0.7,
            map: this.rainDropMap,
            // blending: THREE.AdditiveBlending,
            transparent: true
        });

        this.snowMaterial = new THREE.PointsMaterial({
            size: 3,
            map: this.snowMap,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        this.sunnyMaterial = new THREE.PointsMaterial({
            size: 0,
            transparent: true
        });

        this.geometry = new THREE.BufferGeometry();

        const vertices = [];

        for ( let i = 0; i < this.numberOfParticles; i++) {

            const x = Math.random() * this.weatherRange - this.weatherRange/2;
            const y = Math.random() * this.weatherRange - this.weatherRange/2;
            const z = Math.random() * this.weatherRange - this.weatherRange/2;

            vertices.push(x, y, z);
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        if(this.weatherInfo === 'rain') {
            this.weather = new THREE.Points(this.geometry, this.rainMaterial);
            this.weather.userData = 'rain'
        } else if (this.weatherInfo === 'snow') {
            this.weather = new THREE.Points(this.geometry, this.snowMaterial);
            this.weather.userDate = 'snow';
        }

        this.scene.add(this.weather);
    }

    update() {

        if(this.weather.userDate === 'snow') {
            if(this.weather.position.y < 0) {
                this.weather.position.y = 200;     
            } else {
                this.weather.position.y -= 0.1;
            }
        } else {
            if(this.weather.position.y < 0) {
                this.weather.position.y = 200;     
            } else {
                this.weather.position.y -= 1;
            }
        }

    }

    close() {
        this.scene.remove(this.weather);
    }

    change(weatherState) {
        
        if(weatherState === 'rain') {
            this.weather.material = this.rainDropMap;
            this.weather.userData = 'rain'
        } else if (weatherState === 'snow') {
            this.weather.material = this.snowMaterial;
            this.weather.userDate = 'snow';
        } else if (weatherState === 'sunny') {
            this.weather.material = this.sunnyMaterial;
            this.weather.userDate = 'sunny';
        }

        this.update();
    }



}