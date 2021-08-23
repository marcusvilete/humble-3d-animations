import { Camera } from "./camera";
import { Model } from "./model";
import { TreeNode } from "./node";
import { Vector3 } from "./vector";

export class Scene {
    activeCamera: Camera;
    globalLightDirection: Vector3;
    rootNodes: TreeNode[];
    renderables: Model[];

    constructor(camera?: Camera, globalLightDirection?: Vector3, nodes?: TreeNode[]) {
        this.activeCamera = camera ?? null;
        this.globalLightDirection = globalLightDirection ?? null;
        this.rootNodes = nodes ?? [];
        this.renderables = [];
    }

    update(): void {
        this.rootNodes.forEach(rootNode => {
            rootNode.updateTransforms();
        });
    }

    render(): void {
        //TODO: comeback here later
        this.renderables.forEach(renderable => {
            renderable.update();
            renderable.render(this.activeCamera);
        });
    }
}