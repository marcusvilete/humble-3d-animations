import { Matrix4 } from "../Rendering/matrix";
import { Model } from "../Rendering/model";
import { Renderer } from "../Rendering/renderer";
import { Time } from "../time";
import { Joint } from "./joint";

export class AnimatedModel extends Model {
    //buffers... maybe make all of those into a dictionary of <attrLocations, buffers> 
    positions: WebGLBuffer;
    normals: WebGLBuffer;
    textureCoords: WebGLBuffer;
    indices: WebGLBuffer;
    joints: WebGLBuffer;
    weights: WebGLBuffer;
    indexCount: number;
    texture: WebGLTexture;
    test: boolean;

    //skin data
    boneTexture: WebGLTexture
    rootJoint: Joint
    jointCount: number;

    constructor(positions: Float32Array, normals: Float32Array, textureCoords: Float32Array,
        indices: Uint16Array, joints: Uint8Array, weights: Float32Array, rootJoint: Joint, jointCount: number, renderer: Renderer) {
        super(renderer);
        let ctx = this.renderer.getContext();
        this.positions = ctx.createBuffer();
        this.normals = ctx.createBuffer();
        this.textureCoords = ctx.createBuffer();
        this.indices = ctx.createBuffer();
        this.joints = ctx.createBuffer();
        this.weights = ctx.createBuffer();
        this.indexCount = indices.length;

        this.bufferData(this.indices, indices, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER);
        this.bufferData(this.positions, positions, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.normals, normals, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.textureCoords, textureCoords, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.joints, joints, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.weights, weights, WebGLRenderingContext.ARRAY_BUFFER);

        //img-like texture
        //this.texture = texture ?? null;
        this.rootJoint = rootJoint ?? null;
        this.jointCount = jointCount ?? 0;

        //data-like texture
        this.boneTexture = ctx.createTexture();
        ctx.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.boneTexture);
        ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.NEAREST);
        ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.NEAREST);
        ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, WebGLRenderingContext.CLAMP_TO_EDGE);
        ctx.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, WebGLRenderingContext.CLAMP_TO_EDGE);

        if (rootJoint) {
            rootJoint.setParent(this);
        }
    }
    //xDeg: 0;
    update(): void {
        //this.xDeg += degToRad(30) * Time.deltaTime;
        //this.transl += 1 * deltaTime;

        let xrotation = Matrix4.makeXRotation(Math.sin(Time.time) * .5);

        //let xtransl = Matrix4.makeTranslation(0, this.transl, 0);
        //let inverseWorld = Matrix4.inverse(this.model.transform.getWorldMatrix());

        //this.transform.updateLocalMatrix();
        //this.transform.updateWorldMatrix();
        //this.rootJoint.updateTransforms();



        animateJoints(this.rootJoint, this.transform.getWorldMatrix());
        function animateJoints(joint: Joint, parent:Matrix4) {

            let worldBindMatrix = Matrix4.multiplyMatrices4(joint.transform.getLocalMatrix(), parent);
            //let worldBindMatrix = joint.transform.getWorldMatrix();
            worldBindMatrix = Matrix4.multiplyMatrices4(xrotation, worldBindMatrix);

            joint.animatedMatrix = Matrix4.makeIdentity();
            joint.animatedMatrix = Matrix4.multiplyMatrices4(worldBindMatrix, joint.animatedMatrix);
            joint.animatedMatrix = Matrix4.multiplyMatrices4(joint.inverseBindMatrix, joint.animatedMatrix);

            if (joint.children) {
                joint.children.forEach(child => {
                    animateJoints(child as Joint, worldBindMatrix);
                });
            }
        }

        let arr = new Float32Array(this.jointCount * 16);
        flattenJointMatrices(this.rootJoint);

        if (!this.test) {
            this.test = true;
            console.log("animatedModel: ", arr);
        }

        let ctx = this.renderer.getContext();
        ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);

        ctx.texImage2D(
            ctx.TEXTURE_2D, 0, ctx.RGBA, 4,
            this.jointCount, 0, ctx.RGBA, ctx.FLOAT, arr
        );


        function flattenJointMatrices(joint: Joint) {
            let offset = joint.id * 16;

            arr.set(joint.animatedMatrix.flatten(), offset);
            if (joint.children) {
                joint.children.forEach(child => {
                    flattenJointMatrices(child as Joint);
                });
            }
        }

    }
}