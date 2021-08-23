import { Matrix4 } from "../Rendering/matrix";
import { BaseNode } from "../Rendering/node";
import { Transform } from "../Rendering/transform";

export class Joint extends BaseNode {
    id: number;
    name: string;
    inverseBindMatrix: Matrix4;
    animatedMatrix: Matrix4;
    constructor(id: number, name: string, transform: Transform, inverseMatrix: Matrix4) {
        super(transform);
        this.id = id;
        this.name = name;
        this.inverseBindMatrix = inverseMatrix;
    }
}