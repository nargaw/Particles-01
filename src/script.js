import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
const canvas = document.querySelector('.webgl')

class NewScene{
    constructor(){
        this._Init()
    }
    
    _Init(){
        this.scene = new THREE.Scene()
        this.clock = new THREE.Clock()
        this.InitCamera()
        this.InitRenderer()
        this.BoxParticles()
        this.InitLights()
        this.InitControls()
        this.Update()
        window.addEventListener('resize', () => {
            this.Resize()
        })
    }

    BoxParticles(){
        this.geometry = new THREE.BoxGeometry(1, 1, 1, 200, 20, 20),
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                u_time: { value: 0},
                u_size: { value: 30 * this.renderer.getPixelRatio()}
            },
            fragmentShader: fragment,
            vertexShader: vertex
        })
        this.particles = new THREE.Points(this.geometry,this.material)
        this.scene.add(this.particles)
    }
    
    InitRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        })
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera)
    }

    InitCamera(){
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 5)
        this.scene.add(this.camera)
    }

    InitLights(){
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        this.scene.add(this.ambientLight)
    }

    InitControls(){
        this.controls = new OrbitControls(this.camera, canvas)
        this.controls.enableDamping = true
        this.controls.update()
    }

    Resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    Update(){
        requestAnimationFrame(() => {
            this.elapsedTime = this.clock.getElapsedTime()
            this.material.uniforms.u_time.value = this.elapsedTime   
            this.renderer.render(this.scene, this.camera)
            this.controls.update()
            this.Update()
        })  
    }
}

let _APP = null

window.addEventListener('DOMContentLoaded', () => {
    _APP = new NewScene()
})