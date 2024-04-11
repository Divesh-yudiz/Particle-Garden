import {
  Color,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  Mesh,
  SphereGeometry,
  MeshMatcapMaterial,
  AxesHelper,
  PlaneGeometry,
  BufferGeometry,
  Points,
  PointsMaterial,
  BufferAttribute,
  ShaderMaterial,
  Raycaster,
  Vector2,
  Clock,
  Vector3,
  MeshBasicMaterial,
  TextureLoader,
  AmbientLight,
  DoubleSide,
  UnsignedByteType,
} from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats-js'
import LoaderManager from '@/js/managers/LoaderManager'
import GUI from 'lil-gui'
import vertexShader from '../glsl/main.vert'
import fragmentShader from '../glsl/main.frag'
import { randFloat } from 'three/src/math/MathUtils'
import gsap from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth;
let windowHalfY = window.innerHeight;

export default class MainScene {
  #canvas
  #renderer
  #scene
  #camera
  #cameraOrtho
  #controls
  #stats
  #width
  #height
  #mesh
  #mesh2
  #mesh3
  #mesh4
  #mesh5
  #mesh6
  #mesh7
  #mesh8
  #mesh9
  #mesh10
  #mesh11
  #mesh12
  #mesh13
  #mesh14
  #mesh15
  #mesh16
  #mesh17
  #mesh18
  #click1
  #click2
  #click3
  #guiObj = {
    progress: 0,
    frequency: 0.373,
  }

  constructor() {
    this.#canvas = document.querySelector('.scene')
    this.init()
  }

  init = async () => {
    // Preload assets before initiating the scene
    const assets = [
      {
        name: 'castle',
        texture: './img/castle-4.png',
      },
      {
        name: 'garden',
        texture: './img/Maze.jpeg',
      },
      {
        name: 'tree',
        texture: './img/tree.png',
      },
      {
        name: 'bg',
        texture: './img/bg.jpeg',
      },
      {
        name: 'bg-1',
        texture: './img/bg-1.jpeg',
      },
      {
        name: 'tree-1',
        texture: './img/tree-1.png',
      },
      {
        name: 'click-1',
        texture: './img/click.png',
      },
      {
        name: 'click-2',
        texture: './img/click.png',
      },
      {
        name: 'click-3',
        texture: './img/click.png',
      },
    ]

    await LoaderManager.load(assets)
    console.log("Hello")
    this.raycaster = new Raycaster();
    this.pointer = new Vector2();
    this.point = new Vector3();
    this.setStats()
    this.setScene()
    this.setRender()
    this.setCamera()
    // this.setOrthogonalCamera()
    this.setControls()
    this.setAxesHelper()
    this.setLights()
    this.setParticleGrid()
    // this.setClicks();
    this.rayCasterEvent()
    this.handleResize()
    // this.setGUI()
    // start RAF
    this.events()
  }

  rayCasterEvent() {
    let dummyPlane = new Mesh(new PlaneGeometry(100, 100), new MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
    // this.#scene.add(dummyPlane);
    let test = new Mesh(new SphereGeometry(10, 10, 10), new MeshBasicMaterial({ color: 0xff0000, wireframe: false }));
    // this.#scene.add(test);
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

    const onMouseMove = (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      let intersects = this.raycaster.intersectObjects([this.#mesh]);

      if (intersects[0]) {
        // console.log(intersects[0].point)
        test.position.copy(intersects[0].point);
        this.point.copy(intersects[0].point);
      }
    };

    const onTouchMove = (event) => {
      event.preventDefault();

      const touch = event.touches[0];
      this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

      let intersects = this.raycaster.intersectObjects([this.#mesh]);

      if (intersects[0]) {
        // console.log(intersects[0].point)
        test.position.copy(intersects[0].point);
        this.point.copy(intersects[0].point);
      }
    };

    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("touchmove", onTouchMove, false);
  }

  /**
   * Our Webgl renderer, an object that will draw everything in our canvas
   * https://threejs.org/docs/?q=rend#api/en/renderers/WebGLRenderer
   */
  setRender() {
    this.#renderer = new WebGLRenderer({
      canvas: this.#canvas,
      antialias: true,
    })
  }

  setLights() {
    const ambientLight = new AmbientLight(0xffffff, 0.5); // Color: white, Intensity: 0.5
    // this.#scene.add(ambientLight);
  }

  // onPointerMove(event) {
  //   if (event.isPrimary === false) return;

  //   mouseX = event.clientX - windowHalfX;
  //   mouseY = event.clientY - windowHalfY;

  //   const mousePosition = new Vector2(mouseX, mouseY);
  //   if (this.material) {
  //     console.log(mousePosition)
  //     this.material.uniforms.uMousePosition.value = [mousePosition.x, mousePosition.y];
  //   }
  // }

  /**
   * This is our scene, we'll add any object
   * https://threejs.org/docs/?q=scene#api/en/scenes/Scene
   */
  setScene() {
    this.#scene = new Scene()
    this.#scene.background = new Color(0x372A34)
    // this.#scene.background = new Colo  r(0xff0000)
  }

  setCamera() {
    const aspectRatio = this.#width / this.#height
    const fieldOfView = 60
    const nearPlane = 0.01
    const farPlane = 10000

    this.#camera = new PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
    // this.#camera.position.x = -45.86058465790959
    this.#camera.position.y = -50.84439209875961
    this.#camera.position.z = 500
    this.#scene.add(this.#camera)
  }
  setOrthogonalCamera() {
    const aspectRatio = this.#width / this.#height
    const left = -this.#width / 2
    const right = this.#width / 2
    const top = this.#height / 2
    const bottom = -this.#height / 2
    const nearPlane = 0.1
    const farPlane = 100000

    this.#cameraOrtho = new OrthographicCamera(left, right, top, bottom, nearPlane, farPlane)
    this.#cameraOrtho.position.x = -45.86058465790959
    this.#cameraOrtho.position.y = -90.84439209875961
    this.#cameraOrtho.position.z = 300

    this.#scene.add(this.#cameraOrtho)
  }

  cameraPosition(px, py, pz) {
    gsap.to(this.#camera.position, {
      x: px,
      y: py,
      z: pz,
      duration: 2.5
    })
  }

  cameraRotaion(rx, ry, rz) {
    gsap.to(this.#camera.rotation, {
      x: rx,
      y: ry,
      z: rz,
      duration: 2.2
    })
  }

  /**
   * Threejs controls to have controls on our scene
   * https://threejs.org/docs/?q=orbi#examples/en/controls/OrbitControls
   */
  setControls() {
    this.#controls = new MapControls(this.#camera, this.#renderer.domElement)
    this.#controls.enableDamping = true
    this.#controls.dampingFactor = 0.04;

    // this.#controls = new FirstPersonControls(this.#camera, this.#renderer.domElement);
    // this.#controls.movementSpeed = 8;
    // this.#controls.lookSpeed = 0.08;

    // this.#controls = new FlyControls(this.#camera, this.#renderer.domElement);
    // console.log(this.#controls)
    // this.#controls.movementSpeed = 8;
    // this.#controls.lookSpeed = 0.08;
  }

  setAxesHelper() {
    const axesHelper = new AxesHelper(3)
    this.#scene.add(axesHelper)
  }

  setParticleGrid() {
    const geometry = new BufferGeometry(10, 10, 100, 100);

    const multiplier = 30
    const nbColumn = 9 * multiplier;
    const nbLines = 9 * multiplier;

    const vertices = [];
    const initPosition = [];
    for (let i = 0; i < nbColumn; i++) {
      for (let y = 0; y < nbLines; y++) {
        const point = [i, y, 0];
        const initPoints = [i - nbColumn / 2, y - nbColumn / 2, randFloat(0, 1000)];
        vertices.push(...point);
        initPosition.push(...initPoints);
      }
    }

    console.log(vertices)

    const vertices32 = new Float32Array(vertices)
    const initVertices32 = new Float32Array(initPosition)

    geometry.setAttribute('position', new BufferAttribute(vertices32, 3));
    geometry.setAttribute('initPosition', new BufferAttribute(initVertices32, 3));
    geometry.center();


    const createShaderMaterial = (texture, frequency) => {
      return new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uPointSize: { value: 3 },
          uTexture: { value: LoaderManager.assets[texture].texture },
          uNbColumns: { value: nbColumn },
          uNbLines: { value: nbLines },
          uProgress: { value: this.#guiObj.progress },
          uFrequency: { value: frequency },
          uTime: { value: 0 },
          uMousePosition: { value: new Vector3() },
          uTextureSize: { value: new Vector2(this.#width, this.#height) },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
    };

    const material = createShaderMaterial('castle', this.#guiObj.frequency);
    const material2 = createShaderMaterial('garden', 0.054);
    const material3 = createShaderMaterial('tree', 0.041);
    const material4 = createShaderMaterial('tree', 0.041);
    const material5 = createShaderMaterial('tree-1', 0.041);
    const material6 = createShaderMaterial('tree-1', 0.041);
    const material7 = createShaderMaterial('tree-1', 0.041);
    const material8 = createShaderMaterial('tree-1', 0.041);
    const material9 = createShaderMaterial('tree-1', 0.041);
    const material10 = createShaderMaterial('tree-1', 0.041);
    const material11 = createShaderMaterial('tree-1', 0.041);
    const material12 = createShaderMaterial('tree-1', 0.041);
    const material13 = createShaderMaterial('tree-1', 0.041);
    const material14 = createShaderMaterial('tree-1', 0.041);
    const material15 = createShaderMaterial('tree-1', 0.041);
    const material16 = createShaderMaterial('tree-1', 0.041);
    const material17 = createShaderMaterial('tree-1', 0.041);
    const material18 = createShaderMaterial('tree-1', 0.041);

    this.material = material;
    this.material2 = material2;
    this.material3 = material3;
    this.material4 = material4;
    this.material5 = material5;
    this.material6 = material6;
    this.material7 = material7;
    this.material8 = material8;
    this.material9 = material9;
    this.material10 = material10;
    this.material11 = material11;
    this.material12 = material12;
    this.material13 = material13;
    this.material14 = material14;
    this.material15 = material15;
    this.material16 = material16;
    this.material17 = material17;
    this.material18 = material18;
    // this.material2.uniforms.uTexture.value = LoaderManager.assets['image2'].texture;

    this.#mesh = new Points(geometry, this.material)
    this.#mesh2 = new Points(geometry, this.material2)
    this.#mesh3 = new Points(geometry, this.material3)
    this.#mesh4 = new Points(geometry, this.material4)
    this.#mesh5 = new Points(geometry, this.material5)
    this.#mesh6 = new Points(geometry, this.material6)
    this.#mesh7 = new Points(geometry, this.material7)
    this.#mesh8 = new Points(geometry, this.material8)
    this.#mesh9 = new Points(geometry, this.material9)
    this.#mesh10 = new Points(geometry, this.material10)
    this.#mesh11 = new Points(geometry, this.material11)
    this.#mesh12 = new Points(geometry, this.material12)
    this.#mesh13 = new Points(geometry, this.material13)
    this.#mesh14 = new Points(geometry, this.material14)
    this.#mesh15 = new Points(geometry, this.material15)
    this.#mesh16 = new Points(geometry, this.material16)
    this.#mesh17 = new Points(geometry, this.material17)
    this.#mesh18 = new Points(geometry, this.material18)
    this.#mesh2.scale.set(2, 2, 2);
    this.#mesh2.position.y = -100;


    this.#mesh3.scale.set(0.5, 0.5, 0.5);
    this.#mesh3.position.set(70, -40, 0);

    this.#mesh4.scale.set(0.5, 0.5, 0.5);
    this.#mesh4.position.set(-150, -40, 0);

    this.#mesh5.scale.set(0.3, 0.3, 0.3);
    this.#mesh5.position.set(200, -60, -250);

    this.#mesh6.scale.set(0.3, 0.3, 0.3);
    this.#mesh6.position.set(200, -60, -150);

    this.#mesh7.scale.set(0.3, 0.3, 0.3);
    this.#mesh7.position.set(200, -60, -50);

    this.#mesh8.scale.set(0.3, 0.3, 0.3);
    this.#mesh8.position.set(200, -60, 50);

    this.#mesh9.scale.set(0.3, 0.3, 0.3);
    this.#mesh9.position.set(200, -60, 150);

    this.#mesh10.scale.set(0.3, 0.3, 0.3);
    this.#mesh10.position.set(100, -60, 200);

    this.#mesh11.scale.set(0.3, 0.3, 0.3);
    this.#mesh11.position.set(150, -60, -250);

    this.#mesh12.scale.set(0.3, 0.3, 0.3);
    this.#mesh12.position.set(-150, -60, -250);

    this.#mesh13.scale.set(0.3, 0.3, 0.3);
    this.#mesh13.position.set(-200, -60, -250);

    this.#mesh14.scale.set(0.3, 0.3, 0.3);
    this.#mesh14.position.set(-200, -60, -150);

    this.#mesh15.scale.set(0.3, 0.3, 0.3);
    this.#mesh15.position.set(-200, -60, -50);

    this.#mesh16.scale.set(0.3, 0.3, 0.3);
    this.#mesh16.position.set(-200, -60, 50);

    this.#mesh17.scale.set(0.3, 0.3, 0.3);
    this.#mesh17.position.set(-200, -60, 150);

    this.#mesh18.scale.set(0.3, 0.3, 0.3);
    this.#mesh18.position.set(-100, -60, 200);

    this.#mesh.position.set(0, -20, -300);


    this.#scene.add(this.#mesh)
    this.#scene.add(this.#mesh2)
    this.#scene.add(this.#mesh3)
    this.#scene.add(this.#mesh4)
    this.#scene.add(this.#mesh5)
    this.#scene.add(this.#mesh6)
    this.#scene.add(this.#mesh7)
    this.#scene.add(this.#mesh8)
    this.#scene.add(this.#mesh9)
    this.#scene.add(this.#mesh10)
    this.#scene.add(this.#mesh11)
    this.#scene.add(this.#mesh12)
    this.#scene.add(this.#mesh13)
    this.#scene.add(this.#mesh14)
    this.#scene.add(this.#mesh15)
    this.#scene.add(this.#mesh16)
    this.#scene.add(this.#mesh17)
    this.#scene.add(this.#mesh18)

    // this.#controls.target.set(0,-150,-250)
    console.log(this.#mesh2.position)
    this.#mesh2.rotation.x = Math.PI / 2
    this.materials = [this.material, this.material2, this.material3, this.material4, this.material5, this.material6, this.material7, this.material8, this.material9, this.material10, this.material11, this.material12, this.material13, this.material14, this.material15, this.material16, this.material17, this.material18];

    this.materials.forEach((material, index) => {
      gsap.fromTo(material.uniforms.uProgress, {
        value: 0
      },
        {
          value: [0.93, 0.990, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853, 0.853,][index],
          duration: 2.5,
          ease: 'power2.easeOut'
        });
    });
    // document.body.addEventListener('pointermove', this.onPointerMove);


    // this.#canvas.addEventListener('pointerdown', (event) => {
    //   console.log("clicked")
    //   this.cameraPosition(-45.86058465790959, -80.84439209875961, 100)
    // });
  }

  setClicks() {
    const image1 = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: LoaderManager.assets["click-1"].texture, side: DoubleSide }));
    image1.position.set(-30, -50.84439209875961, 250);
    image1.scale.set(5, 5)
    this.#scene.add(image1);

    const image2 = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: LoaderManager.assets["click-2"].texture, side: DoubleSide }));
    image2.position.set(0, -50.84439209875961, 250);
    image2.scale.set(5, 5)
    this.#scene.add(image2);

    const image3 = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: LoaderManager.assets["click-3"].texture, side: DoubleSide }));
    image3.position.set(30, -50.84439209875961, 250);
    image3.scale.set(5, 5)
    this.#scene.add(image3);

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const onClick = (event) => {
      event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.#camera);

      const intersects = raycaster.intersectObjects([image1, image2, image3], true);
      this.cameraPosition(0, -50.84439209875961, 500)
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject === image1) {
          console.log(image1.position)
          this.cameraPosition(image1.position.x, image1.position.y, image1.position.z)
          image1.position.set(image1.position.x, image1.position.y, image1.position.z - 200)
          console.log(this.#camera.position)
        } else if (clickedObject === image2) {
          this.cameraPosition(image2.position.x, image2.position.y - 10, image2.position.z)
          image2.position.set(image2.position.x, image2.position.y, image2.position.z - 200)
        } else if (clickedObject === image3) {
          this.cameraPosition(image3.position.x, image3.position.y, image3.position.z)
          image3.position.set(image3.position.x, image3.position.y, image3.position.z - 200)
        }
      }
    };
    // window.addEventListener('click', onClick);
  }

  /**
   * Build stats to display fps
   */
  setStats() {
    this.#stats = new Stats()
    this.#stats.showPanel(0)
    document.body.appendChild(this.#stats.dom)
  }

  setGUI() {
    const titleEl = document.querySelector('.main-title')
    const gui = new GUI();
    gui.add(this.#guiObj, 'progress', 0, 1).onChange((value) => {
      this.material.uniforms.uProgress.value = this.#guiObj.progress
      this.material2.uniforms.uProgress.value = this.#guiObj.progress
    })
    gui.add(this.#guiObj, 'frequency', 0, 1).onChange((value) => {
      this.material.uniforms.uFrequency.value = this.#guiObj.frequency
      this.material2.uniforms.uFrequency.value = this.#guiObj.frequency
    })
    gui.add(this.#camera.rotation, 'x', -Math.PI, Math.PI).name('Camera Rotation X').onChange((value) => {
      this.#camera.rotation.x = value
    });
    gui.add(this.#camera.rotation, 'y', -Math.PI, Math.PI).name('Camera Rotation Y').onChange((value) => {
      this.#camera.rotation.y = value
    });;
    gui.add(this.#camera.rotation, 'z', -Math.PI, Math.PI).name('Camera Rotation Z').onChange((value) => {
      this.#camera.rotation.y = value
    });;
  }
  /**
   * List of events
   */
  events() {
    window.addEventListener('resize', this.handleResize, { passive: true })
    this.draw(0)
  }

  // EVENTS

  /**
   * Request animation frame function
   * This function is called 60/time per seconds with no performance issue
   * Everything that happens in the scene is drawed here
   * @param {Number} now
   */

  clock = new Clock();
  draw = (time) => {
    // now: time in ms
    this.#stats.begin()
    // console.log(this.#camera.position)
    const elapsedTime = this.clock.getElapsedTime();
    const normalizedTime = elapsedTime % 1;
    // if (this.#controls) this.#controls.update() // for damping
    this.raycaster.setFromCamera(this.mouse, this.#camera);
    this.#renderer.render(this.#scene, this.#camera);
    this.material.uniforms.uTime.value = time / 500;
    this.material.uniforms.uMousePosition.value = this.point;
    this.materials.forEach((material, index) => {
      material.uniforms.uTime.value = time / 500;
    });
    this.#stats.end()
    this.raf = window.requestAnimationFrame(this.draw)
  }

  /**
   * On resize, we need to adapt our camera based
   * on the new window width and height and the renderer
   */
  handleResize = () => {
    this.#width = window.innerWidth
    this.#height = window.innerHeight

    // Update camera
    this.#camera.aspect = this.#width / this.#height
    this.#camera.updateProjectionMatrix()

    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1

    this.#renderer.setPixelRatio(DPR)
    this.#renderer.setSize(this.#width, this.#height)
  }
}

