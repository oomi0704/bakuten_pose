let keypoints_stand;
let keypoints_fly;
let keypoints_land;


function drawKeypoints(ctx, keypoints) {
    const keypointInd = poseDetection.util.getKeypointIndexBySide(poseDetection.SupportedModels.MoveNet);
    ctx.fillStyle = 'Red';
    ctx.strokeStyle = 'White';
    ctx.lineWidth = 1;
    for (const i of keypointInd.middle) {
        drawKeypoint(ctx, keypoints[i]);
    }
    ctx.fillStyle = 'Green';
    for (const i of keypointInd.left) {
        drawKeypoint(ctx, keypoints[i]);
    }
    ctx.fillStyle = 'Orange';
    for (const i of keypointInd.right) {
        drawKeypoint(ctx, keypoints[i]);
    }
}

function drawKeypoint(ctx, keypoints) {
    const circle = new Path2D();
    circle.arc(keypoints.x, keypoints.y, 6, 0, 2 * Math.PI);
    ctx.fill(circle);
    ctx.stroke(circle);
}


function drawSkeleton(ctx, keypoints) {
    ctx.fillStyle = 'White';
    ctx.strokeStyle = 'White';
    ctx.lineWidth = 1;
    poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet).forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];

            ctx.beginPath();
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
            ctx.stroke();
    });
}

function CalcFootPosition(keypoints_stand , keypoints_fly) {
    const foot_stand = keypoints_stand[15];
    const foot_fly = keypoints_fly[15];
    const foot_position = foot_stand.x - foot_fly.x;
    if (foot_position < 0) {
      return  "飛ぶ前に前に動いています";
    } else {
      return  "⚪︎";
    }
}

function CalcKneePosition(keypoints_stand , keypoints_fly) {
  const knee_stand = keypoints_stand[13];
  const knee_fly = keypoints_fly[13];
  const knee_position = knee_fly.x - knee_stand.x;
  if (knee_position < 0) {
    return  "膝が前に抜けています";
  } else {
    return "⚪︎";
  }
}

function CalcKneeAngle(keypoints) {
    const hip = keypoints[11];
    const knee = keypoints[13];
    const ankle = keypoints[15];
  
    if (CalcAngle(hip, knee, ankle) <= 50) {
        return CalcAngle(hip, knee, ankle) + "しゃがみすぎです";
    } else {
        return CalcAngle(hip, knee, ankle) + "度⚪︎";
    }
}


function CalcKneeBendAngle(keypoints) {
  const hip = keypoints[11];
  const knee = keypoints[13];
  const ankle = keypoints[15];

  if (CalcAngle(hip, knee, ankle) < 140) {
      return CalcAngle(hip, knee, ankle) + "膝が曲がっています";
  } else {
      return CalcAngle(hip, knee, ankle) + "度⚪︎";
  }
}

function CalcBodyAngle(keypoints) {
  const shoulder = keypoints[5];
  const hip = keypoints[11];
  const knee = keypoints[13];
  
  const angle = CalcAngle(shoulder, hip, knee);

  if (60 <= angle && angle <= 100) {
    return angle + "度⚪︎";
  } else if (angle < 60) {
    return angle + "度　体を前に倒しすぎです";
  } else if (angle > 100) {
    return angle + "度　体を後ろに倒しすぎです";
  }
}

function BodyDistortion(keypoints) {
  const shoulderDistortionY = Math.abs(keypoints[5].y - keypoints[6].y);
  const elbowDistortionY = Math.abs(keypoints[7].y - keypoints[8].y);
  const wristDistortionY = Math.abs(keypoints[9].y - keypoints[10].y);
  const hipDistortionY = Math.abs(keypoints[11].y - keypoints[12].y);
  const kneeDistortionY = Math.abs(keypoints[13].y - keypoints[14].y);
  const ankleDistortionY = Math.abs(keypoints[15].y - keypoints[16].y);

  const shoulderDistortionX = Math.abs(keypoints[5].x - keypoints[6].x);
  const elbowDistortionX = Math.abs(keypoints[7].x - keypoints[8].x);
  const wristDistortionX = Math.abs(keypoints[9].x - keypoints[10].x);
  const hipDistortionX = Math.abs(keypoints[11].x - keypoints[12].x);
  const kneeDistortionX = Math.abs(keypoints[13].x - keypoints[14].x);
  const ankleDistortionX = Math.abs(keypoints[15].x - keypoints[16].x);

  let result = "";

  if (shoulderDistortionY > 10 && shoulderDistortionX > 10) {
    result += "肩が歪んでいます\n";
  } else {
    result += "肩: ⚪︎\n";
  }

  if (elbowDistortionY > 10 && elbowDistortionX > 10) {
    result += "肘が歪んでいます\n";
  } else {
    result += "肘: ⚪︎\n";
  }

  if (wristDistortionY > 10 && wristDistortionX > 10) {
    result += "手首が歪んでいます\n";
  } else {
    result += "手首: ⚪︎\n";
  }

  if (hipDistortionY > 10 && hipDistortionX > 10) {
    result += "腰が歪んでいます\n";
  } else {
    result += "腰: ⚪︎\n";
  }

  if (kneeDistortionY > 10 && kneeDistortionX > 10) {
    result += "膝が歪んでいます\n";
  } else {
    result += "膝: ⚪︎\n";
  }

  if (ankleDistortionY > 10 && ankleDistortionX > 10) {
    result += "足首が歪んでいます\n";
  } else {
    result += "足首: ⚪︎\n";
  }

  return result.trim(); // 結果を返す
}

function CalcHipHeight(keypoint_stand, keypoint_fly) {
  const ankle_stand = keypoint_stand[15];
  const hip_stand = keypoint_stand[11];
  const hip_fly = keypoint_fly[11];
  const hip_height = ankle_stand.y - hip_fly.y;
  const hip_positon = hip_fly.x - hip_stand.x;
  

  let result = "";

  if (hip_height > 100) {
    result += "腰の高さ: ⚪︎\n";
  } else {
    result += "腰の高さが低いです\n";
  }

  if (hip_positon > 0) {
    result += "腰の体重移動: ⚪︎\n";
  } else {
    result += "真上に飛びすぎです\n";
  }

  return result.trim(); // 結果を返す
}

function isArmVectorDownward(keypoints) {
  const shoulder = keypoints[5]; // 肩のキーポイント
  const wrist = keypoints[9];    // 手首のキーポイント

  // 手首のy座標が肩のy座標より大きい場合、ベクトルは下向き
  if (wrist.y > shoulder.y) {
    return "⚪︎";
  } else {
    return "腕の振りが遅いです";
  }
}

function CalcTouchPosition(keypoints_land) {
  const shoulder_land = keypoints_land[5];
  const hip_land = keypoints_land[11];
  const touch_position = shoulder_land.x - hip_land.x;
  console.log(touch_position);

  if (touch_position >= -10 && touch_position <= 10) {
    return  "⚪︎";
  } else {
    return  " 着手時に肩と腰が一直線上になっていません";
  }
}

function CalcEyePosition(keypoints_land) {
  const eye_land = keypoints_land[1];
  const shoulder_land = keypoints_land[5];
  const touch_position = eye_land.x - shoulder_land.x;

  if (touch_position < 0) {
    return "⚪︎";
  } else {
    return "顎を上げるまたは、手と手の間を見ましょう";
  }
} 

function CalcAngle(start, mid, end) {
    // ベクトルの計算
    const vector1 = { x: start.x - mid.x, y: start.y - mid.y };
    const vector2 = { x: end.x - mid.x, y: end.y - mid.y };

    // 内積の計算
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;

    // ベクトルの大きさの計算
    const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
    const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);

    // コサインθの計算
    const cosTheta = dotProduct / (magnitude1 * magnitude2);

    // 角度θをラジアンで計算
    const angleRadians = Math.acos(cosTheta);

    // ラジアンを度に変換
    const angleDegrees = angleRadians * (180 / Math.PI);

    return Math.floor(angleDegrees);
}

function startPoseDetection() {
  const imageElement_stand = document.getElementById('img_stand');
  const canvas_stand = document.getElementById('canvas_stand');
  const ctx_stand = canvas_stand.getContext('2d');

  const imageElement_fly = document.getElementById('img_fly');
  const canvas_fly = document.getElementById('canvas_fly');
  const ctx_fly = canvas_fly.getContext('2d');

  const imageElement_land = document.getElementById('img_land');
  const canvas_land = document.getElementById('canvas_land');
  const ctx_land = canvas_land.getContext('2d');


  canvas_stand.width = imageElement_stand.clientWidth;
  canvas_stand.height = imageElement_stand.clientHeight;

  canvas_fly.width = imageElement_fly.clientWidth;
  canvas_fly.height = imageElement_fly.clientHeight;

  canvas_land.width = imageElement_land.clientWidth;
  canvas_land.height = imageElement_land.clientHeight;

  ctx_stand.drawImage(imageElement_stand, 0, 0, canvas_stand.width, canvas_stand.height);
  ctx_fly.drawImage(imageElement_fly, 0, 0, canvas_fly.width, canvas_fly.height);
  ctx_land.drawImage(imageElement_land, 0, 0, canvas_land.width, canvas_land.height);






  poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).then(detector => {
 
    detector.estimatePoses(imageElement_stand).then(poses => {
      
        keypoints_stand = poses[0].keypoints;
        console.log(keypoints_stand); //
        document.getElementById('knee-stand-score').innerHTML = CalcKneeAngle(poses[0].keypoints);
        document.getElementById('upper-body-stand-score').innerHTML = CalcBodyAngle(poses[0].keypoints);
        document.getElementById('body-stand-score').innerHTML = BodyDistortion(keypoints_stand);
        drawKeypoints(ctx_stand, poses[0].keypoints);
        drawSkeleton(ctx_stand, poses[0].keypoints);
        
    });
  });

  poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).then(detector => {

    detector.estimatePoses(imageElement_fly).then(poses => {
      keypoints_fly = poses[0].keypoints;
    
      drawKeypoints(ctx_fly, poses[0].keypoints);
      drawSkeleton(ctx_fly, poses[0].keypoints);
      document.getElementById('foot-fly-score').innerHTML = CalcFootPosition(keypoints_stand, keypoints_fly);
      document.getElementById('knee-spread-fly-score').innerHTML = CalcKneePosition(keypoints_stand, keypoints_fly);
      document.getElementById('knee-bend-fly-score').innerHTML = CalcKneeBendAngle(poses[0].keypoints);
      document.getElementById('body-fly-score').innerHTML = BodyDistortion(keypoints_fly);
      document.getElementById('hip-height-fly-score').innerHTML = "腰";
      document.getElementById('arm-swing-fly-score').innerHTML = isArmVectorDownward(poses[0].keypoints);
      document.getElementById('hip-height-fly-score').innerHTML = CalcHipHeight(keypoints_stand, keypoints_fly);
    });
  });

  poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).then(detector => {

    detector.estimatePoses(imageElement_land).then(poses => {
      keypoints_land = poses[0].keypoints;

      document.getElementById('knee-bend-land-score').innerHTML = CalcKneeBendAngle(poses[0].keypoints);
      document.getElementById('body-land-score').innerHTML = CalcBodyAngle(poses[0].keypoints);
      document.getElementById('body-land-score').innerHTML = BodyDistortion(keypoints_land);
      document.getElementById('touch-land-score').innerHTML = CalcTouchPosition(poses[0].keypoints);
      document.getElementById('eye-land-score').innerHTML = CalcEyePosition(poses[0].keypoints);
      drawKeypoints(ctx_land, poses[0].keypoints);
      drawSkeleton(ctx_land, poses[0].keypoints);
    });
  });

}