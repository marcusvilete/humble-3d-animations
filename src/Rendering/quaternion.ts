import { Matrix4 } from "./matrix";

//Quaternions are a way to represent rotation (among other transformations)
//for future reference: 
// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/
// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
// https://www.youtube.com/watch?v=d4EgbgTm0Bg

// Quaternions are too much for my limited knowledge right now...
// Im not really comfortable with all the maths going on here, i might come back later to try and understand 
// The code here is mostly ported from http://www.euclideanspace.com
// Altough quaternions can represent other transformations, we are only representing rotation here...
export class Quaternion {
    x: number; // imaginary-i
    y: number; // imaginary-j
    z: number; // imaginary-k
    w: number; // real part
    constructor(x?: number, y?: number, z?: number, w?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.z = z ?? 0;
        this.w = w ?? 1;
        this.normalize();
    }
    normalize(): void {
        //vector-like normalization...
        //find the "vector" magnitude, then divide by magnitude
        const magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));

        if (magnitude > 0) {
            this.x /= magnitude;
            this.y /= magnitude;
            this.z /= magnitude;
            this.w /= magnitude;
        }
    }
    conjugate(): void {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
    }

    //heading: y-axis
    //attitude: z-axis
    //bank: x-axis
    //assuming angles in radians here
    rotate(x: number, y: number, z: number): void {
        const c1 = Math.cos(y / 2);
        const s1 = Math.sin(y / 2);
        const c2 = Math.cos(z / 2);
        const s2 = Math.sin(z / 2);
        const c3 = Math.cos(x / 2);
        const s3 = Math.sin(x / 2);
        const c1c2 = c1 * c2;
        const s1s2 = s1 * s2;

        let q = new Quaternion(
            c1c2 * s3 + s1s2 * c3, //x
            s1 * c2 * c3 + c1 * s2 * s3, //y
            c1 * s2 * c3 - s1 * c2 * s3, //z
            c1c2 * c3 - s1s2 * s3 //w
        );

        this.multiply(q);
    }

    multiply(q: Quaternion) {
        let x = q.x * this.w + q.y * this.z - q.z * this.y + q.w * this.x;
        let y = -q.x * this.z + q.y * this.w + q.z * this.x + q.w * this.y;
        let z = q.x * this.y - q.y * this.x + q.z * this.w + q.w * this.z;
        let w = -q.x * this.x - q.y * this.y - q.z * this.z + q.w * this.w;

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

    }
    /**
     * Convert from quaternion to a rotation matrix
     * @returns 
     */
    toMatrix4(): Matrix4 {
        this.normalize(); // to represent rotations, quaternions must be normalized, or will mess up the scale and/or translation!

        let sqw = this.w * this.w;
        let sqx = this.x * this.x;
        let sqy = this.y * this.y;
        let sqz = this.z * this.z;

        let m00 = (sqx - sqy - sqz + sqw);
        let m11 = (-sqx + sqy - sqz + sqw);
        let m22 = (-sqx - sqy + sqz + sqw);

        let tmp1 = this.x * this.y;
        let tmp2 = this.z * this.w;
        let m10 = 2.0 * (tmp1 + tmp2);
        let m01 = 2.0 * (tmp1 - tmp2);

        tmp1 = this.x * this.z;
        tmp2 = this.y * this.w;
        let m20 = 2.0 * (tmp1 - tmp2);
        let m02 = 2.0 * (tmp1 + tmp2);
        tmp1 = this.y * this.z;
        tmp2 = this.x * this.w;
        let m21 = 2.0 * (tmp1 + tmp2);
        let m12 = 2.0 * (tmp1 - tmp2);
       
        return new Matrix4(
            m00, m10, m20, 0,
            m01, m11, m21, 0,
            m02, m12, m22, 0,
            0, 0, 0, 1
        );
    }


    /**
     * Extracts rotation components from a matrix 4x4
     * @param m 
     * @returns 
     */
    static fromMatrix4(m: Matrix4): Quaternion {
        let x: number;
        let y: number;
        let z: number;
        let w: number;

        const diagonal = m.getElementAt(0, 0) + m.getElementAt(1, 1) + m.getElementAt(2, 2);
        if (diagonal > 0) {
            let w4 = (Math.sqrt(diagonal + 1) * 2);
            x = (m.getElementAt(2, 1) - m.getElementAt(1, 2)) / w4;
            y = (m.getElementAt(0, 2) - m.getElementAt(2, 0)) / w4;
            z = (m.getElementAt(1, 0) - m.getElementAt(0, 1)) / w4;
            w = w4 / 4;
        } else if ((m.getElementAt(0, 0) > m.getElementAt(1, 1)) && (m.getElementAt(0, 0) > m.getElementAt(2, 2))) {
            const x4 = (Math.sqrt(1 + m.getElementAt(0, 0) - m.getElementAt(1, 1) - m.getElementAt(2, 2)) * 2);
            x = x4 / 4;
            y = (m.getElementAt(0, 1) + m.getElementAt(1, 0)) / x4;
            z = (m.getElementAt(0, 2) + m.getElementAt(2, 0)) / x4;
            w = (m.getElementAt(2, 1) - m.getElementAt(1, 2)) / x4;
        } else if (m.getElementAt(1, 1) > m.getElementAt(2, 2)) {
            const y4 = (Math.sqrt(1 + m.getElementAt(1, 1) - m.getElementAt(0, 0) - m.getElementAt(2, 2)) * 2);
            x = (m.getElementAt(0, 1) + m.getElementAt(1, 0)) / y4;
            y = y4 / 4;
            z = (m.getElementAt(1, 2) + m.getElementAt(2, 1)) / y4;
            w = (m.getElementAt(0, 2) - m.getElementAt(2, 0)) / y4;
        } else {
            const z4 = (Math.sqrt(1 + m.getElementAt(2, 2) - m.getElementAt(0, 0) - m.getElementAt(1, 1)) * 2);
            x = (m.getElementAt(0, 2) + m.getElementAt(2, 0)) / z4;
            y = (m.getElementAt(1, 2) + m.getElementAt(2, 1)) / z4;
            z = z4 / 4;
            w = (m.getElementAt(1, 0) - m.getElementAt(0, 1)) / z4;
        }
        return new Quaternion(x, y, z, w);
    };

    /**
     * 
     * @param a 'from' parameter
     * @param b 'to' parameter
     * @param step step between 0 ~ 1. 0 returns a, 1 returns b, 0.5 returns the midpoint between a and b
     * @returns 
     */
    static interpolate(a: Quaternion, b: Quaternion, step: number): Quaternion {

        let q = new Quaternion();
        const cosHalfTheta = (a.x * b.x) + (a.y * b.y) + (a.z * b.z) + (a.w * b.w);
        if (Math.abs(cosHalfTheta) >= 1.0) {
            q.w = a.w;
            q.x = a.x;
            q.y = a.y;
            q.z = a.z;
            return q;
        }

        const halfTheta = Math.acos(cosHalfTheta);
        const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
        // if theta = 180 degrees then result is not fully defined
        // we could rotate around any axis normal to qa or qb
        if (Math.abs(sinHalfTheta) < 0.00001) { // fabs is floating point absolute
            q.w = (a.w * 0.5 + q.w * 0.5);
            q.x = (a.x * 0.5 + q.x * 0.5);
            q.y = (a.y * 0.5 + q.y * 0.5);
            q.z = (a.z * 0.5 + q.z * 0.5);
            return q;
        }

        const ratioA = Math.sin((1 - step) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(step * halfTheta) / sinHalfTheta;
        //calculate Quaternion.
        q.w = (a.w * ratioA + b.w * ratioB);
        q.x = (a.x * ratioA + b.x * ratioB);
        q.y = (a.y * ratioA + b.y * ratioB);
        q.z = (a.z * ratioA + b.z * ratioB);
        return q;
    }
}