import { Camera } from "./camera";
import { Model } from "./model";

export interface Renderer {
    render(model: Model, camera: Camera): void;
    getContext(): WebGLRenderingContext;
}

export abstract class BaseRenderer implements Renderer {
    protected program: WebGLProgram;
    protected context: WebGLRenderingContext;

    constructor(context: WebGLRenderingContext, program: WebGLProgram) {
        this.context = context;
        this.program = program;
    }

    abstract render(model: Model, camera: Camera): void;
    
    getContext(): WebGLRenderingContext {
        return this.context;
    }
}