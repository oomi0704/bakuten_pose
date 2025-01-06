
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

function CalcKneeAngle(keypoints) {
    const hip = keypoints[11];
    const knee = keypoints[13];
    const ankle = keypoints[15];
  
    if (CalcAngle(hip, knee, ankle) <= 90) {
        return "しゃがみすぎ" + CalcAngle(hip, knee, ankle);
    } else {
        return CalcAngle(hip, knee, ankle);
    }
}

function CalcBodyAngle(keypoints) {
  const shoulder = keypoints[5];
  const hip = keypoints[11];
  const knee = keypoints[13];
  
  
  return CalcAngle(shoulder, hip, knee);
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
        console.log(poses[0].keypoints);
       
        document.getElementById('knee-stand-score').innerHTML = CalcKneeAngle(poses[0].keypoints);
        document.getElementById('body-stand-score').innerHTML = CalcBodyAngle(poses[0].keypoints);
        drawKeypoints(ctx_stand, poses[0].keypoints);
        drawSkeleton(ctx_stand, poses[0].keypoints);
    });
  });

  poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).then(detector => {

    detector.estimatePoses(imageElement_fly).then(poses => {
      console.log(poses[0].keypoints);

      document.getElementById('knee-fly-score').innerHTML = CalcKneeAngle(poses[0].keypoints);
      document.getElementById('body-fly-score').innerHTML = CalcBodyAngle(poses[0].keypoints);
      drawKeypoints(ctx_fly, poses[0].keypoints);
      drawSkeleton(ctx_fly, poses[0].keypoints);
    });
  });

  poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).then(detector => {

    detector.estimatePoses(imageElement_land).then(poses => {
      console.log(poses[0].keypoints);

      document.getElementById('knee-land-score').innerHTML = CalcKneeAngle(poses[0].keypoints);
      document.getElementById('body-land-score').innerHTML = CalcBodyAngle(poses[0].keypoints);
      drawKeypoints(ctx_land, poses[0].keypoints);
      drawSkeleton(ctx_land, poses[0].keypoints);
    });
  });
}