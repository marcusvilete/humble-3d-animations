import { Transform } from "./transform";

//TODO: Maybe refactor this into a generic type like "Treeish<T>"
export interface TreeNode { // originally it was going to be "Node", but it was taken by the DOM "Node"
    transform: Transform;
    parent: TreeNode;
    children: TreeNode[];
    setParent(parent: TreeNode): void;
    addChild(child: TreeNode): void;
    updateTransforms(): void;
}

export abstract class BaseNode implements TreeNode {
    transform: Transform;
    parent: TreeNode;
    children: TreeNode[];

    constructor(transform?: Transform) {
        this.transform = transform ?? new Transform();
        this.children = [];
    }

    setParent(parent: TreeNode): void {
        //remove this node from previous parent
        if (this.parent) {
            let index = this.parent.children.indexOf(this);
            if (index >= 0) {
                this.parent.children.splice(index, 1);
            }
        }

        // Add this node as child of the new parent
        if (parent) {
            parent.addChild(this);
        }
        this.parent = parent;
    }
    addChild(child: TreeNode): void {
        this.children.push(child);
    }
    updateTransforms(): void {
        this.transform.updateLocalMatrix();

        if (this.parent) {
            let parentMatrix = this.parent.transform.getWorldMatrix();
            this.transform.updateWorldMatrix(parentMatrix);
        } else {
            this.transform.updateWorldMatrix();
        }

        this.children.forEach(child => {
            child.updateTransforms();
        });
    }
}