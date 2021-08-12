(()=>{"use strict";function t(t){return t*Math.PI/180}function e(t,e,n){return(1-n)*t+n*e}var n,o,r,i,a=(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),s=function(t){function n(e,n,o){var r=t.call(this,null!=e?e:0,null!=n?n:0)||this;return r.z=null!=o?o:0,r}return a(n,t),n.magnitude=function(t){return Math.sqrt(t.x*t.x+t.y*t.y+t.z*t.z)},n.normalize=function(t){var e=n.magnitude(t);return e>0?n.divide(t,e):new n(0,0,0)},n.add=function(t,e){return new n(t.x+e.x,t.y+e.y,t.z+e.z)},n.subtract=function(t,e){return new n(t.x-e.x,t.y-e.y,t.z-e.z)},n.multiply=function(t,e){return new n(t.x*e,t.y*e,t.z*e)},n.divide=function(t,e){return 0!==e?new n(t.x/e,t.y/e,t.z/e):(console.error("Can't divide by zero, Vector3 was not divided!"),t)},n.dotProduct=function(t,e){return t.x*e.x+t.y*e.y+t.z*e.z},n.vectorCrossProduct=function(t,e){return new n(t.y*e.z-t.z*e.y,t.z*e.x-t.x*e.z,t.x*e.y-t.y*e.x)},n.interpolate=function(t,o,r){return new n(e(t.x,o.x,r),e(t.y,o.y,r),e(t.z,o.z,r))},n.zero=new n(0,0,0),n.forward=new n(0,0,-1),n.backward=new n(0,0,1),n.up=new n(0,1,0),n.down=new n(0,-1,0),n.left=new n(-1,0,0),n.right=new n(1,0,0),n}(function(){function t(t,e){this.x=null!=t?t:0,this.y=null!=e?e:0}return t.magnitude=function(t){return Math.sqrt(t.x*t.x+t.y*t.y)},t.normalize=function(e){var n=t.magnitude(e);return n>0?t.divide(e,n):new t(0,0)},t.add=function(e,n){return new t(e.x+n.x,e.y+n.y)},t.subtract=function(e,n){return new t(e.x-n.x,e.y-n.y)},t.multiply=function(e,n){return new t(e.x*n,e.y*n)},t.divide=function(e,n){return 0!==n?new t(e.x/n,e.y/n):(console.error("Can't divide by zero, Vector2 was not divided!"),e)},t.dotProduct=function(t,e){return t.x*e.x+t.y*e.y},t}()),c=function(t){function e(e,n,o,r){var i=t.call(this,null!=e?e:0,null!=n?n:0,null!=o?o:0)||this;return i.w=null!=r?r:1,i}return a(e,t),e.forward=new e(0,0,-1,1),e.backward=new e(0,0,1,1),e.up=new e(0,1,0,1),e.down=new e(0,-1,0,1),e.left=new e(-1,0,0,1),e.right=new e(1,0,0,1),e}(s),u=function(){function t(t,e,n,o,r,i,a,s,c,u,l,h,f,x,m,E){this.elements=[null!=t?t:0,null!=e?e:0,null!=n?n:0,null!=o?o:0,null!=r?r:0,null!=i?i:0,null!=a?a:0,null!=s?s:0,null!=c?c:0,null!=u?u:0,null!=l?l:0,null!=h?h:0,null!=f?f:0,null!=x?x:0,null!=m?m:0,null!=E?E:0]}return t.prototype.getElementAt=function(t,e){return this.elements[4*e+t]},t.prototype.setElementAt=function(t,e,n){this.elements[4*e+t]=n},t.prototype.flatten=function(){return this.elements},t.makeIdentity=function(){return new t(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)},t.makeScale=function(e,n,o){return new t(e,0,0,0,0,n,0,0,0,0,o,0,0,0,0,1)},t.makeTranslation=function(e,n,o){return new t(1,0,0,0,0,1,0,0,0,0,1,0,e,n,o,1)},t.makeXRotation=function(e){var n=Math.sin(e),o=Math.cos(e);return new t(1,0,0,0,0,o,n,0,0,-n,o,0,0,0,0,1)},t.makeYRotation=function(e){var n=Math.sin(e),o=Math.cos(e);return new t(o,0,-n,0,0,1,0,0,n,0,o,0,0,0,0,1)},t.makeZRotation=function(e){var n=Math.sin(e),o=Math.cos(e);return new t(o,n,0,0,-n,o,0,0,0,0,1,0,0,0,0,1)},t.makePerspective=function(e,n,o,r){var i=Math.tan(.5*Math.PI-.5*e),a=1/(o-r);return new t(i/n,0,0,0,0,i,0,0,0,0,(o+r)*a,-1,0,0,o*r*a*2,0)},t.makeLookAtMatrix=function(e,n,o){var r=s.normalize(s.subtract(e,n)),i=s.normalize(s.vectorCrossProduct(o,r)),a=s.normalize(s.vectorCrossProduct(r,i));return new t(i.x,i.y,i.z,0,a.x,a.y,a.z,0,r.x,r.y,r.z,0,e.x,e.y,e.z,1)},t.makeViewMatrix=function(e,n,o){var r=s.normalize(s.subtract(e,n)),i=s.normalize(s.vectorCrossProduct(o,r)),a=s.vectorCrossProduct(r,i);return new t(i.x,a.x,r.x,0,i.y,a.y,r.y,0,i.z,a.z,r.z,0,-s.dotProduct(i,e),-s.dotProduct(a,e),-s.dotProduct(r,e),1)},t.multiplyMatrix4ByVector4=function(t,e){return new c(e.x*t.getElementAt(0,0)+e.y*t.getElementAt(0,1)+e.z*t.getElementAt(0,2)+e.w*t.getElementAt(0,3),e.x*t.getElementAt(1,0)+e.y*t.getElementAt(1,1)+e.z*t.getElementAt(1,2)+e.w*t.getElementAt(1,3),e.x*t.getElementAt(2,0)+e.y*t.getElementAt(2,1)+e.z*t.getElementAt(2,2)+e.w*t.getElementAt(2,3),e.x*t.getElementAt(3,0)+e.y*t.getElementAt(3,1)+e.z*t.getElementAt(3,2)+e.w*t.getElementAt(3,3))},t.multiplyMatrices4=function(e,n){for(var o=new t,r=0;r<4;r++)for(var i=0;i<4;i++){var a=n.getElementAt(r,0)*e.getElementAt(0,i)+n.getElementAt(r,1)*e.getElementAt(1,i)+n.getElementAt(r,2)*e.getElementAt(2,i)+n.getElementAt(r,3)*e.getElementAt(3,i);o.setElementAt(r,i,a)}return o},t.transpose=function(e){for(var n=new t,o=0;o<4;o++)for(var r=0;r<4;r++)n.setElementAt(o,r,e.getElementAt(r,o));return n},t.copy=function(e){for(var n=new t,o=0;o<4;o++)for(var r=0;r<4;r++)n.setElementAt(o,r,e.getElementAt(o,r));return n},t.inverse=function(e){var n=e.getElementAt(0,0),o=e.getElementAt(1,0),r=e.getElementAt(2,0),i=e.getElementAt(3,0),a=e.getElementAt(0,1),s=e.getElementAt(1,1),c=e.getElementAt(2,1),u=e.getElementAt(3,1),l=e.getElementAt(0,2),h=e.getElementAt(1,2),f=e.getElementAt(2,2),x=e.getElementAt(3,2),m=e.getElementAt(0,3),E=e.getElementAt(1,3),d=e.getElementAt(2,3),p=e.getElementAt(3,3),y=f*p,A=d*x,g=c*p,w=d*u,T=c*x,_=f*u,R=r*p,b=d*i,v=r*x,L=f*i,M=r*u,D=c*i,U=l*E,C=m*h,P=a*E,z=m*s,F=a*h,O=l*s,S=n*E,B=m*o,X=n*h,G=l*o,j=n*s,I=a*o,N=y*s+w*h+T*E-(A*s+g*h+_*E),W=A*o+R*h+L*E-(y*o+b*h+v*E),k=g*o+b*s+M*E-(w*o+R*s+D*E),V=_*o+v*s+D*h-(T*o+L*s+M*h),Y=1/(n*N+a*W+l*k+m*V);return new t(Y*N,Y*W,Y*k,Y*V,Y*(A*a+g*l+_*m-(y*a+w*l+T*m)),Y*(y*n+b*l+v*m-(A*n+R*l+L*m)),Y*(w*n+R*a+D*m-(g*n+b*a+M*m)),Y*(T*n+L*a+M*l-(_*n+v*a+D*l)),Y*(U*u+z*x+F*p-(C*u+P*x+O*p)),Y*(C*i+S*x+G*p-(U*i+B*x+X*p)),Y*(P*i+B*u+j*p-(z*i+S*u+I*p)),Y*(O*i+X*u+I*x-(F*i+G*u+j*x)),Y*(P*f+O*d+C*c-(F*d+U*c+z*f)),Y*(X*d+U*r+B*f-(S*f+G*d+C*r)),Y*(S*c+I*d+z*r-(j*d+P*r+B*c)),Y*(j*f+F*r+G*c-(X*c+I*f+O*r)))},t.compose=function(e,n,o){var r=t.makeIdentity(),i=o.x+o.x,a=o.y+o.y,s=o.z+o.z,c=o.x*i,u=o.x*a,l=o.x*s,h=o.y*a,f=o.y*s,x=o.z*s,m=o.w*i,E=o.w*a,d=o.w*s;return r.elements[0]=(1-(h+x))*n.x,r.elements[1]=(u+d)*n.x,r.elements[2]=(l-E)*n.x,r.elements[3]=0,r.elements[4]=(u-d)*n.y,r.elements[5]=(1-(c+x))*n.y,r.elements[6]=(f+m)*n.y,r.elements[7]=0,r.elements[8]=(l+E)*n.z,r.elements[9]=(f-m)*n.z,r.elements[10]=(1-(c+h))*n.z,r.elements[11]=0,r.elements[12]=e.x,r.elements[13]=e.y,r.elements[14]=e.z,r.elements[15]=1,r},t}(),l=function(){function t(t,e,n,o){this.x=null!=t?t:0,this.y=null!=e?e:0,this.z=null!=n?n:0,this.w=null!=o?o:1,this.normalize()}return t.prototype.normalize=function(){var t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);t>0&&(this.x/=t,this.y/=t,this.z/=t,this.w/=t)},t.prototype.conjugate=function(){this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w},t.prototype.rotate=function(e,n,o){var r=Math.cos(n/2),i=Math.sin(n/2),a=Math.cos(o/2),s=Math.sin(o/2),c=Math.cos(e/2),u=Math.sin(e/2),l=r*a,h=i*s,f=new t(l*u+h*c,i*a*c+r*s*u,r*s*c-i*a*u,l*c-h*u);this.multiply(f)},t.prototype.multiply=function(t){this.x=t.x*this.w+t.y*this.z-t.z*this.y+t.w*this.x,this.y=-t.x*this.z+t.y*this.w+t.z*this.x+t.w*this.y,this.z=t.x*this.y-t.y*this.x+t.z*this.w+t.w*this.z,this.w=-t.x*this.x-t.y*this.y-t.z*this.z+t.w*this.w},t.prototype.toMatrix4=function(){this.normalize();var t=this.w*this.w,e=this.x*this.x,n=this.y*this.y,o=this.z*this.z,r=e-n-o+t,i=-e+n-o+t,a=-e-n+o+t,s=this.x*this.y,c=this.z*this.w,l=2*(s+c),h=2*(s-c),f=2*((s=this.x*this.z)-(c=this.y*this.w)),x=2*(s+c);return s=this.y*this.z,c=this.x*this.w,new u(r,l,f,0,h,i,2*(s+c),0,x,2*(s-c),a,0,0,0,0,1)},t.fromMatrix4=function(e){var n,o,r,i,a=e.getElementAt(0,0)+e.getElementAt(1,1)+e.getElementAt(2,2);if(a>0){var s=2*Math.sqrt(a+1);n=(e.getElementAt(2,1)-e.getElementAt(1,2))/s,o=(e.getElementAt(0,2)-e.getElementAt(2,0))/s,r=(e.getElementAt(1,0)-e.getElementAt(0,1))/s,i=s/4}else if(e.getElementAt(0,0)>e.getElementAt(1,1)&&e.getElementAt(0,0)>e.getElementAt(2,2)){var c=2*Math.sqrt(1+e.getElementAt(0,0)-e.getElementAt(1,1)-e.getElementAt(2,2));n=c/4,o=(e.getElementAt(0,1)+e.getElementAt(1,0))/c,r=(e.getElementAt(0,2)+e.getElementAt(2,0))/c,i=(e.getElementAt(2,1)-e.getElementAt(1,2))/c}else if(e.getElementAt(1,1)>e.getElementAt(2,2)){var u=2*Math.sqrt(1+e.getElementAt(1,1)-e.getElementAt(0,0)-e.getElementAt(2,2));n=(e.getElementAt(0,1)+e.getElementAt(1,0))/u,o=u/4,r=(e.getElementAt(1,2)+e.getElementAt(2,1))/u,i=(e.getElementAt(0,2)-e.getElementAt(2,0))/u}else{var l=2*Math.sqrt(1+e.getElementAt(2,2)-e.getElementAt(0,0)-e.getElementAt(1,1));n=(e.getElementAt(0,2)+e.getElementAt(2,0))/l,o=(e.getElementAt(1,2)+e.getElementAt(2,1))/l,r=l/4,i=(e.getElementAt(1,0)-e.getElementAt(0,1))/l}return new t(n,o,r,i)},t.interpolate=function(n,o,r){var i=new t(0,0,0,1);return n.x*o.x+n.y*o.y+n.z*o.z+n.w*o.w<0?(i.x=e(n.x,-o.x,r),i.y=e(n.x,-o.y,r),i.z=e(n.x,-o.z,r),i.w=e(n.x,-o.w,r)):(i.x=e(n.x,o.x,r),i.y=e(n.x,o.y,r),i.z=e(n.x,o.z,r),i.w=e(n.x,o.w,r)),i.normalize(),i},t}(),h=function(){function t(t,e,n){this.reset(t,e,n)}return Object.defineProperty(t.prototype,"up",{get:function(){return this.computeDirectionVectors(),this._up},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"right",{get:function(){return this.computeDirectionVectors(),this._right},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"forward",{get:function(){return this.computeDirectionVectors(),this._forward},enumerable:!1,configurable:!0}),t.prototype.reset=function(t,e,n){this.position=null!=t?t:new s,this.rotation=null!=e?e:new l,this.scale=null!=n?n:new s(1,1,1),this._forward=s.forward,this._right=s.right,this._up=s.up,this.shouldComputeDirections=!0},t.prototype.computeDirectionVectors=function(){if(this.shouldComputeDirections){var t=this.rotation.toMatrix4();this._up=u.multiplyMatrix4ByVector4(t,c.up),this._forward=u.multiplyMatrix4ByVector4(t,c.forward),this._right=u.multiplyMatrix4ByVector4(t,c.right),this.shouldComputeDirections=!1}},t.prototype.translate=function(t){this.position=s.add(this.position,t)},t.prototype.rotate=function(t){this.rotation.rotate(t.x,t.y,t.z),this.shouldComputeDirections=!0},t.prototype.setRotation=function(t){this.rotation=new l,this.rotation.rotate(t.x,t.y,t.z),this.shouldComputeDirections=!0},t.prototype.updateLocalMatrix=function(){this.localMatrix=u.makeIdentity();var t=u.makeTranslation(this.position.x,this.position.y,this.position.z),e=this.rotation.toMatrix4(),n=u.makeScale(this.scale.x,this.scale.y,this.scale.z);this.localMatrix=u.multiplyMatrices4(t,this.localMatrix),this.localMatrix=u.multiplyMatrices4(e,this.localMatrix),this.localMatrix=u.multiplyMatrices4(n,this.localMatrix)},t.prototype.updateWorldMatrix=function(t){this.worldMatrix=t?u.multiplyMatrices4(this.localMatrix,t):u.copy(this.localMatrix)},t.prototype.getWorldMatrix=function(){return this.worldMatrix},t.prototype.getLocalMatrix=function(){return this.localMatrix},t}(),f=function(){function t(t){this.transform=null!=t?t:new h,this.children=[]}return t.prototype.setParent=function(t){if(this.parent){var e=this.parent.children.indexOf(this);e>=0&&this.parent.children.splice(e,1)}t&&t.addChild(this),this.parent=t},t.prototype.addChild=function(t){this.children.push(t)},t.prototype.updateTransforms=function(){if(this.transform.updateLocalMatrix(),this.parent){var t=this.parent.transform.getWorldMatrix();this.transform.updateWorldMatrix(t)}else this.transform.updateWorldMatrix();this.children.forEach((function(t){t.updateTransforms()}))},t}(),x=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),m=function(t){function e(e,n){var o=t.call(this,n)||this;return o.renderer=e,o}return x(e,t),e.prototype.bufferData=function(t,e,n){var o=this.renderer.getContext();o.bindBuffer(n,t),o.bufferData(n,e,WebGLRenderingContext.STATIC_DRAW)},e.prototype.render=function(t){this.renderer.render(this,t)},e}(f),E=function(){function t(){}return t.computeTime=function(e){e*=.001,this.deltaTime=e-this.time,this.time=e,requestAnimationFrame(t.computeTime)},t.deltaTime=0,t.time=0,t}(),d=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),p=function(t){function e(e,n,o,r,i,a,s,c,u){var l=t.call(this,u)||this,h=l.renderer.getContext();return l.positions=h.createBuffer(),l.normals=h.createBuffer(),l.textureCoords=h.createBuffer(),l.indices=h.createBuffer(),l.joints=h.createBuffer(),l.weights=h.createBuffer(),l.indexCount=r.length,l.bufferData(l.indices,r,WebGLRenderingContext.ELEMENT_ARRAY_BUFFER),l.bufferData(l.positions,e,WebGLRenderingContext.ARRAY_BUFFER),l.bufferData(l.normals,n,WebGLRenderingContext.ARRAY_BUFFER),l.bufferData(l.textureCoords,o,WebGLRenderingContext.ARRAY_BUFFER),l.bufferData(l.joints,i,WebGLRenderingContext.ARRAY_BUFFER),l.bufferData(l.weights,a,WebGLRenderingContext.ARRAY_BUFFER),l.rootJoint=null!=s?s:null,l.jointCount=null!=c?c:0,l.boneTexture=h.createTexture(),h.bindTexture(WebGLRenderingContext.TEXTURE_2D,l.boneTexture),h.texParameteri(WebGLRenderingContext.TEXTURE_2D,WebGLRenderingContext.TEXTURE_MIN_FILTER,WebGLRenderingContext.NEAREST),h.texParameteri(WebGLRenderingContext.TEXTURE_2D,WebGLRenderingContext.TEXTURE_MAG_FILTER,WebGLRenderingContext.NEAREST),h.texParameteri(WebGLRenderingContext.TEXTURE_2D,WebGLRenderingContext.TEXTURE_WRAP_S,WebGLRenderingContext.CLAMP_TO_EDGE),h.texParameteri(WebGLRenderingContext.TEXTURE_2D,WebGLRenderingContext.TEXTURE_WRAP_T,WebGLRenderingContext.CLAMP_TO_EDGE),s&&s.setParent(l),l}return d(e,t),e.prototype.update=function(){var t=u.makeXRotation(.5*Math.sin(E.time));!function e(n,o){var r=u.multiplyMatrices4(n.transform.getLocalMatrix(),o);r=u.multiplyMatrices4(t,r),n.animatedMatrix=u.makeIdentity(),n.animatedMatrix=u.multiplyMatrices4(r,n.animatedMatrix),n.animatedMatrix=u.multiplyMatrices4(n.inverseBindMatrix,n.animatedMatrix),n.children&&n.children.forEach((function(t){e(t,r)}))}(this.rootJoint,this.transform.getWorldMatrix());var e=new Float32Array(16*this.jointCount);!function t(n){var o=16*n.id;e.set(n.animatedMatrix.flatten(),o),n.children&&n.children.forEach((function(e){t(e)}))}(this.rootJoint),this.test||(this.test=!0,console.log("animatedModel: ",e));var n=this.renderer.getContext();n.bindTexture(n.TEXTURE_2D,this.boneTexture),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,4,this.jointCount,0,n.RGBA,n.FLOAT,e)},e}(m),y=function(){function t(t,e){this.context=t,this.program=e}return t.prototype.getContext=function(){return this.context},t}(),A=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),g=function(t){function e(e,n){var o=t.call(this,e,n)||this;return o.positionAttributeLocation=e.getAttribLocation(n,"a_position"),o.texCoordsAttributeLocation=e.getAttribLocation(n,"a_texcoord"),o.normalsAttributeLocation=e.getAttribLocation(n,"a_normal"),o.jointsAttributeLocation=e.getAttribLocation(n,"a_joints"),o.weightsAttributeLocation=e.getAttribLocation(n,"a_weights"),o.worldMatrixUniformLocation=e.getUniformLocation(n,"u_worldMatrix"),o.viewMatrixUniformLocation=e.getUniformLocation(n,"u_viewMatrix"),o.projectionMatrixUniformLocation=e.getUniformLocation(n,"u_projectionMatrix"),o.worldInverseTransposeMatrixLocation=e.getUniformLocation(n,"u_worldInverseTransposeMatrix"),o.reverseLightDirectionLocation=e.getUniformLocation(n,"u_reverseLightDirection"),o.jointTextureLocation=e.getUniformLocation(n,"u_jointTexture"),o.jointCountLocation=e.getUniformLocation(n,"u_numJoints"),o}return A(e,t),e.prototype.loadTexture=function(t){var e=this.context.createTexture();return this.context.bindTexture(this.context.TEXTURE_2D,e),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_WRAP_S,this.context.CLAMP_TO_EDGE),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_WRAP_T,this.context.CLAMP_TO_EDGE),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_MIN_FILTER,this.context.NEAREST),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_MAG_FILTER,this.context.NEAREST),this.context.texImage2D(this.context.TEXTURE_2D,0,this.context.RGBA,this.context.RGBA,this.context.UNSIGNED_BYTE,t),this.context.generateMipmap(this.context.TEXTURE_2D),e},e.prototype.loadTexture2=function(t){var e=this.context.createTexture();return this.context.bindTexture(this.context.TEXTURE_2D,e),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_WRAP_S,this.context.CLAMP_TO_EDGE),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_WRAP_T,this.context.CLAMP_TO_EDGE),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_MIN_FILTER,this.context.NEAREST),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_MAG_FILTER,this.context.NEAREST),this.context.texImage2D(this.context.TEXTURE_2D,0,this.context.RGBA,1,1,0,this.context.RGBA,this.context.UNSIGNED_BYTE,new Uint8Array([0,0,255,255])),e},e.prototype.clear=function(){this.context.clearColor(.5,.5,.5,1),this.context.clear(this.context.COLOR_BUFFER_BIT|this.context.DEPTH_BUFFER_BIT)},e.prototype.render=function(t,e){var n=e.getPerspectiveMatrix(),o=u.makeViewMatrix(e.transform.position,s.add(e.transform.position,e.transform.forward),s.up);this.context.viewport(0,0,this.context.canvas.width,this.context.canvas.height),this.context.useProgram(this.program),this.context.enable(this.context.CULL_FACE),this.context.enable(this.context.DEPTH_TEST),this.context.uniform1i(this.jointTextureLocation,1),this.context.uniform1f(this.jointCountLocation,t.jointCount),this.context.uniformMatrix4fv(this.worldMatrixUniformLocation,!1,t.transform.getWorldMatrix().flatten()),this.context.uniformMatrix4fv(this.projectionMatrixUniformLocation,!1,n.flatten()),this.context.uniformMatrix4fv(this.viewMatrixUniformLocation,!1,o.flatten()),this.context.uniform1f(this.jointCountLocation,t.jointCount);var r=u.inverse(t.transform.getWorldMatrix());this.context.uniformMatrix4fv(this.worldInverseTransposeMatrixLocation,!1,u.transpose(r).flatten());var i=s.normalize(new s(.5,.7,1));this.context.uniform3fv(this.reverseLightDirectionLocation,new Float32Array([i.x,i.y,i.z])),this.context.bindBuffer(this.context.ARRAY_BUFFER,t.positions),this.context.enableVertexAttribArray(this.positionAttributeLocation),this.context.vertexAttribPointer(this.positionAttributeLocation,3,this.context.FLOAT,!1,0,0),this.context.bindBuffer(this.context.ARRAY_BUFFER,t.textureCoords),this.context.enableVertexAttribArray(this.texCoordsAttributeLocation),this.context.vertexAttribPointer(this.texCoordsAttributeLocation,2,this.context.FLOAT,!1,0,0),this.context.bindBuffer(this.context.ARRAY_BUFFER,t.normals),this.context.enableVertexAttribArray(this.normalsAttributeLocation),this.context.vertexAttribPointer(this.normalsAttributeLocation,3,this.context.FLOAT,!1,0,0),this.context.bindBuffer(this.context.ARRAY_BUFFER,t.joints),this.context.enableVertexAttribArray(this.jointsAttributeLocation),this.context.vertexAttribPointer(this.jointsAttributeLocation,4,this.context.UNSIGNED_BYTE,!1,0,0),this.context.bindBuffer(this.context.ARRAY_BUFFER,t.weights),this.context.enableVertexAttribArray(this.weightsAttributeLocation),this.context.vertexAttribPointer(this.weightsAttributeLocation,4,this.context.FLOAT,!1,0,0),this.context.activeTexture(this.context.TEXTURE0),this.context.bindTexture(this.context.TEXTURE_2D,t.texture),this.context.activeTexture(this.context.TEXTURE1),this.context.bindTexture(this.context.TEXTURE_2D,t.boneTexture),this.context.drawElements(WebGLRenderingContext.TRIANGLES,t.indexCount,this.context.UNSIGNED_SHORT,0)},e}(y),w=function(){function t(){}return t.loadFromScript=function(t,e,n){var o=t.createShader(n);if(t.shaderSource(o,e.text),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS))return o;console.error("Something went wrong when compiling a vertex shader. More info:",t.getShaderInfoLog(o))},t.createProgram=function(t,e,n){var o=t.createProgram();return t.attachShader(o,e),t.attachShader(o,n),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS)?o:(console.error("Something went wrong when compiling a vertex shader. More info:",t.getShaderInfoLog(o)),t.deleteProgram(o),null)},t}(),T=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),_=function(t){function e(e,n,o,r){var i=t.call(this,o)||this;return i.id=e,i.name=n,i.inverseBindMatrix=r,i}return T(e,t),e}(f),R=function(t,e,n,o){return new(n||(n=Promise))((function(r,i){function a(t){try{c(o.next(t))}catch(t){i(t)}}function s(t){try{c(o.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,s)}c((o=o.apply(t,e||[])).next())}))},b=function(t,e){var n,o,r,i,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,o&&(r=2&i[0]?o.return:i[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,i[1])).done)return r;switch(o=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,o=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((r=(r=a.trys).length>0&&r[r.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){a.label=i[1];break}if(6===i[0]&&a.label<r[1]){a.label=r[1],r=i;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(i);break}r[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],o=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}},v=function(){function t(){}return t.loadGltf=function(t){return R(this,void 0,void 0,(function(){var e,n,o,r,i,a,f=this;return b(this,(function(x){switch(x.label){case 0:return e={positionData:null,normalData:null,texCoordData:null,indicesData:null,jointData:null,weightData:null,rootJoint:null,jointCount:0},[4,this.loadJson(t)];case 1:return o=x.sent(),r=new URL(t,location.href),[4,Promise.all(o.buffers.map((function(t){var e=new URL(t.uri,r.href);return f.loadArrayBuffer(e.href)})))];case 2:return i=x.sent(),o.meshes.forEach((function(t){t.primitives.forEach((function(t){var n=t.attributes.POSITION,r=t.attributes.NORMAL,a=t.attributes.TEXCOORD_0,s=t.attributes.JOINTS_0,c=t.attributes.WEIGHTS_0,u=t.indices,l=o.accessors[n],h=o.accessors[r],f=o.accessors[a],x=o.accessors[s],m=o.accessors[c],E=o.accessors[u],d=o.bufferViews[l.bufferView],p=o.bufferViews[h.bufferView],y=o.bufferViews[f.bufferView],A=o.bufferViews[x.bufferView],g=o.bufferViews[m.bufferView],w=o.bufferViews[E.bufferView],T=i[d.buffer],_=i[p.buffer],R=i[y.buffer],b=i[A.buffer],v=i[g.buffer],L=i[w.buffer];e.positionData=new Float32Array(T,d.byteOffset,d.byteLength/Float32Array.BYTES_PER_ELEMENT),e.normalData=new Float32Array(_,p.byteOffset,p.byteLength/Float32Array.BYTES_PER_ELEMENT),e.texCoordData=new Float32Array(R,y.byteOffset,y.byteLength/Float32Array.BYTES_PER_ELEMENT),e.jointData=new Uint8Array(b,A.byteOffset,A.byteLength/Uint8Array.BYTES_PER_ELEMENT),e.weightData=new Float32Array(v,g.byteOffset,g.byteLength/Float32Array.BYTES_PER_ELEMENT),e.indicesData=new Uint16Array(L,w.byteOffset,w.byteLength/Uint16Array.BYTES_PER_ELEMENT),console.log("position",e.positionData),console.log("normals",e.normalData),console.log("tex coords",e.texCoordData),console.log("joint ids",e.jointData),console.log("weights",e.weightData),console.log("indices",e.indicesData)}))})),o.skins.forEach((function(t){var r=t.joints.map((function(t){return o.nodes[t]})),f=o.accessors[t.inverseBindMatrices],x=o.bufferViews[f.bufferView],m=i[x.buffer];n=new Float32Array(m,x.byteOffset,x.byteLength/Float32Array.BYTES_PER_ELEMENT);for(var E=new Array(n.length/16),d=0;d<E.length;d++){var p=16*d;E[d]=new u(n[0+p],n[1+p],n[2+p],n[3+p],n[4+p],n[5+p],n[6+p],n[7+p],n[8+p],n[9+p],n[10+p],n[11+p],n[12+p],n[13+p],n[14+p],n[15+p])}for(console.log("FileLoader: ",n),a=new Array(r.length),d=0;d<r.length;d++){u.makeIdentity();var y=new s(0,0,0),A=new c(0,0,0,1),g=new s(1,1,1);r[d].translation&&(y.x=r[d].translation[0],y.y=r[d].translation[1],y.z=r[d].translation[2]),r[d].rotation&&(A.x=r[d].rotation[0],A.y=r[d].rotation[1],A.z=r[d].rotation[2],A.w=r[d].rotation[3]),r[d].scale&&(g.x=r[d].scale[0],g.y=r[d].scale[1],g.z=r[d].scale[2]);var w=new l(A.x,A.y,A.z,A.w),T=new h(y,w,g);u.compose(y,g,A),a[d]=new _(d,r[d].name,T,E[d])}var R=function(t){r[t].children&&r[t].children.forEach((function(e){a.find((function(t){return t.name===o.nodes[e].name})).setParent(a[t])}))};for(d=0;d<r.length;d++)R(d);e.rootJoint=a[0],e.jointCount=a.length})),[2,e]}}))}))},t.loadText=function(t){return R(this,void 0,void 0,(function(){return b(this,(function(e){switch(e.label){case 0:return[4,fetch(t)];case 1:return[2,e.sent().text()]}}))}))},t.loadJson=function(t){return R(this,void 0,void 0,(function(){return b(this,(function(e){switch(e.label){case 0:return[4,fetch(t)];case 1:return[2,e.sent().json()]}}))}))},t.loadImage=function(t){return R(this,void 0,void 0,(function(){return b(this,(function(e){return[2,new Promise((function(e,n){var o=new Image;o.addEventListener("load",(function(){e(o)})),o.src=t}))]}))}))},t.loadArrayBuffer=function(t){return R(this,void 0,void 0,(function(){return b(this,(function(e){switch(e.label){case 0:return[4,fetch(t)];case 1:return[2,e.sent().arrayBuffer()]}}))}))},t}(),L=function(){function t(e,n,o,r){this.fieldOfView=e,this.aspectRatio=n,this.near=o,this.far=r,this.transform=new h,null===t.getActiveCamera()&&t.setActiveCamera(this)}return t.prototype.computePerspectiveMatrix=function(){this.perspectiveMatrix=u.makePerspective(this.fieldOfView,this.aspectRatio,this.near,this.far)},t.prototype.getPerspectiveMatrix=function(){return this.perspectiveMatrix},t.getActiveCamera=function(){return t.activeCamera},t.setActiveCamera=function(e){t.activeCamera=e},t.activeCamera=null,t}(),M=function(){function t(t,e,n){this.activeCamera=null!=t?t:null,this.globalLightDirection=null!=e?e:null,this.rootNodes=null!=n?n:[]}return t.prototype.update=function(){this.rootNodes.forEach((function(t){t.updateTransforms()}))},t.prototype.render=function(){var t=this;this.rootNodes.forEach((function(e){var n=e;n.render&&(n.update(),n.render(t.activeCamera))}))},t}(),D=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),U=function(t){function e(e,n,o,r,i){var a=t.call(this,i)||this,s=a.renderer.getContext();return a.positions=s.createBuffer(),a.normals=s.createBuffer(),a.textureCoords=s.createBuffer(),a.indices=s.createBuffer(),a.indexCount=r.length,a.bufferData(a.indices,r,WebGLRenderingContext.ELEMENT_ARRAY_BUFFER),a.bufferData(a.positions,e,WebGLRenderingContext.ARRAY_BUFFER),a.bufferData(a.normals,n,WebGLRenderingContext.ARRAY_BUFFER),a.bufferData(a.textureCoords,o,WebGLRenderingContext.ARRAY_BUFFER),a}return D(e,t),e.prototype.update=function(){},e}(m),C=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),P=function(t){function e(e,n){var o=t.call(this,e,n)||this;return o.positionAttributeLocation=e.getAttribLocation(n,"a_position"),o.texCoordsAttributeLocation=e.getAttribLocation(n,"a_texcoord"),o.normalsAttributeLocation=e.getAttribLocation(n,"a_normal"),o.worldMatrixUniformLocation=e.getUniformLocation(n,"u_worldMatrix"),o.viewMatrixUniformLocation=e.getUniformLocation(n,"u_viewMatrix"),o.projectionMatrixUniformLocation=e.getUniformLocation(n,"u_projectionMatrix"),o.worldInverseTransposeMatrixLocation=e.getUniformLocation(n,"u_worldInverseTransposeMatrix"),o.reverseLightDirectionLocation=e.getUniformLocation(n,"u_reverseLightDirection"),o}return C(e,t),e.prototype.loadTexture=function(t){var e=this.context.createTexture();return this.context.bindTexture(this.context.TEXTURE_2D,e),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_WRAP_S,this.context.CLAMP_TO_EDGE),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_WRAP_T,this.context.CLAMP_TO_EDGE),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_MIN_FILTER,this.context.NEAREST),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_MAG_FILTER,this.context.NEAREST),this.context.texImage2D(this.context.TEXTURE_2D,0,this.context.RGBA,this.context.RGBA,this.context.UNSIGNED_BYTE,t),this.context.generateMipmap(this.context.TEXTURE_2D),e},e.prototype.loadTexture2=function(t){var e=this.context.createTexture();return this.context.bindTexture(this.context.TEXTURE_2D,e),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_WRAP_S,this.context.CLAMP_TO_EDGE),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_WRAP_T,this.context.CLAMP_TO_EDGE),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_MIN_FILTER,this.context.NEAREST),this.context.texParameteri(this.context.TEXTURE_2D,this.context.TEXTURE_MAG_FILTER,this.context.NEAREST),this.context.texImage2D(this.context.TEXTURE_2D,0,this.context.RGBA,1,1,0,this.context.RGBA,this.context.UNSIGNED_BYTE,new Uint8Array([0,0,255,255])),e},e.prototype.clear=function(){this.context.clearColor(.5,.5,.5,1),this.context.clear(this.context.COLOR_BUFFER_BIT|this.context.DEPTH_BUFFER_BIT)},e.prototype.render=function(t,e){var n=e.getPerspectiveMatrix(),o=u.makeViewMatrix(e.transform.position,s.add(e.transform.position,e.transform.forward),s.up);this.context.viewport(0,0,this.context.canvas.width,this.context.canvas.height),this.context.useProgram(this.program),this.context.enable(this.context.CULL_FACE),this.context.enable(this.context.DEPTH_TEST),this.context.uniformMatrix4fv(this.worldMatrixUniformLocation,!1,t.transform.getWorldMatrix().flatten()),this.context.uniformMatrix4fv(this.projectionMatrixUniformLocation,!1,n.flatten()),this.context.uniformMatrix4fv(this.viewMatrixUniformLocation,!1,o.flatten());var r=u.inverse(t.transform.getWorldMatrix());this.context.uniformMatrix4fv(this.worldInverseTransposeMatrixLocation,!1,u.transpose(r).flatten());var i=s.normalize(new s(.5,.7,1));this.context.uniform3fv(this.reverseLightDirectionLocation,new Float32Array([i.x,i.y,i.z])),this.context.bindBuffer(this.context.ARRAY_BUFFER,t.positions),this.context.enableVertexAttribArray(this.positionAttributeLocation),this.context.vertexAttribPointer(this.positionAttributeLocation,3,this.context.FLOAT,!1,0,0),this.context.bindBuffer(this.context.ARRAY_BUFFER,t.textureCoords),this.context.enableVertexAttribArray(this.texCoordsAttributeLocation),this.context.vertexAttribPointer(this.texCoordsAttributeLocation,2,this.context.FLOAT,!1,0,0),this.context.bindBuffer(this.context.ARRAY_BUFFER,t.normals),this.context.enableVertexAttribArray(this.normalsAttributeLocation),this.context.vertexAttribPointer(this.normalsAttributeLocation,3,this.context.FLOAT,!1,0,0),this.context.activeTexture(this.context.TEXTURE0),this.context.bindTexture(this.context.TEXTURE_2D,t.texture),this.context.drawElements(WebGLRenderingContext.TRIANGLES,t.indexCount,this.context.UNSIGNED_SHORT,0)},e}(y),z={cameraObj:null,forwardVelocity:new s(0,0,0),rightVelocity:new s(0,0,0),maxXRotation:t(88),minXRotation:t(-88),currentRotationAngles:new s,cameraSpeed:20,mouseSensibility:.1,Move:function(t){var e=this.cameraObj,n=this.cameraSpeed*E.deltaTime,o=s.multiply(e.transform.forward,-t.z),r=s.multiply(e.transform.right,t.x),i=s.multiply(s.add(o,r),n);e.transform.translate(i)},Rotate:function(t){var e=this.cameraObj,n=this.mouseSensibility*E.deltaTime;new s(this.currentRotationAngles.x,this.currentRotationAngles.y,0),this.currentRotationAngles.x-=n*t.x,this.currentRotationAngles.y-=n*t.y,this.currentRotationAngles.x>this.maxXRotation?this.currentRotationAngles.x=this.maxXRotation:this.currentRotationAngles.x<this.minXRotation&&(this.currentRotationAngles.x=this.minXRotation),e.transform.setRotation(this.currentRotationAngles)}},F={up:!1,down:!1,left:!1,right:!1},O=new Array;function S(t){var e;E.computeTime(t),e=new s,F.up&&(e=s.add(e,s.forward)),F.down&&(e=s.add(e,s.backward)),F.right&&(e=s.add(e,s.right)),F.left&&(e=s.add(e,s.left)),z.Move(e),i.update(),r.clear(),i.render(),requestAnimationFrame(S)}window.onload=function(){v.loadGltf("./assets/whale.CYCLES.gltf").then((function(e){!function(){var e=document.querySelector("#canvas"),n=document.querySelector("#vertex-shader-3d-textured-lit2"),i=document.querySelector("#fragment-shader-3d-textured-lit2"),a=document.querySelector("#vertex-shader-3d-textured-skinned"),s=document.querySelector("#fragment-shader-3d-textured-skinned"),c=e.getContext("webgl");if(c){c.getExtension("OES_texture_float");var u=w.loadFromScript(c,n,c.VERTEX_SHADER),l=w.loadFromScript(c,i,c.FRAGMENT_SHADER),h=w.createProgram(c,u,l);o=new P(c,h),u=w.loadFromScript(c,a,c.VERTEX_SHADER),l=w.loadFromScript(c,s,c.FRAGMENT_SHADER),h=w.createProgram(c,u,l),r=new g(c,h);var f=e.clientWidth/e.clientHeight,x=t(60);z.cameraObj=new L(x,f,1,2e3),z.cameraObj.computePerspectiveMatrix()}else console.error("Something went wrong while creating webgl context")}(),i=new M(z.cameraObj,s.normalize(new s(.5,.7,1)),[]);var n=r.loadTexture2(new c(0,0,255,255)),a=new U(e.positionData,e.normalData,e.texCoordData,e.indicesData,o);a.transform.position=new s(3,5,0),a.transform.scale=new s(.4347,.4347,.4347),a.transform.rotate(new s(t(90),0,0)),a.texture=n,O.push(a),i.rootNodes.push(a),a.update=function(){};var u=new p(e.positionData,e.normalData,e.texCoordData,e.indicesData,e.jointData,e.weightData,e.rootJoint,e.jointCount,r);u.transform.position=new s(0,0,0),u.texture=n,O.push(u),i.rootNodes.push(u),function(){document.addEventListener("keydown",(function(t){"w"===t.key?F.up=!0:"s"===t.key?F.down=!0:"a"===t.key?F.left=!0:"d"===t.key?F.right=!0:t.key})),document.addEventListener("keyup",(function(t){"w"===t.key?F.up=!1:"s"===t.key?F.down=!1:"a"===t.key?F.left=!1:"d"===t.key?F.right=!1:t.key}));var t=r.getContext().canvas;function e(t){var e=new s(t.movementY,t.movementX,0);z.Rotate(e)}t.addEventListener("click",(function(t){this.requestPointerLock()})),document.addEventListener("pointerlockchange",(function(){document.pointerLockElement===t?document.addEventListener("mousemove",e):document.removeEventListener("mousemove",e)}))}(),requestAnimationFrame(S)}))}})();
//# sourceMappingURL=main.js.map