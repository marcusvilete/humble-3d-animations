import { Matrix4 } from "../Rendering/matrix";
import { Quaternion } from "../Rendering/quaternion";
import { Vector3 } from "../Rendering/vector";


//A list of JointTransform, represent the "pose" of the model
//A JointTransform holds position and rotation relative to the parent joint(or the origin if it is the root)
export class JointTransform {
    position: Vector3;
    rotation: Quaternion;
    scale: Vector3;
    constructor(position: Vector3, rotation: Quaternion, scale: Vector3) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    getLocalMatrix(): Matrix4 {
        let localMatrix = Matrix4.makeIdentity();
        let translationMatrix = Matrix4.makeTranslation(this.position.x, this.position.y, this.position.z);
        let rotationMatrix = this.rotation.toMatrix4();
        let scaleMatrix = Matrix4.makeScale(this.scale.x, this.scale.y, this.scale.z);

        localMatrix = Matrix4.multiplyMatrices4(translationMatrix, localMatrix);
        localMatrix = Matrix4.multiplyMatrices4(rotationMatrix, localMatrix);
        localMatrix = Matrix4.multiplyMatrices4(scaleMatrix, localMatrix);

        return localMatrix;
    }

    static interpolate(a: JointTransform, b: JointTransform, step: number): JointTransform {
        return new JointTransform(
            Vector3.interpolate(a.position, b.position, step),
            Quaternion.interpolate(a.rotation, b.rotation, step),
            Vector3.interpolate(a.scale, b.scale, step),
        );
    }
}


