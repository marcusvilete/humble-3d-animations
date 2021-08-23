import { Matrix4 } from "./matrix";
import { Quaternion } from "./quaternion";
import { Vector3, Vector4 } from "./vector";

export class Transform {
    position: Vector3;
    rotation: Quaternion;
    scale: Vector3;
    private _up: Vector3;
    private _right: Vector3;
    private _forward: Vector3;
    private shouldComputeDirections: boolean;
    private worldMatrix: Matrix4;
    private localMatrix: Matrix4;

    get up(): Vector3 {
        this.computeDirectionVectors();
        return this._up;
    }

    get right(): Vector3 {
        this.computeDirectionVectors();
        return this._right;
    }

    get forward(): Vector3 {
        this.computeDirectionVectors();
        return this._forward;
    }

    constructor(position?: Vector3, rotation?: Quaternion, scale?: Vector3) {
        this.reset(position, rotation, scale);
    }

    reset(position?: Vector3, rotation?: Quaternion, scale?: Vector3): void {
        this.position = position ?? new Vector3();
        this.rotation = rotation ?? new Quaternion();
        this.scale = scale ?? new Vector3(1, 1, 1);
        this._forward = Vector3.forward;
        this._right = Vector3.right;
        this._up = Vector3.up;
        this.shouldComputeDirections = true;
    }

    computeDirectionVectors(): void {
        if (!this.shouldComputeDirections) return;

        //1. make rotation matrices
        let rotationMatrix = this.rotation.toMatrix4();
        //2. multiply direction vectors by the matrix
        this._up = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.up) as Vector3;
        this._forward = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.forward) as Vector3;
        this._right = Matrix4.multiplyMatrix4ByVector4(rotationMatrix, Vector4.right) as Vector3;
        this.shouldComputeDirections = false;
    }

    translate(translation: Vector3): void {
        this.position = Vector3.add(this.position, translation);
    }

    rotate(angles: Vector3): void {
        this.rotation.rotate(angles.x, angles.y, angles.z);
        this.shouldComputeDirections = true; //direction vectors will be computed lazily when needed
    }

    setRotation(angles: Vector3): void {
        this.rotation = new Quaternion();
        this.rotation.rotate(angles.x, angles.y, angles.z);
        this.shouldComputeDirections = true; //direction vectors will be computed lazily when needed
    }

    updateLocalMatrix(): void {
        this.localMatrix = Matrix4.makeIdentity();
        let translationMatrix = Matrix4.makeTranslation(this.position.x, this.position.y, this.position.z);
        let rotationMatrix = this.rotation.toMatrix4();
        let scaleMatrix = Matrix4.makeScale(this.scale.x, this.scale.y, this.scale.z);

        this.localMatrix = Matrix4.multiplyMatrices4(translationMatrix, this.localMatrix);
        this.localMatrix = Matrix4.multiplyMatrices4(rotationMatrix, this.localMatrix);
        this.localMatrix = Matrix4.multiplyMatrices4(scaleMatrix, this.localMatrix);
    }

    updateWorldMatrix(parentMatrix?: Matrix4): void {
        if (parentMatrix)
            this.worldMatrix = Matrix4.multiplyMatrices4(this.localMatrix, parentMatrix);
        else
            this.worldMatrix = Matrix4.copy(this.localMatrix);
    }

    getWorldMatrix(): Matrix4 {
        return this.worldMatrix;
    }
    
    getLocalMatrix(): Matrix4 {
        return this.localMatrix;
    }

    // lookAt(target: Vector3, up: Vector3): void {
    //     let lookAtMatrix = Matrix4.makeLookAtMatrix(this.position, target, Vector3.up);
    //     this.rotation = Matrix4.multiplyMatrix4ByVector4(lookAtMatrix, new Vector4(this.rotation.x, this.rotation.y, this.rotation.z)) as Vector3;
    // }
}