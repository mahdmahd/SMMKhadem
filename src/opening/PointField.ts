import * as THREE from 'three'
import { pointsFragment, pointsVertex } from './shaders'
import {
  blueKeyTone,
  generateBrain,
  generateStars,
  mulberry32,
  orderByX,
  sampleHalftone,
  whiteTone,
  type Halftone,
  type Vec3Array,
} from './shapes'
import { pointDelay } from './stagger'
import { pairShapes, type Paired } from './pairing'

export const POINT_COUNT = 26000
// One cell size for both pictures, so the avatar and the brain are built
// from exactly the same dots.
const CELL = 0.024 // world units (the view is ~6.3 tall)
const AVATAR_HEIGHT = 3.6
const BRAIN_IMAGE_HEIGHT = 4.4 // the brain fills ~76% of its picture → ~3.4 tall
const FOV = 35

export interface PointFieldOptions {
  /** Read once per frame — the stage number, 0..2. Never triggers React. */
  getStage: () => number
  avatarUrl: string
  brainUrl: string
  reducedMotion: boolean
}

/** If a picture fails to load, fall back to a dim procedural cloud rather than crash. */
const fallback = (n: number, seed: number): Halftone => ({
  points: generateBrain(n, seed),
  tone: new Float32Array(n).fill(0.4),
  cell: CELL,
})

export class PointField {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  private root = new THREE.Group()
  private uniforms = {
    uStage: { value: 0 },
    uTime: { value: 0 },
    uMotion: { value: 1 },
    uFit: { value: 1 },
    uCell: { value: CELL },
    uPointScale: { value: 800 },
    uBrainMat: { value: new THREE.Matrix4() },
    uAvatarOffset: { value: new THREE.Vector3(0, 0.35, 0) },
  }
  private brainRotation = new THREE.Euler()
  private stage = 0
  private pointer = new THREE.Vector2()
  private tilt = new THREE.Vector2()
  private timer = new THREE.Timer()
  private raf = 0
  private disposed = false

  private canvas: HTMLCanvasElement
  private opts: PointFieldOptions

  constructor(canvas: HTMLCanvasElement, opts: PointFieldOptions) {
    this.canvas = canvas
    this.opts = opts
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.position.set(0, 0, 10)
    this.uniforms.uMotion.value = opts.reducedMotion ? 0 : 1
    this.scene.add(this.root)
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.onPointer, { passive: true })
  }

  async init() {
    const n = POINT_COUNT
    const [face, brain] = await Promise.all([
      sampleHalftone(this.opts.avatarUrl, n, CELL, AVATAR_HEIGHT, whiteTone, 0.35).catch(() =>
        fallback(n, 99),
      ),
      sampleHalftone(this.opts.brainUrl, n, CELL, BRAIN_IMAGE_HEIGHT, blueKeyTone, 0.9, [0.47, 0.8], 1.9).catch(
        () => fallback(n, 14),
      ),
    ])
    if (this.disposed) return

    // Avatar dots are paired with brain dots so the face reshapes into the brain.
    const paired = pairShapes(face, brain, n)
    // Stars are dealt out left-to-right to match the avatar's columns, so the
    // intro assembly sweeps across too.
    const starsRaw = generateStars(n, 11)
    const starOrder = orderByX(starsRaw, 1)
    const slotOrder = Array.from({ length: n }, (_, i) => i).sort((a, b) => paired.sweep[a] - paired.sweep[b])
    const stars = new Float32Array(n * 3)
    slotOrder.forEach((slot, k) =>
      stars.set(starsRaw.subarray(starOrder[k] * 3, starOrder[k] * 3 + 3), slot * 3),
    )

    this.buildPoints(stars, paired)
    this.resize()
    this.loop()
  }

  private buildPoints(stars: Vec3Array, { avatar, avatarTone, brain, brainTone, sweep }: Paired) {
    const n = POINT_COUNT
    const rand = mulberry32(7)
    const delay = new Float32Array(n)
    const rnd = new Float32Array(n * 3)
    const size = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      rnd[i * 3] = rand()
      rnd[i * 3 + 1] = rand()
      rnd[i * 3 + 2] = rand()
      delay[i] = pointDelay(sweep[i], rand())
      size[i] = 0.02 + rand() * 0.016
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(stars, 3)) // for bounds only
    geo.setAttribute('aA', new THREE.BufferAttribute(stars, 3))
    geo.setAttribute('aC', new THREE.BufferAttribute(avatar, 3))
    geo.setAttribute('aD', new THREE.BufferAttribute(brain, 3))
    geo.setAttribute('aTone', new THREE.BufferAttribute(avatarTone, 1))
    geo.setAttribute('aBrainTone', new THREE.BufferAttribute(brainTone, 1))
    geo.setAttribute('aDelay', new THREE.BufferAttribute(delay, 1))
    geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false // vertices move in the shader
    this.root.add(points)
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
  }

  private resize = () => {
    const w = this.canvas.clientWidth || window.innerWidth
    const h = this.canvas.clientHeight || window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.uniforms.uPointScale.value =
      (h * this.renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)))
    // The brain is the widest shape (~4.2 units); keep it in frame.
    this.uniforms.uFit.value = Math.min(1, this.camera.aspect / 0.75)
    // Portrait screens put the name near the top, so the portrait sits lower.
    this.uniforms.uAvatarOffset.value.y = this.camera.aspect < 0.8 ? -0.45 : 0.35
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    this.timer.update()
    const dt = Math.min(this.timer.getDelta(), 0.05)
    const time = this.timer.getElapsed()
    const motion = this.uniforms.uMotion.value

    // Ease toward the target so wheel steps feel continuous.
    const target = this.opts.getStage()
    this.stage += (target - this.stage) * (1 - Math.exp(-dt * 6))
    this.uniforms.uStage.value = this.stage
    this.uniforms.uTime.value = time

    // Whole field leans toward the pointer.
    this.tilt.lerp(this.pointer, 1 - Math.exp(-dt * 3))
    this.root.rotation.y = this.tilt.x * 0.18 * motion
    this.root.rotation.x = this.tilt.y * 0.12 * motion

    // The picture is a lateral view: sway gently, never turn away from it.
    this.brainRotation.set(Math.sin(time * 0.25) * 0.05 * motion, Math.sin(time * 0.3) * 0.25 * motion, 0)
    this.uniforms.uBrainMat.value.makeRotationFromEuler(this.brainRotation)

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.onPointer)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      ;(m.material as THREE.Material | undefined)?.dispose?.()
    })
    this.renderer.dispose()
  }
}
