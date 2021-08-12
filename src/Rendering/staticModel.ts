import { Model } from "./model";
import { Renderer } from "./renderer";

export class StaticModel extends Model {
    positions: WebGLBuffer;
    normals: WebGLBuffer;
    textureCoords: WebGLBuffer;
    indices: WebGLBuffer;
    indexCount: number;
    texture: WebGLTexture;

    constructor(positions: Float32Array, normals: Float32Array, textureCoords: Float32Array, indices: Uint16Array, renderer: Renderer) {
        super(renderer);
        let ctx = this.renderer.getContext();
        this.positions = ctx.createBuffer();
        this.normals = ctx.createBuffer();
        this.textureCoords = ctx.createBuffer();
        this.indices = ctx.createBuffer();
        this.indexCount = indices.length;

        this.bufferData(this.indices, indices, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER);
        this.bufferData(this.positions, positions, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.normals, normals, WebGLRenderingContext.ARRAY_BUFFER);
        this.bufferData(this.textureCoords, textureCoords, WebGLRenderingContext.ARRAY_BUFFER);
    }

    update(): void { }
}