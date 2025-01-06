const keypointIds = ['nose', 'left-eye', 'right-eye', 'left-ear', 'right-ear',
    'left-shoulder', 'right-shoulder', 'left-elbow', 'right-elbow',
    'left-wrist', 'right-wirst', 'left-hip', 'right-hip',
   'left-knee', 'right-knee', 'left-ankle', 'right-ankle']
    

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
  
    return CalcAngle(hip, knee, ankle);
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
  const imageElement = document.getElementById('img');
  const canvas = document.getElementById('canvas');

  const ctx = canvas.getContext('2d');

  canvas.width = imageElement.clientWidth;
  canvas.height = imageElement.clientHeight;

  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

  poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).then(detector => {
    detector.estimatePoses(imageElement).then(poses => {
      console.log(poses[0].keypoints);
      console.log(CalcKneeAngle(poses[0].keypoints));

      keypointIds.forEach(function(item, index) {
        const keypoint = poses[0].keypoints[index];

        document.getElementById(item + '-score').innerHTML = Math.floor(keypoint.score * 100);
        document.getElementById(item + '-x').innerHTML = Math.floor(keypoint.x);
        document.getElementById(item + '-y').innerHTML = Math.floor(keypoint.y);
        document.getElementById('knee-angle-score').innerHTML = CalcKneeAngle(poses[0].keypoints);

        drawKeypoints(ctx, poses[0].keypoints);
        drawSkeleton(ctx, poses[0].keypoints);
      });
    });
  });
}