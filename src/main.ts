import { AnimatedModel } from "./Animation/animatedModel";
import { AnimatedRenderer } from "./Animation/animatedRenderer";
import { HumbleAnimation } from "./Animation/animation";
import { degToRad } from "./Etc/mathFunctions";
import { webglUtils } from "./Etc/webglUtils";
import { FileLoader } from "./File/fileLoader";
import { Camera } from "./Rendering/camera";
import { Scene } from "./Rendering/scene";
import { StaticRenderer } from "./Rendering/staticRenderer";
import { Vector3, Vector4 } from "./Rendering/vector";
import { Time } from "./Etc/time";

window.onload = main;

let scene: Scene;
let theModel: AnimatedModel;
let staticRenderer: StaticRenderer;
let animatedRenderer: AnimatedRenderer;
let animations: { [index: string]: HumbleAnimation } = {};

// stuff related to camera and camera movement
let firsPersonCamera = {
    cameraObj: null as Camera,
    forwardVelocity: new Vector3(),
    rightVelocity: new Vector3(),
    maxXRotation: degToRad(89),
    minXRotation: degToRad(-89),
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

        this.currentRotationAngles.x -= speed * rotationAmount.x;
        this.currentRotationAngles.y -= speed * rotationAmount.y;

        if (this.currentRotationAngles.x > this.maxXRotation) this.currentRotationAngles.x = this.maxXRotation;
        else if (this.currentRotationAngles.x < this.minXRotation) this.currentRotationAngles.x = this.minXRotation;

        cam.transform.setRotation(this.currentRotationAngles);
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

//html elements
let viewElements = {
    loadingState: document.querySelector("#loading-state") as HTMLInputElement,
    loadedState: document.querySelector("#loaded-state") as HTMLInputElement,
    xRotationElement: document.querySelector("#x-rotation") as HTMLInputElement,
    yRotationElement: document.querySelector("#y-rotation") as HTMLInputElement,
    zRotationElement: document.querySelector("#z-rotation") as HTMLInputElement,
    animationSelect: document.querySelector("#select-animations") as HTMLInputElement
}

function main(): void {
    //for debugging
    window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
        alert("Error occured: " + errorMsg);//or any message
        return false;
    }
    showLoadingState();
    setup();
    loadResources().then((gltfModel) => {
        //there is no texture, so...
        //1-pixel-1-color-texture mockup
        let texture = animatedRenderer.loadTexture2(new Vector4(0, 0, 255, 255));

        //instantiate the model
        theModel = new AnimatedModel(
            gltfModel.positionData,
            gltfModel.normalData,
            gltfModel.texCoordData,
            gltfModel.indicesData,
            gltfModel.jointData,
            gltfModel.weightData,
            gltfModel.rootJoint,
            gltfModel.jointCount,
            animatedRenderer);
        theModel.texture = texture;

        //add to scene
        scene.rootNodes.push(theModel);
        scene.renderables.push(theModel);
        setupStaticModel();

        //save animations into a dictionary so we can pick in HTML
        gltfModel.animations.forEach(anim => {
            animations[anim.animationName] = HumbleAnimation.fromGLTFAnimation(anim);
        });

        buildAnimationOptions(Object.keys(animations));
        createEventHandlers();
        requestAnimationFrame(gameLoop);
        showLoadedState();
    });
}

function setup(): void {
    let canvasElem: HTMLCanvasElement = document.querySelector("#canvas");
    let vertexShaderElemStatic: HTMLScriptElement = document.querySelector("#vertex-shader-3d-textured-lit");
    let fragmentShaderElemStatic: HTMLScriptElement = document.querySelector("#fragment-shader-3d-textured-lit");

    let vertexShaderElemAnimated: HTMLScriptElement = document.querySelector("#vertex-shader-3d-textured-skinned");
    let fragmentShaderElemAnimated: HTMLScriptElement = document.querySelector("#fragment-shader-3d-textured-skinned");

    //initialize canvas and webgl stuff
    let gl = canvasElem.getContext("webgl");
    if (!gl) {
        console.error("Something went wrong while creating webgl context");
        return;
    }
    let ext = gl.getExtension('OES_texture_float');
    if (!ext) {
        throw new Error("Could not run in your browser, sorry! More info: OES_texture_float extension missing!");
    }

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
    firsPersonCamera.cameraObj.transform.position = new Vector3(-4.5, 0, -2);
    firsPersonCamera.cameraObj.transform.setRotation(new Vector3(degToRad(0), degToRad(-45), degToRad(0)));
    firsPersonCamera.currentRotationAngles = new Vector3(degToRad(0), degToRad(-45), degToRad(0));

    scene = new Scene(
        firsPersonCamera.cameraObj,
        Vector3.normalize(new Vector3(0.5, 0.7, 1)),
        []
    );
}

function gameLoop(now: number): void {
    Time.computeTime(now);
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
}

function render(): void {
    animatedRenderer.clear();
    scene.render();
}

async function loadResources() {
    // return FileLoader.loadGltf("./assets/mannequinnWalking.gltf", 0);
    return FileLoader.loadGltf("./assets/whale.CYCLES.gltf", 0);

    //TODO: when we need more resources, add them here...
    // when all resources finish loading, then we proceed

    //Something like:
    //we load everything we need to start rendering here....
    //let resource01 = FileLoader.loadImage("./assets/someImage1.png");
    //let resource02 = FileLoader.loadImage("./assets/someImage2.png");
    //let resource03 = FileLoader.loadGltf("./assets/someScene.gltf");
    //let promises: Promise<any>[] = [resource01, resource02, resource03];
    //await Promise.all(promises).then((values) => { ... });
}

function createEventHandlers(): void {
    viewElements.animationSelect.addEventListener("change", function (this: HTMLInputElement, event: InputEvent) {
        if (animations[this.value]) {
            setupAnimatedModel();
            theModel.doAnimation(animations[this.value]);
        } else {
            setupStaticModel();
        }
    });

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

function showLoadingState() {
    viewElements.loadingState.style.visibility = "visible";
    viewElements.loadedState.style.visibility = "hidden";
}
function showLoadedState() {

    viewElements.loadingState.style.visibility = "hidden";
    viewElements.loadedState.style.visibility = "visible";
}

function buildAnimationOptions(animations: string[]) {
    animations.forEach(animation => {
        let newOption = document.createElement("option") as HTMLOptionElement;
        newOption.value = animation;
        newOption.text = animation;
        viewElements.animationSelect.appendChild(newOption);
    });
}

// There is something weird going on with the joints, so when we use joints the orientation of the model changes(maybe it is because in blender Z is UP!)
// Also when i rotate animated models, things gets weird(like, it rotates twice the desired amount, among other weird behaviours)
// So, this 2 functions belows exists to work around those behaviours... hopefully i can fix the issues soon!
function setupStaticModel() {
    theModel.renderer = staticRenderer;
    theModel.transform.position = new Vector3(0, -1, -7);
    theModel.transform.scale = new Vector3(0.4, 0.4, 0.4);
    theModel.transform.setRotation(new Vector3(0, 0, 0));
}

function setupAnimatedModel() {
    theModel.renderer = animatedRenderer;
    theModel.transform.position = new Vector3(0, 0.6, -3);
    theModel.transform.scale = new Vector3(1, 1, 1);
    theModel.transform.setRotation(new Vector3(degToRad(-45), 0, 0));
}