import { AnimatedModel } from "./Animation/animatedModel";
import { AnimatedRenderer } from "./Animation/animatedRenderer";
import { degToRad } from "./Etc/mathFunctions";
import { webglUtils } from "./Etc/webglUtils";
import { FileLoader } from "./File/fileLoader";
import { Camera } from "./Rendering/camera";
import { Scene } from "./Rendering/scene";
import { StaticModel } from "./Rendering/staticModel";
import { StaticRenderer } from "./Rendering/staticRenderer";
import { Vector3, Vector4 } from "./Rendering/vector";
import { Time } from "./time";

// stuff related to camera and camera movement
let firsPersonCamera = {
    cameraObj: null as Camera,
    forwardVelocity: new Vector3(0, 0, 0),
    rightVelocity: new Vector3(0, 0, 0),
    maxXRotation: degToRad(88),
    minXRotation: degToRad(-88),
    currentRotationAngles: new Vector3(),
    cameraSpeed: 20,
    mouseSensibility: 0.1,
    Move(direction: Vector3) {
        let cam = this.cameraObj as Camera;
        let speed = this.cameraSpeed * Time.deltaTime;
        let forwardVelocity = Vector3.multiply(cam.transform.forward, -direction.z);
        let rightVelocity = Vector3.multiply(cam.transform.right, direction.x);
        let velocity = Vector3.multiply(Vector3.add(forwardVelocity, rightVelocity), speed);
        cam.transform.translate(velocity);
    },
    Rotate(rotationAmount: Vector3) {
        //TODO: This rotation is kinda scuffed, come back here someday
        let cam = this.cameraObj as Camera;
        let speed = this.mouseSensibility * Time.deltaTime;

        let before = new Vector3(
            this.currentRotationAngles.x,
            this.currentRotationAngles.y,
            0
        );

        this.currentRotationAngles.x -= speed * rotationAmount.x;
        this.currentRotationAngles.y -= speed * rotationAmount.y;

        if (this.currentRotationAngles.x > this.maxXRotation) this.currentRotationAngles.x = this.maxXRotation;
        else if (this.currentRotationAngles.x < this.minXRotation) this.currentRotationAngles.x = this.minXRotation;

        //let rotation = Vector3.subtract(this.currentRotationAngles, before);
        //rotation.x *= cam.transform.right.x < 0 ? -1 : 1;
        //rotation.y *= cam.transform.up.y;
        cam.transform.setRotation(this.currentRotationAngles);
        //cam.transform.rotate(rotation);
    }
};

// this is for keyboard event handling
// when 'keydown' happens, we set to true
// when 'keyup' happens, we set to false
// in the gameloop we process input based on this flags.
let controls = {
    up: false,
    down: false,
    left: false,
    right: false
}

/**
 * Time since last frame, in seconds
 */
//let deltaTime = 0;
//let previousFrameTime = 0;

//vars for counting frames
let frameCount = 0;
let timeForFPS = 0;

let staticRenderer: StaticRenderer;
let animatedRenderer: AnimatedRenderer;

//array of game objects
//let rootGameObject = new GameObject();
//let gameObjects = new Array<GameObject>();
let models = new Array<StaticModel>();
let scene: Scene;

window.onload = main;
function main(): void {
    FileLoader.loadGltf("./assets/whale.CYCLES.gltf").then((gltfModel) => {
        setup();
        scene = new Scene(
            firsPersonCamera.cameraObj,
            Vector3.normalize(new Vector3(0.5, 0.7, 1)),
            []
        );
        let texture = animatedRenderer.loadTexture2(new Vector4(0, 0, 255, 255));
        //renderer.bufferData2();
        let model = new StaticModel(
            gltfModel.positionData,
            gltfModel.normalData,
            gltfModel.texCoordData,
            gltfModel.indicesData,
            staticRenderer
        );

        model.transform.position = new Vector3(3, 5, 0);
        model.transform.scale = new Vector3(0.4347, 0.4347, 0.4347);
        model.transform.rotate(new Vector3(degToRad(90), 0, 0));
        model.texture = texture;
        models.push(model);
        scene.rootNodes.push(model);

        model.update = () => {
            //model.transform.rotate(new Vector3(Time.deltaTime * degToRad(90), 0, 0));
        };

        let model2 = new AnimatedModel(
            gltfModel.positionData,
            gltfModel.normalData,
            gltfModel.texCoordData,
            gltfModel.indicesData,
            gltfModel.jointData,
            gltfModel.weightData,
            gltfModel.rootJoint,
            gltfModel.jointCount,
            animatedRenderer);
       

        model2.transform.position = new Vector3(0, 0, 0);
        model2.texture = texture;
        models.push(model2);
        scene.rootNodes.push(model2);
        createEventHandlers();
        requestAnimationFrame(gameLoop);
    });


    // //first of all, load resources!
    // loadResources().then(() => {
    //     setup();
    //     instantiateObjects();
    //     renderer.bufferData(gameObjects); // This should be called everytime we add or remove meshes to the scene
    //     createEventHandlers();
    //     requestAnimationFrame(gameLoop);
    // });

}

function setup(): void {
    let canvasElem: HTMLCanvasElement = document.querySelector("#canvas");
    let vertexShaderElemStatic: HTMLScriptElement = document.querySelector("#vertex-shader-3d-textured-lit2");
    let fragmentShaderElemStatic: HTMLScriptElement = document.querySelector("#fragment-shader-3d-textured-lit2");

    let vertexShaderElemAnimated: HTMLScriptElement = document.querySelector("#vertex-shader-3d-textured-skinned");
    let fragmentShaderElemAnimated: HTMLScriptElement = document.querySelector("#fragment-shader-3d-textured-skinned");


    //initialize canvas and webgl stuff
    let gl = canvasElem.getContext("webgl");
    if (!gl) {
        console.error("Something went wrong while creating webgl context");
        return;
    }
    gl.getExtension('OES_texture_float');

    let vertexShader = webglUtils.loadFromScript(gl, vertexShaderElemStatic, gl.VERTEX_SHADER);
    let fragmentShader = webglUtils.loadFromScript(gl, fragmentShaderElemStatic, gl.FRAGMENT_SHADER);
    let program = webglUtils.createProgram(gl, vertexShader, fragmentShader);

    staticRenderer = new StaticRenderer(gl, program);

    vertexShader = webglUtils.loadFromScript(gl, vertexShaderElemAnimated, gl.VERTEX_SHADER);
    fragmentShader = webglUtils.loadFromScript(gl, fragmentShaderElemAnimated, gl.FRAGMENT_SHADER);
    program = webglUtils.createProgram(gl, vertexShader, fragmentShader);
    animatedRenderer = new AnimatedRenderer(gl, program);


    const aspect = canvasElem.clientWidth / canvasElem.clientHeight;
    let yFov = degToRad(60); //To radians;
    let zNear = 1;
    let zFar = 2000;

    firsPersonCamera.cameraObj = new Camera(
        yFov,
        aspect,
        zNear,
        zFar
    );
    firsPersonCamera.cameraObj.computePerspectiveMatrix();
}

async function loadResources() {
    //we load everything we need to start rendering here....
    //let allstarImagePromise = FileLoader.loadImage("./assets/allstar.png");
    //let allstarMeshesPromise = FileLoader.loadOBJ("./assets/allstar.obj");
    //let promises: Promise<any>[] = [allstarImagePromise, allstarMeshesPromise];

    //resume only when everything is ready....
    //await Promise.all(promises).then((values) => {
    //allstarImage = values[0];
    //allstarMeshes = values[1];
    //});
}

function gameLoop(now: number): void {
    //now *= 0.001;
    //deltaTime = now - previousFrameTime;
    //previousFrameTime = now;
    Time.computeTime(now);
    //computeFramesPerSecond();
    processInput();
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function processInput() {

    let direction = new Vector3();
    if (controls.up) direction = Vector3.add(direction, Vector3.forward);
    if (controls.down) direction = Vector3.add(direction, Vector3.backward);
    if (controls.right) direction = Vector3.add(direction, Vector3.right);
    if (controls.left) direction = Vector3.add(direction, Vector3.left);

    firsPersonCamera.Move(direction);
}


function update(): void {

    scene.update();

    // models.forEach(model => {
    //     model.update(deltaTime, previousFrameTime);
    //     //model.transform.translate(new Vector3(1 * deltaTime, 0, 0));
    // });
}

function render(): void {
    animatedRenderer.clear();
    scene.render();
    // models.forEach(model => {
    //     model.render(Camera.getActiveCamera());
    // });
}

function createEventHandlers(): void {
    document.addEventListener("keydown", function (event: KeyboardEvent) {
        if (event.key === 'w') {
            controls.up = true;
        } else if (event.key === 's') {
            controls.down = true;
        } else if (event.key === 'a') {
            controls.left = true;
        } else if (event.key === 'd') {
            controls.right = true;
        } else if (event.key === 'Enter') {
            //console.log(controls);
        }
    });
    document.addEventListener("keyup", function (event: KeyboardEvent) {
        if (event.key === 'w') {
            controls.up = false;
        } else if (event.key === 's') {
            controls.down = false;
        } else if (event.key === 'a') {
            controls.left = false;
        } else if (event.key === 'd') {
            controls.right = false;
        } else if (event.key === 'Enter') {
            //console.log(controls);
        }
    });

    // pointer lock object forking for cross browser
    let canvas = animatedRenderer.getContext().canvas as HTMLCanvasElement;

    canvas.addEventListener("click", function (this: HTMLCanvasElement, event: Event) {
        this.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', pointerLockChanged);

    function pointerLockChanged(): void {
        if (document.pointerLockElement === canvas) {
            document.addEventListener("mousemove", mouseMoved);
        } else {
            //console.log('The pointer lock status is now unlocked');
            document.removeEventListener("mousemove", mouseMoved);
        }
    }

    function mouseMoved(event: MouseEvent) {
        let rotation = new Vector3(
            event.movementY,
            event.movementX,
            0
        );
        firsPersonCamera.Rotate(rotation);
    }
}

function computeFramesPerSecond() {
    frameCount++;
    timeForFPS += Time.deltaTime;
    if (timeForFPS >= 1.0) {
        console.log(frameCount);
        timeForFPS -= 1.0;
        frameCount = 0
    }
}

