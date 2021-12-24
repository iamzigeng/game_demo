export const Effect3_4 = {
    name: "../cinestation/examples/art/Shaders/View",
    techniques: [{ "name": "transparent", "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendSrcAlpha": 2, "blendDstAlpha": 4 }] }, "program": "../cinestation/examples/art/Shaders/View|view-vs:vert|view-fs:frag", "properties": { "lookatPoint": { "value": [0.5, 0.5], "type": 14 }, "deadZoneWidth": { "value": [0.1], "type": 13, "handleInfo": ["viewParams", 0, 13] }, "deadZoneHeight": { "value": [0.1], "type": 13, "handleInfo": ["viewParams", 1, 13] }, "softZoneWidth": { "value": [0.8], "type": 13, "handleInfo": ["viewParams", 2, 13] }, "softZoneHeight": { "value": [0.8], "type": 13, "handleInfo": ["viewParams", 3, 13] }, "viewParams": { "type": 16, "editor": { "visible": false, "deprecated": true }, "value": [0, 0, 0.8, 0.8] } } }] }],
    shaders:[{"blocks":[{"name":"Constant","members":[{"name":"viewParams","type":16,"count":1},{"name":"lookatPoint","type":14,"count":1}],"defines":[],"stageFlags":16,"binding":0}],"samplerTextures":[],"samplers":[],"textures":[],"buffers":[],"images":[],"subpassInputs":[],"attributes":[{"name":"a_position","defines":[],"format":32,"location":0},{"name":"a_normal","defines":[],"format":32,"location":1},{"name":"a_texCoord","defines":[],"format":21,"location":2},{"name":"a_tangent","defines":[],"format":44,"location":3},{"name":"a_vertexId","defines":["CC_USE_MORPH"],"format":11,"location":6},{"name":"a_joints","defines":["CC_USE_SKINNING"],"location":4},{"name":"a_weights","defines":["CC_USE_SKINNING"],"format":44,"location":5},{"name":"a_jointAnimInfo","defines":["CC_USE_SKINNING","CC_USE_BAKED_ANIMATION","USE_INSTANCING"],"format":44,"isInstanced":true,"location":7},{"name":"a_matWorld0","defines":["USE_INSTANCING"],"format":44,"isInstanced":true,"location":8},{"name":"a_matWorld1","defines":["USE_INSTANCING"],"format":44,"isInstanced":true,"location":9},{"name":"a_matWorld2","defines":["USE_INSTANCING"],"format":44,"isInstanced":true,"location":10},{"name":"a_lightingMapUVParam","defines":["USE_INSTANCING","USE_LIGHTMAP"],"format":44,"isInstanced":true,"location":11},{"name":"a_dyn_batch_id","defines":["!USE_INSTANCING","USE_BATCHING"],"format":11,"location":12}],"varyings":[],"fragColors":[{"name":"cc_FragColor","typename":"vec4","type":16,"count":1,"defines":[],"stageFlags":16,"location":0}],"hash":3775263886,"glsl4":{"vert":"#extension GL_EXT_shader_explicit_arithmetic_types_int32: require\nprecision highp float;\nhighp float decode32 (highp vec4 rgba) {\n  rgba = rgba * 255.0;\n  highp float Sign = 1.0 - (step(128.0, (rgba[3]) + 0.5)) * 2.0;\n  highp float Exponent = 2.0 * (mod(float(int((rgba[3]) + 0.5)), 128.0)) + (step(128.0, (rgba[2]) + 0.5)) - 127.0;\n  highp float Mantissa = (mod(float(int((rgba[2]) + 0.5)), 128.0)) * 65536.0 + rgba[1] * 256.0 + rgba[0] + 8388608.0;\n  return Sign * exp2(Exponent - 23.0) * Mantissa;\n}\nstruct StandardVertInput {\n  highp vec4 position;\n  vec3 normal;\n  vec4 tangent;\n};\nlayout(location = 0) in vec3 a_position;\nlayout(location = 1) in vec3 a_normal;\nlayout(location = 2) in vec2 a_texCoord;\nlayout(location = 3) in vec4 a_tangent;\n#if CC_USE_MORPH\n    int getVertexId() {\n      return gl_VertexIndex;\n    }\n  layout(set = 2, binding = 4) uniform CCMorph {\n    vec4 cc_displacementWeights[15];\n    vec4 cc_displacementTextureInfo;\n  };\n  vec2 getPixelLocation(vec2 textureResolution, int pixelIndex) {\n    float pixelIndexF = float(pixelIndex);\n    float x = mod(pixelIndexF, textureResolution.x);\n    float y = floor(pixelIndexF / textureResolution.x);\n    return vec2(x, y);\n  }\n  vec2 getPixelCoordFromLocation(vec2 location, vec2 textureResolution) {\n    return (vec2(location.x, location.y) + .5) / textureResolution;\n  }\n  #if CC_DEVICE_SUPPORT_FLOAT_TEXTURE\n      vec4 fetchVec3ArrayFromTexture(sampler2D tex, int pixelIndex) {\n        ivec2 texSize = textureSize(tex, 0);\n        return texelFetch(tex, ivec2(pixelIndex % texSize.x, pixelIndex / texSize.x), 0);\n      }\n  #else\n    vec4 fetchVec3ArrayFromTexture(sampler2D tex, int elementIndex) {\n      int pixelIndex = elementIndex * 4;\n      vec2 location = getPixelLocation(cc_displacementTextureInfo.xy, pixelIndex);\n      vec2 x = getPixelCoordFromLocation(location + vec2(0.0, 0.0), cc_displacementTextureInfo.xy);\n      vec2 y = getPixelCoordFromLocation(location + vec2(1.0, 0.0), cc_displacementTextureInfo.xy);\n      vec2 z = getPixelCoordFromLocation(location + vec2(2.0, 0.0), cc_displacementTextureInfo.xy);\n      return vec4(\n        decode32(texture(tex, x)),\n        decode32(texture(tex, y)),\n        decode32(texture(tex, z)),\n        1.0\n      );\n    }\n  #endif\n  float getDisplacementWeight(int index) {\n    int quot = index / 4;\n    int remainder = index - quot * 4;\n    if (remainder == 0) {\n      return cc_displacementWeights[quot].x;\n    } else if (remainder == 1) {\n      return cc_displacementWeights[quot].y;\n    } else if (remainder == 2) {\n      return cc_displacementWeights[quot].z;\n    } else {\n      return cc_displacementWeights[quot].w;\n    }\n  }\n  vec3 getVec3DisplacementFromTexture(sampler2D tex, int vertexIndex) {\n  #if CC_MORPH_PRECOMPUTED\n    return fetchVec3ArrayFromTexture(tex, vertexIndex).rgb;\n  #else\n    vec3 result = vec3(0, 0, 0);\n    int nVertices = int(cc_displacementTextureInfo.z);\n    for (int iTarget = 0; iTarget < CC_MORPH_TARGET_COUNT; ++iTarget) {\n      result += (fetchVec3ArrayFromTexture(tex, nVertices * iTarget + vertexIndex).rgb * getDisplacementWeight(iTarget));\n    }\n    return result;\n  #endif\n  }\n  #if CC_MORPH_TARGET_HAS_POSITION\n    layout(set = 2, binding = 7) uniform sampler2D cc_PositionDisplacements;\n    vec3 getPositionDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_PositionDisplacements, vertexId);\n    }\n  #endif\n  #if CC_MORPH_TARGET_HAS_NORMAL\n    layout(set = 2, binding = 8) uniform sampler2D cc_NormalDisplacements;\n    vec3 getNormalDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_NormalDisplacements, vertexId);\n    }\n  #endif\n  #if CC_MORPH_TARGET_HAS_TANGENT\n    layout(set = 2, binding = 9) uniform sampler2D cc_TangentDisplacements;\n    vec3 getTangentDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_TangentDisplacements, vertexId);\n    }\n  #endif\n  void applyMorph (inout StandardVertInput attr) {\n    int vertexId = getVertexId();\n  #if CC_MORPH_TARGET_HAS_POSITION\n    attr.position.xyz = attr.position.xyz + getPositionDisplacement(vertexId);\n  #endif\n  #if CC_MORPH_TARGET_HAS_NORMAL\n    attr.normal.xyz = attr.normal.xyz + getNormalDisplacement(vertexId);\n  #endif\n  #if CC_MORPH_TARGET_HAS_TANGENT\n    attr.tangent.xyz = attr.tangent.xyz + getTangentDisplacement(vertexId);\n  #endif\n  }\n  void applyMorph (inout vec4 position) {\n  #if CC_MORPH_TARGET_HAS_POSITION\n    position.xyz = position.xyz + getPositionDisplacement(getVertexId());\n  #endif\n  }\n#endif\n#if CC_USE_SKINNING\n    layout(location = 4) in u32vec4 a_joints;\n  layout(location = 5) in vec4 a_weights;\n  #if CC_USE_BAKED_ANIMATION\n    #if USE_INSTANCING\n      layout(location = 7) in highp vec4 a_jointAnimInfo;\n    #endif\n    layout(set = 2, binding = 3) uniform CCSkinningTexture {\n      highp vec4 cc_jointTextureInfo;\n    };\n    layout(set = 2, binding = 2) uniform CCSkinningAnimation {\n      highp vec4 cc_jointAnimInfo;\n    };\n    layout(set = 2, binding = 6) uniform highp sampler2D cc_jointTexture;\n      #else\n    layout(set = 2, binding = 3) uniform CCSkinning {\n      highp vec4 cc_joints[30 * 3];\n    };\n  #endif\n  #if CC_USE_BAKED_ANIMATION\n    #if CC_DEVICE_SUPPORT_FLOAT_TEXTURE\n      mat4 getJointMatrix (float i) {\n              #if USE_INSTANCING\n                highp float j = 3.0 * (a_jointAnimInfo.x * a_jointAnimInfo.y + i) + a_jointAnimInfo.z;\n              #else\n                highp float j = 3.0 * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + i) + cc_jointTextureInfo.z;\n              #endif\n              highp float invSize = cc_jointTextureInfo.w;\n              highp float y = floor(j * invSize);\n              highp float x = floor(j - y * cc_jointTextureInfo.x);\n              y = (y + 0.5) * invSize;\n        vec4 v1 = texture(cc_jointTexture, vec2((x + 0.5) * invSize, y));\n        vec4 v2 = texture(cc_jointTexture, vec2((x + 1.5) * invSize, y));\n        vec4 v3 = texture(cc_jointTexture, vec2((x + 2.5) * invSize, y));\n        return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n      }\n    #else\n      mat4 getJointMatrix (float i) {\n              #if USE_INSTANCING\n                highp float j = 12.0 * (a_jointAnimInfo.x * a_jointAnimInfo.y + i) + a_jointAnimInfo.z;\n              #else\n                highp float j = 12.0 * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + i) + cc_jointTextureInfo.z;\n              #endif\n              highp float invSize = cc_jointTextureInfo.w;\n              highp float y = floor(j * invSize);\n              highp float x = floor(j - y * cc_jointTextureInfo.x);\n              y = (y + 0.5) * invSize;\n        vec4 v1 = vec4(\n          decode32(texture(cc_jointTexture, vec2((x + 0.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 1.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 2.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 3.5) * invSize, y)))\n        );\n        vec4 v2 = vec4(\n          decode32(texture(cc_jointTexture, vec2((x + 4.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 5.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 6.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 7.5) * invSize, y)))\n        );\n        vec4 v3 = vec4(\n          decode32(texture(cc_jointTexture, vec2((x + 8.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 9.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 10.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 11.5) * invSize, y)))\n        );\n        return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n      }\n    #endif\n  #else\n    mat4 getJointMatrix (float i) {\n      int idx = int(i);\n      vec4 v1 = cc_joints[idx * 3];\n      vec4 v2 = cc_joints[idx * 3 + 1];\n      vec4 v3 = cc_joints[idx * 3 + 2];\n      return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n    }\n  #endif\n  mat4 skinMatrix () {\n    vec4 joints = vec4(a_joints);\n    return getJointMatrix(joints.x) * a_weights.x\n         + getJointMatrix(joints.y) * a_weights.y\n         + getJointMatrix(joints.z) * a_weights.z\n         + getJointMatrix(joints.w) * a_weights.w;\n  }\n  void CCSkin (inout vec4 position) {\n    mat4 m = skinMatrix();\n    position = m * position;\n  }\n  void CCSkin (inout StandardVertInput attr) {\n    mat4 m = skinMatrix();\n    attr.position = m * attr.position;\n    attr.normal = (m * vec4(attr.normal, 0.0)).xyz;\n    attr.tangent.xyz = (m * vec4(attr.tangent.xyz, 0.0)).xyz;\n  }\n#endif\n#if USE_INSTANCING\n  layout(location = 8) in vec4 a_matWorld0;\n  layout(location = 9) in vec4 a_matWorld1;\n  layout(location = 10) in vec4 a_matWorld2;\n  #if USE_LIGHTMAP\n    layout(location = 11) in vec4 a_lightingMapUVParam;\n  #endif\n#elif USE_BATCHING\n  layout(location = 12) in float a_dyn_batch_id;\n  layout(set = 2, binding = 0) uniform CCLocalBatched {\n    highp mat4 cc_matWorlds[10];\n  };\n#else\n  layout(set = 2, binding = 0) uniform CCLocal {\n    highp mat4 cc_matWorld;\n    highp mat4 cc_matWorldIT;\n    highp vec4 cc_lightingMapUVParam;\n  };\n#endif\nvec4 vert() {\n  vec4 position;\n      position = vec4(a_position, 1.0);\n    #if CC_USE_MORPH\n      applyMorph(position);\n    #endif\n    #if CC_USE_SKINNING\n      CCSkin(position);\n    #endif\n  return vec4(position.xyz * 2., 1.0);\n}\nvoid main() { gl_Position = vert(); }","frag":"\nprecision highp float;\nlayout(set = 0, binding = 0) uniform CCGlobal {\n  highp   vec4 cc_time;\n  mediump vec4 cc_screenSize;\n  mediump vec4 cc_nativeSize;\n};\nlayout(set = 0, binding = 1) uniform CCCamera {\n  highp   mat4 cc_matView;\n  highp   mat4 cc_matViewInv;\n  highp   mat4 cc_matProj;\n  highp   mat4 cc_matProjInv;\n  highp   mat4 cc_matViewProj;\n  highp   mat4 cc_matViewProjInv;\n  highp   vec4 cc_cameraPos;\n  mediump vec4 cc_screenScale;\n  mediump vec4 cc_exposure;\n  mediump vec4 cc_mainLitDir;\n  mediump vec4 cc_mainLitColor;\n  mediump vec4 cc_ambientSky;\n  mediump vec4 cc_ambientGround;\n  mediump vec4 cc_fogColor;\n  mediump vec4 cc_fogBase;\n  mediump vec4 cc_fogAdd;\n  mediump vec4 cc_nearFar;\n  mediump vec4 cc_viewPort;\n};\nlayout(set = 1, binding = 0) uniform Constant {\n  vec4 viewParams;\n  vec2 lookatPoint;\n};\nfloat sdf_union(float a, float b) {\n  return min(a, b);\n}\nfloat sdf_intersect(float a, float b) {\n  return max(a, b);\n}\nvec4 frag () {\n  vec2  uv = gl_FragCoord.xy * cc_screenSize.zw;\n  float dx = abs(uv.x - 0.5) * 2.;\n  float dy = abs(uv.y - 0.5) * 2.;\n  float dpx = abs(uv.x - lookatPoint.x) * 2.;\n  float dpy = abs(uv.y - lookatPoint.y) * 2.;\n  float softZoneWidth = max(viewParams.x, viewParams.z);\n  float softZoneHeight = max(viewParams.y, viewParams.w);\n  float deadZone = sdf_intersect(step(viewParams.x, dx), step(viewParams.y, dy));\n  float softZone = sdf_intersect(step(softZoneWidth, dx), step(softZoneHeight, dy));\n  float deadZoneLine0 = sdf_intersect(1. - step(viewParams.x, dx), step(viewParams.x + 7. * cc_screenSize.z, dx));\n  float deadZoneLine1 = sdf_intersect(1. - step(viewParams.y, dy), step(viewParams.y + 7. * cc_screenSize.w, dy));\n  float softZoneLine0 = sdf_intersect(1. - step(softZoneWidth, dx), step(softZoneWidth + 7. * cc_screenSize.z, dx));\n  float softZoneLine1 = sdf_intersect(1. - step(softZoneHeight, dy), step(softZoneHeight + 7. * cc_screenSize.w, dy));\n  vec4  color = vec4(1,0,0,0.15);\n  color = mix(vec4(0,0.7,1,0.15), color, softZone);\n  color = mix(vec4(0), color, deadZone);\n  color = mix(vec4(0,0.7,1,0.3), color, sdf_union(deadZoneLine0, deadZoneLine1));\n  color = mix(vec4(1,0,0,0.3), color, sdf_union(softZoneLine0, softZoneLine1));\n  color = mix(vec4(1,1,0,1), color, sdf_intersect(step(10. * cc_screenSize.z, dpx), step(10. * cc_screenSize.z, dpy * cc_screenSize.y/cc_screenSize.x)));\n  return color;\n}\nlayout(location = 0) out vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }"},"glsl3":{"vert":"\nprecision highp float;\nhighp float decode32 (highp vec4 rgba) {\n  rgba = rgba * 255.0;\n  highp float Sign = 1.0 - (step(128.0, (rgba[3]) + 0.5)) * 2.0;\n  highp float Exponent = 2.0 * (mod(float(int((rgba[3]) + 0.5)), 128.0)) + (step(128.0, (rgba[2]) + 0.5)) - 127.0;\n  highp float Mantissa = (mod(float(int((rgba[2]) + 0.5)), 128.0)) * 65536.0 + rgba[1] * 256.0 + rgba[0] + 8388608.0;\n  return Sign * exp2(Exponent - 23.0) * Mantissa;\n}\nstruct StandardVertInput {\n  highp vec4 position;\n  vec3 normal;\n  vec4 tangent;\n};\nin vec3 a_position;\nin vec3 a_normal;\nin vec2 a_texCoord;\nin vec4 a_tangent;\n#if CC_USE_MORPH\n    in float a_vertexId;\n    int getVertexId() {\n      return int(a_vertexId);\n    }\n  layout(std140) uniform CCMorph {\n    vec4 cc_displacementWeights[15];\n    vec4 cc_displacementTextureInfo;\n  };\n  vec2 getPixelLocation(vec2 textureResolution, int pixelIndex) {\n    float pixelIndexF = float(pixelIndex);\n    float x = mod(pixelIndexF, textureResolution.x);\n    float y = floor(pixelIndexF / textureResolution.x);\n    return vec2(x, y);\n  }\n  vec2 getPixelCoordFromLocation(vec2 location, vec2 textureResolution) {\n    return (vec2(location.x, location.y) + .5) / textureResolution;\n  }\n  #if CC_DEVICE_SUPPORT_FLOAT_TEXTURE\n      vec4 fetchVec3ArrayFromTexture(sampler2D tex, int pixelIndex) {\n        ivec2 texSize = textureSize(tex, 0);\n        return texelFetch(tex, ivec2(pixelIndex % texSize.x, pixelIndex / texSize.x), 0);\n      }\n  #else\n    vec4 fetchVec3ArrayFromTexture(sampler2D tex, int elementIndex) {\n      int pixelIndex = elementIndex * 4;\n      vec2 location = getPixelLocation(cc_displacementTextureInfo.xy, pixelIndex);\n      vec2 x = getPixelCoordFromLocation(location + vec2(0.0, 0.0), cc_displacementTextureInfo.xy);\n      vec2 y = getPixelCoordFromLocation(location + vec2(1.0, 0.0), cc_displacementTextureInfo.xy);\n      vec2 z = getPixelCoordFromLocation(location + vec2(2.0, 0.0), cc_displacementTextureInfo.xy);\n      return vec4(\n        decode32(texture(tex, x)),\n        decode32(texture(tex, y)),\n        decode32(texture(tex, z)),\n        1.0\n      );\n    }\n  #endif\n  float getDisplacementWeight(int index) {\n    int quot = index / 4;\n    int remainder = index - quot * 4;\n    if (remainder == 0) {\n      return cc_displacementWeights[quot].x;\n    } else if (remainder == 1) {\n      return cc_displacementWeights[quot].y;\n    } else if (remainder == 2) {\n      return cc_displacementWeights[quot].z;\n    } else {\n      return cc_displacementWeights[quot].w;\n    }\n  }\n  vec3 getVec3DisplacementFromTexture(sampler2D tex, int vertexIndex) {\n  #if CC_MORPH_PRECOMPUTED\n    return fetchVec3ArrayFromTexture(tex, vertexIndex).rgb;\n  #else\n    vec3 result = vec3(0, 0, 0);\n    int nVertices = int(cc_displacementTextureInfo.z);\n    for (int iTarget = 0; iTarget < CC_MORPH_TARGET_COUNT; ++iTarget) {\n      result += (fetchVec3ArrayFromTexture(tex, nVertices * iTarget + vertexIndex).rgb * getDisplacementWeight(iTarget));\n    }\n    return result;\n  #endif\n  }\n  #if CC_MORPH_TARGET_HAS_POSITION\n    uniform sampler2D cc_PositionDisplacements;\n    vec3 getPositionDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_PositionDisplacements, vertexId);\n    }\n  #endif\n  #if CC_MORPH_TARGET_HAS_NORMAL\n    uniform sampler2D cc_NormalDisplacements;\n    vec3 getNormalDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_NormalDisplacements, vertexId);\n    }\n  #endif\n  #if CC_MORPH_TARGET_HAS_TANGENT\n    uniform sampler2D cc_TangentDisplacements;\n    vec3 getTangentDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_TangentDisplacements, vertexId);\n    }\n  #endif\n  void applyMorph (inout StandardVertInput attr) {\n    int vertexId = getVertexId();\n  #if CC_MORPH_TARGET_HAS_POSITION\n    attr.position.xyz = attr.position.xyz + getPositionDisplacement(vertexId);\n  #endif\n  #if CC_MORPH_TARGET_HAS_NORMAL\n    attr.normal.xyz = attr.normal.xyz + getNormalDisplacement(vertexId);\n  #endif\n  #if CC_MORPH_TARGET_HAS_TANGENT\n    attr.tangent.xyz = attr.tangent.xyz + getTangentDisplacement(vertexId);\n  #endif\n  }\n  void applyMorph (inout vec4 position) {\n  #if CC_MORPH_TARGET_HAS_POSITION\n    position.xyz = position.xyz + getPositionDisplacement(getVertexId());\n  #endif\n  }\n#endif\n#if CC_USE_SKINNING\n    in vec4 a_joints;\n  in vec4 a_weights;\n  #if CC_USE_BAKED_ANIMATION\n    #if USE_INSTANCING\n      in highp vec4 a_jointAnimInfo;\n    #endif\n    layout(std140) uniform CCSkinningTexture {\n      highp vec4 cc_jointTextureInfo;\n    };\n    layout(std140) uniform CCSkinningAnimation {\n      highp vec4 cc_jointAnimInfo;\n    };\n    uniform highp sampler2D cc_jointTexture;\n      #else\n    layout(std140) uniform CCSkinning {\n      highp vec4 cc_joints[30 * 3];\n    };\n  #endif\n  #if CC_USE_BAKED_ANIMATION\n    #if CC_DEVICE_SUPPORT_FLOAT_TEXTURE\n      mat4 getJointMatrix (float i) {\n              #if USE_INSTANCING\n                highp float j = 3.0 * (a_jointAnimInfo.x * a_jointAnimInfo.y + i) + a_jointAnimInfo.z;\n              #else\n                highp float j = 3.0 * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + i) + cc_jointTextureInfo.z;\n              #endif\n              highp float invSize = cc_jointTextureInfo.w;\n              highp float y = floor(j * invSize);\n              highp float x = floor(j - y * cc_jointTextureInfo.x);\n              y = (y + 0.5) * invSize;\n        vec4 v1 = texture(cc_jointTexture, vec2((x + 0.5) * invSize, y));\n        vec4 v2 = texture(cc_jointTexture, vec2((x + 1.5) * invSize, y));\n        vec4 v3 = texture(cc_jointTexture, vec2((x + 2.5) * invSize, y));\n        return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n      }\n    #else\n      mat4 getJointMatrix (float i) {\n              #if USE_INSTANCING\n                highp float j = 12.0 * (a_jointAnimInfo.x * a_jointAnimInfo.y + i) + a_jointAnimInfo.z;\n              #else\n                highp float j = 12.0 * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + i) + cc_jointTextureInfo.z;\n              #endif\n              highp float invSize = cc_jointTextureInfo.w;\n              highp float y = floor(j * invSize);\n              highp float x = floor(j - y * cc_jointTextureInfo.x);\n              y = (y + 0.5) * invSize;\n        vec4 v1 = vec4(\n          decode32(texture(cc_jointTexture, vec2((x + 0.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 1.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 2.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 3.5) * invSize, y)))\n        );\n        vec4 v2 = vec4(\n          decode32(texture(cc_jointTexture, vec2((x + 4.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 5.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 6.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 7.5) * invSize, y)))\n        );\n        vec4 v3 = vec4(\n          decode32(texture(cc_jointTexture, vec2((x + 8.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 9.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 10.5) * invSize, y))),\n          decode32(texture(cc_jointTexture, vec2((x + 11.5) * invSize, y)))\n        );\n        return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n      }\n    #endif\n  #else\n    mat4 getJointMatrix (float i) {\n      int idx = int(i);\n      vec4 v1 = cc_joints[idx * 3];\n      vec4 v2 = cc_joints[idx * 3 + 1];\n      vec4 v3 = cc_joints[idx * 3 + 2];\n      return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n    }\n  #endif\n  mat4 skinMatrix () {\n    vec4 joints = vec4(a_joints);\n    return getJointMatrix(joints.x) * a_weights.x\n         + getJointMatrix(joints.y) * a_weights.y\n         + getJointMatrix(joints.z) * a_weights.z\n         + getJointMatrix(joints.w) * a_weights.w;\n  }\n  void CCSkin (inout vec4 position) {\n    mat4 m = skinMatrix();\n    position = m * position;\n  }\n  void CCSkin (inout StandardVertInput attr) {\n    mat4 m = skinMatrix();\n    attr.position = m * attr.position;\n    attr.normal = (m * vec4(attr.normal, 0.0)).xyz;\n    attr.tangent.xyz = (m * vec4(attr.tangent.xyz, 0.0)).xyz;\n  }\n#endif\n#if USE_INSTANCING\n  in vec4 a_matWorld0;\n  in vec4 a_matWorld1;\n  in vec4 a_matWorld2;\n  #if USE_LIGHTMAP\n    in vec4 a_lightingMapUVParam;\n  #endif\n#elif USE_BATCHING\n  in float a_dyn_batch_id;\n  layout(std140) uniform CCLocalBatched {\n    highp mat4 cc_matWorlds[10];\n  };\n#else\n  layout(std140) uniform CCLocal {\n    highp mat4 cc_matWorld;\n    highp mat4 cc_matWorldIT;\n    highp vec4 cc_lightingMapUVParam;\n  };\n#endif\nvec4 vert() {\n  vec4 position;\n      position = vec4(a_position, 1.0);\n    #if CC_USE_MORPH\n      applyMorph(position);\n    #endif\n    #if CC_USE_SKINNING\n      CCSkin(position);\n    #endif\n  return vec4(position.xyz * 2., 1.0);\n}\nvoid main() { gl_Position = vert(); }","frag":"\nprecision highp float;\nlayout(std140) uniform CCGlobal {\n  highp   vec4 cc_time;\n  mediump vec4 cc_screenSize;\n  mediump vec4 cc_nativeSize;\n};\nlayout(std140) uniform CCCamera {\n  highp   mat4 cc_matView;\n  highp   mat4 cc_matViewInv;\n  highp   mat4 cc_matProj;\n  highp   mat4 cc_matProjInv;\n  highp   mat4 cc_matViewProj;\n  highp   mat4 cc_matViewProjInv;\n  highp   vec4 cc_cameraPos;\n  mediump vec4 cc_screenScale;\n  mediump vec4 cc_exposure;\n  mediump vec4 cc_mainLitDir;\n  mediump vec4 cc_mainLitColor;\n  mediump vec4 cc_ambientSky;\n  mediump vec4 cc_ambientGround;\n  mediump vec4 cc_fogColor;\n  mediump vec4 cc_fogBase;\n  mediump vec4 cc_fogAdd;\n  mediump vec4 cc_nearFar;\n  mediump vec4 cc_viewPort;\n};\nlayout(std140) uniform Constant {\n  vec4 viewParams;\n  vec2 lookatPoint;\n};\nfloat sdf_union(float a, float b) {\n  return min(a, b);\n}\nfloat sdf_intersect(float a, float b) {\n  return max(a, b);\n}\nvec4 frag () {\n  vec2  uv = gl_FragCoord.xy * cc_screenSize.zw;\n  float dx = abs(uv.x - 0.5) * 2.;\n  float dy = abs(uv.y - 0.5) * 2.;\n  float dpx = abs(uv.x - lookatPoint.x) * 2.;\n  float dpy = abs(uv.y - lookatPoint.y) * 2.;\n  float softZoneWidth = max(viewParams.x, viewParams.z);\n  float softZoneHeight = max(viewParams.y, viewParams.w);\n  float deadZone = sdf_intersect(step(viewParams.x, dx), step(viewParams.y, dy));\n  float softZone = sdf_intersect(step(softZoneWidth, dx), step(softZoneHeight, dy));\n  float deadZoneLine0 = sdf_intersect(1. - step(viewParams.x, dx), step(viewParams.x + 7. * cc_screenSize.z, dx));\n  float deadZoneLine1 = sdf_intersect(1. - step(viewParams.y, dy), step(viewParams.y + 7. * cc_screenSize.w, dy));\n  float softZoneLine0 = sdf_intersect(1. - step(softZoneWidth, dx), step(softZoneWidth + 7. * cc_screenSize.z, dx));\n  float softZoneLine1 = sdf_intersect(1. - step(softZoneHeight, dy), step(softZoneHeight + 7. * cc_screenSize.w, dy));\n  vec4  color = vec4(1,0,0,0.15);\n  color = mix(vec4(0,0.7,1,0.15), color, softZone);\n  color = mix(vec4(0), color, deadZone);\n  color = mix(vec4(0,0.7,1,0.3), color, sdf_union(deadZoneLine0, deadZoneLine1));\n  color = mix(vec4(1,0,0,0.3), color, sdf_union(softZoneLine0, softZoneLine1));\n  color = mix(vec4(1,1,0,1), color, sdf_intersect(step(10. * cc_screenSize.z, dpx), step(10. * cc_screenSize.z, dpy * cc_screenSize.y/cc_screenSize.x)));\n  return color;\n}\nlayout(location = 0) out vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }"},"glsl1":{"vert":"\nprecision highp float;\nhighp float decode32 (highp vec4 rgba) {\n  rgba = rgba * 255.0;\n  highp float Sign = 1.0 - (step(128.0, (rgba[3]) + 0.5)) * 2.0;\n  highp float Exponent = 2.0 * (mod(float(int((rgba[3]) + 0.5)), 128.0)) + (step(128.0, (rgba[2]) + 0.5)) - 127.0;\n  highp float Mantissa = (mod(float(int((rgba[2]) + 0.5)), 128.0)) * 65536.0 + rgba[1] * 256.0 + rgba[0] + 8388608.0;\n  return Sign * exp2(Exponent - 23.0) * Mantissa;\n}\nstruct StandardVertInput {\n  highp vec4 position;\n  vec3 normal;\n  vec4 tangent;\n};\nattribute vec3 a_position;\nattribute vec3 a_normal;\nattribute vec2 a_texCoord;\nattribute vec4 a_tangent;\n#if CC_USE_MORPH\n    attribute float a_vertexId;\n    int getVertexId() {\n      return int(a_vertexId);\n    }\n  uniform vec4 cc_displacementWeights[15];\n  uniform vec4 cc_displacementTextureInfo;\n  vec2 getPixelLocation(vec2 textureResolution, int pixelIndex) {\n    float pixelIndexF = float(pixelIndex);\n    float x = mod(pixelIndexF, textureResolution.x);\n    float y = floor(pixelIndexF / textureResolution.x);\n    return vec2(x, y);\n  }\n  vec2 getPixelCoordFromLocation(vec2 location, vec2 textureResolution) {\n    return (vec2(location.x, location.y) + .5) / textureResolution;\n  }\n  #if CC_DEVICE_SUPPORT_FLOAT_TEXTURE\n      vec4 fetchVec3ArrayFromTexture(sampler2D tex, int elementIndex) {\n        int pixelIndex = elementIndex;\n        vec2 location = getPixelLocation(cc_displacementTextureInfo.xy, pixelIndex);\n        vec2 uv = getPixelCoordFromLocation(location, cc_displacementTextureInfo.xy);\n        return texture2D(tex, uv);\n      }\n  #else\n    vec4 fetchVec3ArrayFromTexture(sampler2D tex, int elementIndex) {\n      int pixelIndex = elementIndex * 4;\n      vec2 location = getPixelLocation(cc_displacementTextureInfo.xy, pixelIndex);\n      vec2 x = getPixelCoordFromLocation(location + vec2(0.0, 0.0), cc_displacementTextureInfo.xy);\n      vec2 y = getPixelCoordFromLocation(location + vec2(1.0, 0.0), cc_displacementTextureInfo.xy);\n      vec2 z = getPixelCoordFromLocation(location + vec2(2.0, 0.0), cc_displacementTextureInfo.xy);\n      return vec4(\n        decode32(texture2D(tex, x)),\n        decode32(texture2D(tex, y)),\n        decode32(texture2D(tex, z)),\n        1.0\n      );\n    }\n  #endif\n  float getDisplacementWeight(int index) {\n    int quot = index / 4;\n    int remainder = index - quot * 4;\n    if (remainder == 0) {\n      return cc_displacementWeights[quot].x;\n    } else if (remainder == 1) {\n      return cc_displacementWeights[quot].y;\n    } else if (remainder == 2) {\n      return cc_displacementWeights[quot].z;\n    } else {\n      return cc_displacementWeights[quot].w;\n    }\n  }\n  vec3 getVec3DisplacementFromTexture(sampler2D tex, int vertexIndex) {\n  #if CC_MORPH_PRECOMPUTED\n    return fetchVec3ArrayFromTexture(tex, vertexIndex).rgb;\n  #else\n    vec3 result = vec3(0, 0, 0);\n    int nVertices = int(cc_displacementTextureInfo.z);\n    for (int iTarget = 0; iTarget < CC_MORPH_TARGET_COUNT; ++iTarget) {\n      result += (fetchVec3ArrayFromTexture(tex, nVertices * iTarget + vertexIndex).rgb * getDisplacementWeight(iTarget));\n    }\n    return result;\n  #endif\n  }\n  #if CC_MORPH_TARGET_HAS_POSITION\n    uniform sampler2D cc_PositionDisplacements;\n    vec3 getPositionDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_PositionDisplacements, vertexId);\n    }\n  #endif\n  #if CC_MORPH_TARGET_HAS_NORMAL\n    uniform sampler2D cc_NormalDisplacements;\n    vec3 getNormalDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_NormalDisplacements, vertexId);\n    }\n  #endif\n  #if CC_MORPH_TARGET_HAS_TANGENT\n    uniform sampler2D cc_TangentDisplacements;\n    vec3 getTangentDisplacement(int vertexId) {\n      return getVec3DisplacementFromTexture(cc_TangentDisplacements, vertexId);\n    }\n  #endif\n  void applyMorph (inout StandardVertInput attr) {\n    int vertexId = getVertexId();\n  #if CC_MORPH_TARGET_HAS_POSITION\n    attr.position.xyz = attr.position.xyz + getPositionDisplacement(vertexId);\n  #endif\n  #if CC_MORPH_TARGET_HAS_NORMAL\n    attr.normal.xyz = attr.normal.xyz + getNormalDisplacement(vertexId);\n  #endif\n  #if CC_MORPH_TARGET_HAS_TANGENT\n    attr.tangent.xyz = attr.tangent.xyz + getTangentDisplacement(vertexId);\n  #endif\n  }\n  void applyMorph (inout vec4 position) {\n  #if CC_MORPH_TARGET_HAS_POSITION\n    position.xyz = position.xyz + getPositionDisplacement(getVertexId());\n  #endif\n  }\n#endif\n#if CC_USE_SKINNING\n    attribute vec4 a_joints;\n  attribute vec4 a_weights;\n  #if CC_USE_BAKED_ANIMATION\n    #if USE_INSTANCING\n      attribute highp vec4 a_jointAnimInfo;\n    #endif\n    uniform highp vec4 cc_jointTextureInfo;\n    uniform highp vec4 cc_jointAnimInfo;\n    uniform highp sampler2D cc_jointTexture;\n      #else\n    uniform highp vec4 cc_joints[90];\n  #endif\n  #if CC_USE_BAKED_ANIMATION\n    #if CC_DEVICE_SUPPORT_FLOAT_TEXTURE\n      mat4 getJointMatrix (float i) {\n              #if USE_INSTANCING\n                highp float j = 3.0 * (a_jointAnimInfo.x * a_jointAnimInfo.y + i) + a_jointAnimInfo.z;\n              #else\n                highp float j = 3.0 * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + i) + cc_jointTextureInfo.z;\n              #endif\n              highp float invSize = cc_jointTextureInfo.w;\n              highp float y = floor(j * invSize);\n              highp float x = floor(j - y * cc_jointTextureInfo.x);\n              y = (y + 0.5) * invSize;\n        vec4 v1 = texture2D(cc_jointTexture, vec2((x + 0.5) * invSize, y));\n        vec4 v2 = texture2D(cc_jointTexture, vec2((x + 1.5) * invSize, y));\n        vec4 v3 = texture2D(cc_jointTexture, vec2((x + 2.5) * invSize, y));\n        return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n      }\n    #else\n      mat4 getJointMatrix (float i) {\n              #if USE_INSTANCING\n                highp float j = 12.0 * (a_jointAnimInfo.x * a_jointAnimInfo.y + i) + a_jointAnimInfo.z;\n              #else\n                highp float j = 12.0 * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + i) + cc_jointTextureInfo.z;\n              #endif\n              highp float invSize = cc_jointTextureInfo.w;\n              highp float y = floor(j * invSize);\n              highp float x = floor(j - y * cc_jointTextureInfo.x);\n              y = (y + 0.5) * invSize;\n        vec4 v1 = vec4(\n          decode32(texture2D(cc_jointTexture, vec2((x + 0.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 1.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 2.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 3.5) * invSize, y)))\n        );\n        vec4 v2 = vec4(\n          decode32(texture2D(cc_jointTexture, vec2((x + 4.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 5.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 6.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 7.5) * invSize, y)))\n        );\n        vec4 v3 = vec4(\n          decode32(texture2D(cc_jointTexture, vec2((x + 8.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 9.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 10.5) * invSize, y))),\n          decode32(texture2D(cc_jointTexture, vec2((x + 11.5) * invSize, y)))\n        );\n        return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n      }\n    #endif\n  #else\n    mat4 getJointMatrix (float i) {\n      int idx = int(i);\n      vec4 v1 = cc_joints[idx * 3];\n      vec4 v2 = cc_joints[idx * 3 + 1];\n      vec4 v3 = cc_joints[idx * 3 + 2];\n      return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));\n    }\n  #endif\n  mat4 skinMatrix () {\n    vec4 joints = vec4(a_joints);\n    return getJointMatrix(joints.x) * a_weights.x\n         + getJointMatrix(joints.y) * a_weights.y\n         + getJointMatrix(joints.z) * a_weights.z\n         + getJointMatrix(joints.w) * a_weights.w;\n  }\n  void CCSkin (inout vec4 position) {\n    mat4 m = skinMatrix();\n    position = m * position;\n  }\n  void CCSkin (inout StandardVertInput attr) {\n    mat4 m = skinMatrix();\n    attr.position = m * attr.position;\n    attr.normal = (m * vec4(attr.normal, 0.0)).xyz;\n    attr.tangent.xyz = (m * vec4(attr.tangent.xyz, 0.0)).xyz;\n  }\n#endif\n#if USE_INSTANCING\n  attribute vec4 a_matWorld0;\n  attribute vec4 a_matWorld1;\n  attribute vec4 a_matWorld2;\n  #if USE_LIGHTMAP\n    attribute vec4 a_lightingMapUVParam;\n  #endif\n#elif USE_BATCHING\n  attribute float a_dyn_batch_id;\n  #else\n  #endif\nvec4 vert() {\n  vec4 position;\n      position = vec4(a_position, 1.0);\n    #if CC_USE_MORPH\n      applyMorph(position);\n    #endif\n    #if CC_USE_SKINNING\n      CCSkin(position);\n    #endif\n  return vec4(position.xyz * 2., 1.0);\n}\nvoid main() { gl_Position = vert(); }","frag":"\nprecision highp float;\nuniform mediump vec4 cc_screenSize;\nuniform vec4 viewParams;\n           uniform vec2 lookatPoint;\nfloat sdf_union(float a, float b) {\n  return min(a, b);\n}\nfloat sdf_intersect(float a, float b) {\n  return max(a, b);\n}\nvec4 frag () {\n  vec2  uv = gl_FragCoord.xy * cc_screenSize.zw;\n  float dx = abs(uv.x - 0.5) * 2.;\n  float dy = abs(uv.y - 0.5) * 2.;\n  float dpx = abs(uv.x - lookatPoint.x) * 2.;\n  float dpy = abs(uv.y - lookatPoint.y) * 2.;\n  float softZoneWidth = max(viewParams.x, viewParams.z);\n  float softZoneHeight = max(viewParams.y, viewParams.w);\n  float deadZone = sdf_intersect(step(viewParams.x, dx), step(viewParams.y, dy));\n  float softZone = sdf_intersect(step(softZoneWidth, dx), step(softZoneHeight, dy));\n  float deadZoneLine0 = sdf_intersect(1. - step(viewParams.x, dx), step(viewParams.x + 7. * cc_screenSize.z, dx));\n  float deadZoneLine1 = sdf_intersect(1. - step(viewParams.y, dy), step(viewParams.y + 7. * cc_screenSize.w, dy));\n  float softZoneLine0 = sdf_intersect(1. - step(softZoneWidth, dx), step(softZoneWidth + 7. * cc_screenSize.z, dx));\n  float softZoneLine1 = sdf_intersect(1. - step(softZoneHeight, dy), step(softZoneHeight + 7. * cc_screenSize.w, dy));\n  vec4  color = vec4(1,0,0,0.15);\n  color = mix(vec4(0,0.7,1,0.15), color, softZone);\n  color = mix(vec4(0), color, deadZone);\n  color = mix(vec4(0,0.7,1,0.3), color, sdf_union(deadZoneLine0, deadZoneLine1));\n  color = mix(vec4(1,0,0,0.3), color, sdf_union(softZoneLine0, softZoneLine1));\n  color = mix(vec4(1,1,0,1), color, sdf_intersect(step(10. * cc_screenSize.z, dpx), step(10. * cc_screenSize.z, dpy * cc_screenSize.y/cc_screenSize.x)));\n  return color;\n}\nvoid main() { gl_FragColor = frag(); }"},"builtins":{"globals":{"blocks":[{"name":"CCGlobal","defines":[]},{"name":"CCCamera","defines":[]}],"samplerTextures":[],"buffers":[],"images":[]},"locals":{"blocks":[{"name":"CCMorph","defines":["CC_USE_MORPH"]},{"name":"CCSkinningTexture","defines":["CC_USE_SKINNING","CC_USE_BAKED_ANIMATION"]},{"name":"CCSkinningAnimation","defines":["CC_USE_SKINNING","CC_USE_BAKED_ANIMATION"]},{"name":"CCSkinning","defines":["CC_USE_SKINNING","!CC_USE_BAKED_ANIMATION"]},{"name":"CCLocalBatched","defines":["!USE_INSTANCING","USE_BATCHING"]},{"name":"CCLocal","defines":["!USE_INSTANCING","!USE_BATCHING"]}],"samplerTextures":[{"name":"cc_PositionDisplacements","defines":["CC_USE_MORPH","CC_MORPH_TARGET_HAS_POSITION"]},{"name":"cc_NormalDisplacements","defines":["CC_USE_MORPH","CC_MORPH_TARGET_HAS_NORMAL"]},{"name":"cc_TangentDisplacements","defines":["CC_USE_MORPH","CC_MORPH_TARGET_HAS_TANGENT"]},{"name":"cc_jointTexture","defines":["CC_USE_SKINNING","CC_USE_BAKED_ANIMATION"]}],"buffers":[],"images":[]},"statistics":{"CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS":157,"CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS":41}},"defines":[{"name":"CC_USE_MORPH","type":"boolean","defines":[],"_offset":0},{"name":"CC_MORPH_TARGET_COUNT","type":"number","defines":["CC_USE_MORPH"],"range":[2,8],"_offset":1},{"name":"CC_MORPH_PRECOMPUTED","type":"boolean","defines":["CC_USE_MORPH"],"_offset":4},{"name":"CC_MORPH_TARGET_HAS_POSITION","type":"boolean","defines":["CC_USE_MORPH"],"_offset":5},{"name":"CC_MORPH_TARGET_HAS_NORMAL","type":"boolean","defines":["CC_USE_MORPH"],"_offset":6},{"name":"CC_MORPH_TARGET_HAS_TANGENT","type":"boolean","defines":["CC_USE_MORPH"],"_offset":7},{"name":"CC_USE_SKINNING","type":"boolean","defines":[],"_offset":8},{"name":"CC_USE_BAKED_ANIMATION","type":"boolean","defines":["CC_USE_SKINNING"],"_offset":9},{"name":"USE_INSTANCING","type":"boolean","defines":[],"editor":{"elevated":true},"_offset":10},{"name":"USE_BATCHING","type":"boolean","defines":["!USE_INSTANCING"],"editor":{"elevated":true},"_offset":11},{"name":"USE_LIGHTMAP","type":"boolean","defines":["USE_INSTANCING"],"_offset":12}],"name":"../cinestation/examples/art/Shaders/View|view-vs:vert|view-fs:frag"}]
}