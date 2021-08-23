import { Model } from "../Rendering/model";
import { Renderer } from "../Rendering/renderer";
import { HumbleAnimation } from "./animation";
import { Animator } from "./animator";
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

    //skin data
    boneTexture: WebGLTexture
    rootJoint: Joint
    jointCount: number;

    animator: Animator;

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

        rootJoint.updateTransforms();
        this.animator = new Animator(this);
    }

    doAnimation(animation: HumbleAnimation) {
        this.animator.doAnimation(animation);
    }

    update(): void {

        this.animator.update();

        let arr = new Float32Array(this.jointCount * 16);
        flattenJointMatrices(this.rootJoint);

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