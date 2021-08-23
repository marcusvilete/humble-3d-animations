import { AnimationSampleData, SkeletonAnimationData } from "../File/fileLoader";
import { Quaternion } from "../Rendering/quaternion";
import { Vector3, Vector4 } from "../Rendering/vector";
import { JointTransform } from "./JointTransform";
import { HumbleKeyframe, Pose } from "./keyframe";


//this holds animation data, maybe should not be a full class since we so far have no behaviour?
export class HumbleAnimation { //name Animation was taken =(
    name: string;
    lengthInSeconds: number;
    keyframes: HumbleKeyframe[];
    constructor(name: string, keyframes: HumbleKeyframe[], lengthInSeconds: number) {
        this.name = name;
        this.keyframes = keyframes;
        this.lengthInSeconds = lengthInSeconds;
    }

    //TODO: maybe this should be outside this class, maybe a converter class or something?
    static fromGLTFAnimation(anim: SkeletonAnimationData): HumbleAnimation {
        //OK, so i am assuming that all joints have the same exact keyframes...
        // maybe it is not true and i will have to comeback here and fix it.

        //also, im ignoring the interpolation method and assuming its all LINEAR interpolation, since it is the only one i have implemented so far...
        let lengthInSeconds = anim.animationLength;
        let name = anim.animationName;

        let keyframes: HumbleKeyframe[] = [];

        //build a timestamp array
        let samples: AnimationSampleData[];
        if (anim.jointsAnimations[0].translation.samples) {
            samples = anim.jointsAnimations[0].translation.samples
        } else if (anim.jointsAnimations[0].rotation.samples) {
            samples = anim.jointsAnimations[0].rotation.samples
        } else if (anim.jointsAnimations[0].scale.samples) {
            samples = anim.jointsAnimations[0].scale.samples
        }

        let timestamps = samples.map((s) => {
            return s.timestamp;
        });

        //for each timestamp, lets build a Pose (which is a dictionary of <jointName, JointTransform> )
        timestamps.forEach((t, i) => {
            let p: Pose = {};
            anim.jointsAnimations.forEach((jointAnimation) => {
                let position = new Vector3(jointAnimation.translation.samples[i].values[0], jointAnimation.translation.samples[i].values[1], jointAnimation.translation.samples[i].values[2]);
                let rotation = new Quaternion(jointAnimation.rotation.samples[i].values[0], jointAnimation.rotation.samples[i].values[1], jointAnimation.rotation.samples[i].values[2], jointAnimation.rotation.samples[i].values[3]);
                let scale = new Vector3(jointAnimation.scale.samples[i].values[0], jointAnimation.scale.samples[i].values[1], jointAnimation.scale.samples[i].values[2]);
                p[jointAnimation.jointName] = new JointTransform(position, rotation, scale);
            });
            keyframes.push(new HumbleKeyframe(t, p));
        });
        return new HumbleAnimation(name, keyframes, lengthInSeconds);
    }
}