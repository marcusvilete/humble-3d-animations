import { Camera } from "./camera";
import { Model } from "./model";
import { TreeNode } from "./node";
import { Vector3 } from "./vector";

export class Scene {
    activeCamera: Camera;
    globalLightDirection: Vector3;
    rootNodes: TreeNode[];

    constructor(camera?: Camera, globalLightDirection?: Vector3, nodes?: TreeNode[]) {
        this.activeCamera = camera ?? null;
        this.globalLightDirection = globalLightDirection ?? null;
        this.rootNodes = nodes ?? [];
    }

    update(): void {
        this.rootNodes.forEach(rootNode => {
            rootNode.updateTransforms();
        });
    }


    render(): void {
        //TODO: maybe we should have a list of renderables?
        this.rootNodes.forEach(rootNode => {
            let model = rootNode as Model;
            if (model.render) {
                model.update();
                model.render(this.activeCamera);
            }
        });
    }
}