import { Transform } from "../transform";
import { Camera } from "./camera";
import { BaseNode } from "./node";
import { Renderer } from "./renderer";

export abstract class Model extends BaseNode {
    renderer: Renderer;

    constructor(renderer: Renderer, transform?: Transform) {
        super(transform);
        this.renderer = renderer;
    }
    protected bufferData(buffer: WebGLBuffer, data: BufferSource, bufferType: number) {
        let ctx = this.renderer.getContext();
        ctx.bindBuffer(bufferType, buffer);
        ctx.bufferData(bufferType, data, WebGLRenderingContext.STATIC_DRAW);
    }
    render(camera: Camera): void {
        this.renderer.render(this, camera);
    }
    abstract update(): void;
}