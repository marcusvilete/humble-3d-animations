import { Matrix4 } from "../Rendering/matrix";
import { HumbleAnimation } from "./animation";
import { Joint } from "./joint";
import { JointTransform } from "./JointTransform";
import { HumbleKeyframe, Pose } from "./keyframe";
import { degToRad } from "../Etc/mathFunctions";
import { AnimatedModel } from "./animatedModel";
import { Time } from "../time";

export class Animator {
    animation: HumbleAnimation;
    currentTime: number;
    model: AnimatedModel;
    constructor(model: AnimatedModel) {
        this.model = model;
    }

    //set, or reset an animation
    doAnimation(animation: HumbleAnimation): void {
        this.currentTime = 0;
        this.animation = animation;
    }

    update(): void {
        if (this.animation) {
            this.increaseAnimationTime(Time.deltaTime);
            let currentPose = this.computeCurrentAnimationPose();
            //this.applyPoseToJoints(currentPose, this.model.rootJoint, Matrix4.makeIdentity());
            this.applyPoseToJoints(currentPose, this.model.rootJoint, this.model.transform.getWorldMatrix());
        }
    }

    //increase time and, loop around when it ends
    increaseAnimationTime(deltaTime: number): void {
        this.currentTime += deltaTime;
        if (this.currentTime > this.animation.lengthInSeconds) {
            this.currentTime %= this.animation.lengthInSeconds;
        }
    }

    computeCurrentAnimationPose(): Pose {
        let [previousFrame, nextFrame] = this.getPreviousAndNextFrames();
        let step = this.calculateProgression(previousFrame, nextFrame);
        return this.interpolatePoses(previousFrame, nextFrame, step);
    }

    applyPoseToJoints(currentPose: Pose, joint: Joint, parentMatrix: Matrix4): void {
        let currentTransform = currentPose[joint.name];
        let currentMatrix = Matrix4.multiplyMatrices4(currentTransform.getLocalMatrix(), parentMatrix);

        joint.children.forEach(child => {
            this.applyPoseToJoints(currentPose, child as Joint, currentMatrix);
        });

        joint.animatedMatrix = Matrix4.multiplyMatrices4(joint.inverseBindMatrix, currentMatrix);
    }

    getPreviousAndNextFrames(): [HumbleKeyframe, HumbleKeyframe] {
        let allKeyFrames = this.animation.keyframes;
        let previous = allKeyFrames[0];
        let next = allKeyFrames[0];

        for (let i = 1; i < allKeyFrames.length; i++) {
            next = allKeyFrames[i];
            if (next.timestamp > this.currentTime) {
                break;
            }
            previous = allKeyFrames[i];
        }

        return [previous, next];
    }

    calculateProgression(previousFrame: HumbleKeyframe, nextFrame: HumbleKeyframe) {
        let totalTime = nextFrame.timestamp - previousFrame.timestamp;
        let currentTime = this.currentTime - previousFrame.timestamp

        return currentTime / totalTime;
    }

    interpolatePoses(previousFrame: HumbleKeyframe, nextFrame: HumbleKeyframe, step: number) {
        let currentPose: Pose = {} as Pose;
        //foreach joint transform, interpolate between previous and next keyframe, then return a new interpolated "Pose"
        for (const key in previousFrame.pose) {
            currentPose[key] = JointTransform.interpolate(previousFrame.pose[key], nextFrame.pose[key], step);
        }
        return currentPose;
    }
}

