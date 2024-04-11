uniform float uPointSize;
varying vec2 vTextureCoord;
attribute vec3 initPosition;
uniform float uProgress;
uniform float uFrequency;
uniform float uTime;
const float amplitude = 2.;
uniform vec3 uMousePosition;

void main(){
  #include <begin_vertex>

  transformed = initPosition + ((position - initPosition) * uProgress);
  // transformed = initPosition + ((position - initPosition) * 0.853);

  transformed.z += sin(transformed.x * uFrequency + uTime) * amplitude;
  transformed.z += cos(transformed.y * uFrequency + uTime) * amplitude;

  // vec2 vUv = transformed.xy / vec2(uNbLines, uNbColumns) - vec2(-0.5, -0.5);

  // float touch = texture2D(uTouch, vUv);

  // transformed.z += touch * 40.;

  #include <project_vertex>
  vTextureCoord = position.xy;
  
  gl_PointSize = uPointSize ;
  
}