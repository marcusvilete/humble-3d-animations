import { Joint } from "../Animation/joint";
import { Matrix4 } from "../Rendering/matrix";
import { Quaternion } from "../Rendering/quaternion";
import { Vector3, Vector4 } from "../Rendering/vector";
import { Transform } from "../transform";

export class FileLoader {

    static getComponentLengthByType() {

    }


    static async loadGltf(url: string) {
        //TODO: load animation data
        let result: GLTFModel = {
            positionData: null,
            normalData: null,
            texCoordData: null,
            indicesData: null,
            jointData: null,
            weightData: null,
            rootJoint: null,
            jointCount: 0,
            animations: []
        };

        let inverseBindMatricesData: Float32Array;

        let gltf = await this.loadJson<GLTFFile>(url);
        const baseURL = new URL(url, location.href);

        let binaryBuffers = await Promise.all(gltf.buffers.map((buffer) => {
            const url = new URL(buffer.uri, baseURL.href);
            return this.loadArrayBuffer(url.href);
        }));

        //there is just one mesh so far...
        gltf.meshes.forEach((mesh) => {
            mesh.primitives.forEach((primitive) => {
                const positionAccessorIndex = primitive.attributes["POSITION"];
                const normalAccessorIndex = primitive.attributes["NORMAL"];
                const texCoordAccessorIndex = primitive.attributes["TEXCOORD_0"];
                const jointAccessorIndex = primitive.attributes["JOINTS_0"];
                const weightAccessorIndex = primitive.attributes["WEIGHTS_0"];
                const indicesIndex = primitive.indices;

                result.positionData = getDataFromAccessors(positionAccessorIndex, gltf, binaryBuffers).data as Float32Array;
                result.normalData = getDataFromAccessors(normalAccessorIndex, gltf, binaryBuffers).data as Float32Array;
                result.texCoordData = getDataFromAccessors(texCoordAccessorIndex, gltf, binaryBuffers).data as Float32Array;
                result.jointData = getDataFromAccessors(jointAccessorIndex, gltf, binaryBuffers).data as Uint8Array;
                result.weightData = getDataFromAccessors(weightAccessorIndex, gltf, binaryBuffers).data as Float32Array;
                result.indicesData = getDataFromAccessors(indicesIndex, gltf, binaryBuffers).data as Uint16Array;

                // console.log("position", result.positionData);
                // console.log("normals", result.normalData);
                // console.log("tex coords", result.texCoordData);
                // console.log("joint ids", result.jointData);
                // console.log("weights", result.weightData);
                // console.log("indices", result.indicesData);
                //console.log(gltf);
            });
        });

        //now the skins...
        //there is only one skin so far...
        let joints: Joint[];
        gltf.skins.forEach((skin) => {
            let actualJointNodes = skin.joints.map(index => gltf.nodes[index]);
            const inverseMatricesAccessor = gltf.accessors[skin.inverseBindMatrices];
            const inverseMatricesBufferView = gltf.bufferViews[inverseMatricesAccessor.bufferView];
            const buffer = binaryBuffers[inverseMatricesBufferView.buffer];
            inverseBindMatricesData = new Float32Array(buffer, inverseMatricesBufferView.byteOffset, inverseMatricesBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);
            let inverseBindMatrices = new Array<Matrix4>(inverseBindMatricesData.length / 16);

            for (let i = 0; i < inverseBindMatrices.length; i++) {
                let offset = (16 * i);
                inverseBindMatrices[i] = new Matrix4(
                    inverseBindMatricesData[0 + offset], inverseBindMatricesData[1 + offset], inverseBindMatricesData[2 + offset], inverseBindMatricesData[3 + offset],
                    inverseBindMatricesData[4 + offset], inverseBindMatricesData[5 + offset], inverseBindMatricesData[6 + offset], inverseBindMatricesData[7 + offset],
                    inverseBindMatricesData[8 + offset], inverseBindMatricesData[9 + offset], inverseBindMatricesData[10 + offset], inverseBindMatricesData[11 + offset],
                    inverseBindMatricesData[12 + offset], inverseBindMatricesData[13 + offset], inverseBindMatricesData[14 + offset], inverseBindMatricesData[15 + offset]
                );
            }

            //console.log("FileLoader: ", inverseBindMatricesData);

            //console.log("inverse bind matrices: ", inverseBindMatrices);

            joints = new Array<Joint>(actualJointNodes.length);

            //fill a Joint array

            for (let i = 0; i < actualJointNodes.length; i++) {
                // let localMatrix = Matrix4.makeIdentity();
                // let translation = actualJointNodes[i].translation;
                // let rotation = actualJointNodes[i].rotation;
                // let scale = actualJointNodes[i].scale;

                // if (translation) {
                //     let translationMatrix = Matrix4.makeTranslation(translation[0], translation[1], translation[2]);
                //     localMatrix = Matrix4.multiplyMatrices4(translationMatrix, localMatrix);
                // }

                // if (rotation) {
                //     let quaternion = new Quaternion(rotation[0], rotation[1], rotation[2], rotation[3]);
                //     let rotationMatrix = quaternion.toMatrix4();
                //     localMatrix = Matrix4.multiplyMatrices4(rotationMatrix, localMatrix);
                // }

                // if (scale) {
                //     let scaleMatrix = Matrix4.makeTranslation(scale[0], scale[1], scale[2]);
                //     localMatrix = Matrix4.multiplyMatrices4(scaleMatrix, localMatrix);
                // }

                //let localBindMatrix = Matrix4.makeIdentity();
                let position = new Vector3(0, 0, 0);
                let rotation = new Vector4(0, 0, 0, 1);
                let scale = new Vector3(1, 1, 1);

                if (actualJointNodes[i].translation) {
                    position.x = actualJointNodes[i].translation[0];
                    position.y = actualJointNodes[i].translation[1];
                    position.z = actualJointNodes[i].translation[2];
                }

                if (actualJointNodes[i].rotation) {
                    rotation.x = actualJointNodes[i].rotation[0];
                    rotation.y = actualJointNodes[i].rotation[1];
                    rotation.z = actualJointNodes[i].rotation[2];
                    rotation.w = actualJointNodes[i].rotation[3];
                }

                if (actualJointNodes[i].scale) {
                    scale.x = actualJointNodes[i].scale[0];
                    scale.y = actualJointNodes[i].scale[1];
                    scale.z = actualJointNodes[i].scale[2];
                }

                let quat = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
                let transform = new Transform(position, quat, scale);

                //localBindMatrix = Matrix4.compose(position, scale, rotation);

                joints[i] = new Joint(
                    i,
                    actualJointNodes[i].name,
                    //localBindMatrix,
                    transform,
                    inverseBindMatrices[i]
                );
            }

            //get tree-like hierarchy done
            for (let i = 0; i < actualJointNodes.length; i++) {
                if (actualJointNodes[i].children) {
                    actualJointNodes[i].children.forEach(child => {
                        let j = joints.find(x => x.name === gltf.nodes[child].name);
                        j.setParent(joints[i]);
                        //joints[i].children.push(j);
                    });
                }
            }

            //joints[0] // root->001->002->005->003->004
            //joints[1] // 001
            //joints[2] // 002
            //joints[3] // 005
            //joints[4] // 003
            //joints[5] // 004



            // joints[0].children = [joints[1], joints[4], joints[5]];
            // joints[1].children = [joints[2]];
            // joints[2].children = [joints[3]]

            // joints[0].children = [joints[1], joints[4], joints[5]];
            // joints[1].children = [joints[3]];
            // joints[3].children = [joints[2]];

            //root to bone 4
            //bone 1 to bone 3

            //joints[5].children = [joints[4], joints[1], joints[0]];
            //joints[4].children = [joints[3]];
            //joints[3].children = [joints[2]];

            //is this right?
            result.rootJoint = joints[0];
            result.jointCount = joints.length;

            //console.log(rootJoint);

            // joints.forEach(j => {
            //     console.log(Matrix4.multiplyMatrices4(j.inverseBindMatrix, j.localBindMatrix));
            // });


            //console.log(inverseBindMatricesData);
        });

        function getDataFromAccessors(accessorIndex: number, file: GLTFFile, buffers: ArrayBuffer[]) {

            const accessor = file.accessors[accessorIndex];
            const bufferView = file.bufferViews[accessor.bufferView];
            const buffer = buffers[bufferView.buffer];
            const data = getTypedArray(buffer, bufferView.byteOffset, bufferView.byteLength, accessor.componentType);

            return {
                max: accessor.max,
                min: accessor.min,
                type: accessor.type,
                data: data
            };

        }
        function getTypedArray(buffer: ArrayBuffer, byteOffset: number, byteLength: number, type: ArrayType) {
            switch (type) {
                case ArrayType.FLOAT:
                    return new Float32Array(buffer, byteOffset, byteLength / Float32Array.BYTES_PER_ELEMENT);
                case ArrayType.SHORT:
                    return new Int16Array(buffer, byteOffset, byteLength / Int16Array.BYTES_PER_ELEMENT);
                case ArrayType.UNSIGNED_BYTE:
                    return new Uint8Array(buffer, byteOffset, byteLength / Uint8Array.BYTES_PER_ELEMENT);
                case ArrayType.UNSIGNED_INTEGER:
                    return new Uint32Array(buffer, byteOffset, byteLength / Uint32Array.BYTES_PER_ELEMENT);
                case ArrayType.UNSIGNED_SHORT:
                    return new Uint16Array(buffer, byteOffset, byteLength / Uint16Array.BYTES_PER_ELEMENT);
                default:
                    console.error("ComponentType not found: ", type);
                    return null;
            }
        }


        //now the animations:
        //for each animation
        //  - get name, if there is no name we call it something like anim1
        //  - iterate through channels of the animation
        //  - select the respective sampler
        //  - load timestamps from input, values from output using 'getDataFromAccessors' and the interpolation method
        //  - save which node/joint to animate and which 'path'(translation, rotation, scale)



        gltf.animations.forEach((animation, i) => {
            let maxLength = 0;
            let animationData: SkeletonAnimationData = {} as SkeletonAnimationData;

            animationData.animationName = animation.name ? animation.name : "anim" + i;


            let jointAnimationsByName: { [key: string]: JointAnimationData } = {};

            animation.channels.forEach((channel, j) => {
                let sampler = animation.samplers[channel.sampler];
                let inputData = getDataFromAccessors(sampler.input, gltf, binaryBuffers);
                let outputData = getDataFromAccessors(sampler.output, gltf, binaryBuffers);
                let node = gltf.nodes[channel.target.node];

                let jointName = node.name ? node.name : "joint" + j;
                //add to dictionary, if it is not already
                if (!jointAnimationsByName[jointName]) {
                    jointAnimationsByName[jointName] = { jointName: jointName } as JointAnimationData;
                }

                let jointAnimData = jointAnimationsByName[jointName];

                let samples: AnimationSampleData[] = [];

                inputData.data.forEach((timestamp, timestampIndex) => {
                    timestamp *= 2; //debug
                    let componentLen = ComponentType[outputData.type as keyof typeof ComponentType];
                    let len = timestampIndex * componentLen;
                    maxLength = Math.max(maxLength, timestamp);

                    samples.push({ timestamp: timestamp, values: Array.from(outputData.data.slice(len, len + componentLen)) });
                });

                //TODO: replace this with something like:
                //jointAnimData.[path] = {interpolationMethod: sampler.interpolation, samples};
                switch (channel.target.path.toLowerCase()) {
                    case "translation":
                        jointAnimData.translation = { interpolationMethod: sampler.interpolation, samples };
                        break;
                    case "rotation":
                        jointAnimData.rotation = { interpolationMethod: sampler.interpolation, samples };
                        break;
                    case "scale":
                        jointAnimData.scale = { interpolationMethod: sampler.interpolation, samples };
                        break;
                    default:
                        console.error("path not implemented: ", channel.target.path);
                        break;
                }

            });
            animationData.jointsAnimations = Object.values(jointAnimationsByName);
            animationData.animationLength = maxLength;
            result.animations.push(animationData);

        });
        console.log(result.animations);

        return result;

        //return [positionData, normalData, texCoordData, jointData, weightData, indicesData];

        //return GltfParser.parse(binaryBuffers);
    }

    static async loadText(url: string) {
        let response = await fetch(url);
        return response.text();
    }

    static async loadJson<T>(url: string) {
        let response = await fetch(url);
        return response.json() as Promise<T>;
    }

    static async loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.addEventListener('load', () => {
                resolve(img);
            });
            img.src = url;
        });
    }

    static async loadArrayBuffer(url: string) {
        const response = await fetch(url);
        return response.arrayBuffer();
    }

}


//gltf types on demand
interface GLTFBuffer {
    byteLength: number;
    uri: string
}

interface GLTFBufferView {
    buffer: number;
    byteLength: number;
    byteOffset: number;
}

interface GLTFAccessor {
    bufferView: number;
    componentType: number;
    count: number;
    max: number[];
    min: number[];
    type: string;
}

interface GLTFMesh {
    name: string;
    primitives: GLTFPrimitive[]
}

interface GLTFPrimitive {
    attributes: GLTFAttributes;
    indices: 5;
    material: number;
}

interface GLTFAttributes {
    [key: string]: number;
}

interface GLTFNode {
    name: string;
    rotation: number[]; //4-component quaternion
    translation: number[]; //3-component vector
    scale: number[];//3-component vector
    skin: number; //skin index
    mesh: number; //mesh index
    children: number[]; // index of children nodes
}

interface GLTFSkin {
    inverseBindMatrices: number; //this is the accessor index?
    joints: number[]; //ids for node array
    name: string;
}

interface GLTFFile {
    nodes: GLTFNode[];
    skins: GLTFSkin[];
    meshes: GLTFMesh[];
    animations: GLTFAnimation[];
    buffers: GLTFBuffer[];
    accessors: GLTFAccessor[];
    bufferViews: GLTFBufferView[];
}

interface GLTFAnimation {
    name: string;
    channels: GLTFAnimationChannel[];
    samplers: GLTFAnimationSampler[];

}

interface GLTFAnimationChannel {
    sampler: number;
    target: GLTFAnimationTarget;
}

interface GLTFAnimationTarget {
    node: number;
    path: string;
}

interface GLTFAnimationSampler {
    input: number;
    interpolation: string;
    output: number;
}

//Output struct
export interface GLTFModel {
    positionData: Float32Array;
    normalData: Float32Array;
    texCoordData: Float32Array;
    indicesData: Uint16Array;
    jointData: Uint8Array;
    weightData: Float32Array;
    rootJoint: Joint;
    jointCount: number;
    animations: SkeletonAnimationData[];
}

//output struct
export interface SkeletonAnimationData {
    animationLength: number;
    animationName: string;
    jointsAnimations: JointAnimationData[];
}

//output struct
export interface JointAnimationData {
    jointName: string;
    rotation: AnimationData;
    scale: AnimationData;
    translation: AnimationData;
}

//output struct
export interface AnimationData {
    interpolationMethod: string;
    samples: AnimationSampleData[];
}
//output struct
export interface AnimationSampleData {
    timestamp: number; //in GLTF, time is in seconds
    values: number[]; //flattened values, if scale or translation its 3 components, if rotation its 4(quaternion)
}

enum ArrayType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INTEGER = 5125,
    FLOAT = 5126
}

enum ComponentType {
    SCALAR = 1,
    VEC2 = 2,
    VEC3 = 3,
    VEC4 = 4,
    MAT2 = 4,
    MAT3 = 9,
    MAT4 = 16,

}