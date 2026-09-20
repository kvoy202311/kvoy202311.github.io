;(function () {
  'use strict';

  var STORAGE_KEY = 'aboutme.imageCrops.v1';
  var LEGACY_AVATAR_KEY = 'aboutme.avatarCrop.v1';
  var MIN_SCALE = 1;
  var MAX_SCALE = 3;
  var SCALE_STEP = 0.05;

  var TARGETS = {
    avatar: {
      label: '顶部圆形头像',
      selector: '.nav .nav-logo img',
      image: 'kvoy_images/1.png',
      defaultState: { x: -0.83, y: -5.38, scale: 1.2 },
      aspect: 1,
      circle: true,
      stageWidth: 330,
      positionX: 0.5,
      positionY: 0.5,
      largePreviewWidth: 96,
      actualPreviewWidth: 48,
      actualLabel: '主页尺寸 48 × 48',
      hint: '圆形取景框与主页顶部头像一致。',
      description: '圆形区域之外的内容不会在主页头像中显示。',
      outputWidth: 512,
      outputHeight: 512,
      downloadName: 'avatar-cropped.png',
      hash: 'hero'
    },
    about: {
      label: '关于本人照片',
      selector: '.about-photo img',
      image: 'kvoy_images/2.JPG',
      defaultState: { x: 0, y: 0, scale: 1 },
      aspect: 2 / 3,
      circle: false,
      stageWidth: 260,
      positionX: 0.5,
      positionY: 0.5,
      largePreviewWidth: 100,
      actualPreviewWidth: 64,
      actualLabel: '主页比例 280 × 420',
      hint: '竖向 2:3 取景框与主页“关于本人”照片一致。',
      description: '预览使用主页照片的 2:3 竖向比例。',
      outputWidth: 800,
      outputHeight: 1200,
      downloadName: 'about-photo-cropped.png',
      hash: 'about'
    },
    perception: {
      label: 'ELF3 人形 AMP 视觉越障',
      selector: '.work-img--perception img',
      image: 'kvoy_images/perception2.PNG',
      defaultState: { x: 0, y: 0, scale: 1 },
      aspect: 38 / 27,
      circle: false,
      stageWidth: 500,
      positionX: 0.5,
      positionY: 0.38,
      largePreviewWidth: 220,
      actualPreviewWidth: 152,
      actualLabel: '主页卡片比例 304 × 216',
      hint: '横向取景框按照桌面端项目卡片的实际比例显示。',
      description: '预览与主页项目卡片采用相同的横向比例和图片定位。',
      outputWidth: 1216,
      outputHeight: 864,
      downloadName: 'perception-cropped.png',
      hash: 'works'
    },
    '12dof': {
      label: '12DOF 串联四足',
      selector: '.work-img--12dof img',
      image: 'kvoy_images/12dof.jpg',
      defaultState: { x: 0, y: -10, scale: 1.2 },
      aspect: 38 / 27,
      circle: false,
      stageWidth: 500,
      positionX: 0.5,
      positionY: 1,
      largePreviewWidth: 220,
      actualPreviewWidth: 152,
      actualLabel: '主页卡片比例 304 × 216',
      hint: '已等效保留原来的放大和底部对齐取景，可继续微调。',
      description: '预览与主页项目卡片采用相同的横向比例和底部定位。',
      outputWidth: 1216,
      outputHeight: 864,
      downloadName: '12dof-cropped.png',
      hash: 'works'
    },
    '8dof': {
      label: '8DOF 并联四足',
      selector: '.work-img--8dof img',
      image: 'kvoy_images/8dof.JPG',
      defaultState: { x: 0, y: -3, scale: 2 },
      aspect: 38 / 27,
      circle: false,
      stageWidth: 500,
      positionX: 0.5,
      positionY: 0.53,
      largePreviewWidth: 220,
      actualPreviewWidth: 152,
      actualLabel: '主页卡片比例 304 × 216',
      hint: '使用完整原图取景，并默认放大到 2 倍突出中间的四足机器人。',
      description: '预览与主页项目卡片采用相同的横向比例和图片定位。',
      outputWidth: 1216,
      outputHeight: 864,
      downloadName: '8dof-cropped.png',
      hash: 'works'
    },
    arm: {
      label: '双臂 14DOF 机械臂',
      selector: '.work-img--arm img',
      image: 'kvoy_images/arm3.PNG',
      defaultState: { x: 0, y: 0, scale: 1 },
      aspect: 38 / 27,
      circle: false,
      stageWidth: 500,
      positionX: 0.5,
      positionY: 0.5,
      largePreviewWidth: 220,
      actualPreviewWidth: 152,
      actualLabel: '主页卡片比例 304 × 216',
      hint: '横向取景框按照桌面端项目卡片的实际比例显示。',
      description: '预览与主页项目卡片采用相同的横向比例和图片定位。',
      outputWidth: 1216,
      outputHeight: 864,
      downloadName: 'arm-cropped.png',
      hash: 'works'
    }
  };

  var targetSelect = document.getElementById('crop-target');
  var targetHint = document.getElementById('target-hint');
  var editorDescription = document.getElementById('editor-description');
  var previewDescription = document.getElementById('preview-description');
  var stage = document.getElementById('crop-stage');
  var cropImage = document.getElementById('crop-image');
  var previewImages = Array.prototype.slice.call(document.querySelectorAll('.preview-image'));
  var previewLarge = document.getElementById('preview-large');
  var previewActual = document.getElementById('preview-actual');
  var previewLargeLabel = document.getElementById('preview-large-label');
  var previewActualLabel = document.getElementById('preview-actual-label');
  var fileInput = document.getElementById('image-file');
  var fileName = document.getElementById('file-name');
  var zoomRange = document.getElementById('zoom-range');
  var zoomValue = document.getElementById('zoom-value');
  var xValue = document.getElementById('x-value');
  var yValue = document.getElementById('y-value');
  var cssOutput = document.getElementById('css-output');
  var zoomOutButton = document.getElementById('zoom-out');
  var zoomInButton = document.getElementById('zoom-in');
  var centerButton = document.getElementById('center-button');
  var resetButton = document.getElementById('reset-button');
  var copyButton = document.getElementById('copy-button');
  var applyButton = document.getElementById('apply-button');
  var exportButton = document.getElementById('export-button');
  var clearButton = document.getElementById('clear-button');
  var statusMessage = document.getElementById('status-message');

  if (!targetSelect || !stage || !cropImage || !zoomRange || !cssOutput) return;

  var savedStates = loadSavedStates();
  var workingStates = {};
  Object.keys(TARGETS).forEach(function (key) {
    workingStates[key] = cloneState(savedStates[key] || TARGETS[key].defaultState);
  });

  var initialTarget = new URLSearchParams(window.location.search).get('target');
  var currentTarget = Object.prototype.hasOwnProperty.call(TARGETS, initialTarget)
    ? initialTarget
    : 'avatar';
  var state = cloneState(workingStates[currentTarget]);
  var activeObjectUrl = '';
  var dragState = null;
  var statusTimer = 0;
  var stageGeometry = null;

  function cloneState(source) {
    return { x: Number(source.x), y: Number(source.y), scale: Number(source.scale) };
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function round(value, digits) {
    var factor = Math.pow(10, digits);
    var result = Math.round(value * factor) / factor;
    return Object.is(result, -0) ? 0 : result;
  }

  function isValidState(candidate) {
    if (!candidate) return false;
    var x = Number(candidate.x);
    var y = Number(candidate.y);
    var scale = Number(candidate.scale);
    return (
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      Number.isFinite(scale) &&
      scale >= MIN_SCALE &&
      scale <= MAX_SCALE
    );
  }

  function loadSavedStates() {
    var result = {};

    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') {
        Object.keys(TARGETS).forEach(function (key) {
          if (!isValidState(saved[key])) return;
          var savedState = cloneState(saved[key]);
          var isOldSmall8DofDefault = (
            key === '8dof' &&
            savedState.x === 0 &&
            savedState.y === 0 &&
            savedState.scale === 1
          );
          if (!isOldSmall8DofDefault) result[key] = savedState;
        });
      }

      if (!result.avatar) {
        var legacyAvatar = JSON.parse(localStorage.getItem(LEGACY_AVATAR_KEY));
        if (isValidState(legacyAvatar)) result.avatar = cloneState(legacyAvatar);
      }
    } catch (error) {
      return result;
    }

    return result;
  }

  function persistSavedStates() {
    try {
      if (Object.keys(savedStates).length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStates));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      localStorage.removeItem(LEGACY_AVATAR_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  function constrainState() {
    state.scale = clamp(round(state.scale, 2), MIN_SCALE, MAX_SCALE);
    state.x = round(state.x, 2);
    state.y = round(state.y, 2);

    if (!stageGeometry) {
      state.x = clamp(state.x, -200, 200);
      state.y = clamp(state.y, -200, 200);
      return;
    }

    var scaledWidth = stageGeometry.imageWidth * state.scale;
    var scaledHeight = stageGeometry.imageHeight * state.scale;
    var minX = (
      stageGeometry.frameWidth - scaledWidth / 2 - stageGeometry.baseCenterX
    ) / stageGeometry.frameWidth * 100;
    var maxX = (
      scaledWidth / 2 - stageGeometry.baseCenterX
    ) / stageGeometry.frameWidth * 100;
    var minY = (
      stageGeometry.frameHeight - scaledHeight / 2 - stageGeometry.baseCenterY
    ) / stageGeometry.frameHeight * 100;
    var maxY = (
      scaledHeight / 2 - stageGeometry.baseCenterY
    ) / stageGeometry.frameHeight * 100;

    state.x = clamp(state.x, minX, maxX);
    state.y = clamp(state.y, minY, maxY);
  }

  function formatPercent(value) {
    return round(value, 2).toFixed(2).replace(/\.00$/, '') + '%';
  }

  function formatScale(value) {
    return round(value, 2).toFixed(2);
  }

  function generatedCss() {
    var config = TARGETS[currentTarget];
    return [
      config.selector + ' {',
      '  --crop-x: ' + formatPercent(state.x) + ';',
      '  --crop-y: ' + formatPercent(state.y) + ';',
      '  --crop-scale: ' + formatScale(state.scale) + ';',
      '}'
    ].join('\n');
  }

  function render() {
    constrainState();
    workingStates[currentTarget] = cloneState(state);

    [cropImage].concat(previewImages).forEach(function (image) {
      image.style.setProperty('--crop-x', formatPercent(state.x));
      image.style.setProperty('--crop-y', formatPercent(state.y));
      image.style.setProperty('--crop-scale', formatScale(state.scale));
    });

    zoomRange.value = formatScale(state.scale);
    zoomValue.textContent = formatScale(state.scale) + '×';
    xValue.textContent = formatPercent(state.x);
    yValue.textContent = formatPercent(state.y);
    cssOutput.value = generatedCss();
  }

  function geometryForFrame(frame, imageWidth, imageHeight, config) {
    var frameWidth = frame.clientWidth;
    var frameHeight = frame.clientHeight;
    if (!frameWidth || !frameHeight || !imageWidth || !imageHeight) return null;

    var coverScale = Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
    var renderedWidth = imageWidth * coverScale;
    var renderedHeight = imageHeight * coverScale;
    var offsetX = (frameWidth - renderedWidth) * config.positionX;
    var offsetY = (frameHeight - renderedHeight) * config.positionY;

    return {
      frameWidth: frameWidth,
      frameHeight: frameHeight,
      imageWidth: renderedWidth,
      imageHeight: renderedHeight,
      baseCenterX: offsetX + renderedWidth / 2,
      baseCenterY: offsetY + renderedHeight / 2
    };
  }

  function applyGeometry(image, frame, geometry) {
    if (!geometry) return;
    image.style.setProperty('--crop-source-width', geometry.imageWidth + 'px');
    image.style.setProperty('--crop-source-height', geometry.imageHeight + 'px');
    image.style.setProperty('--crop-base-left', geometry.baseCenterX + 'px');
    image.style.setProperty('--crop-base-top', geometry.baseCenterY + 'px');
  }

  function layoutCurrentImages() {
    if (!cropImage.complete || !cropImage.naturalWidth) return;
    var config = TARGETS[currentTarget];
    var imageWidth = cropImage.naturalWidth;
    var imageHeight = cropImage.naturalHeight;

    stageGeometry = geometryForFrame(stage, imageWidth, imageHeight, config);
    applyGeometry(cropImage, stage, stageGeometry);

    var previewFrames = [previewLarge, previewActual];
    previewImages.forEach(function (image, index) {
      var geometry = geometryForFrame(
        previewFrames[index], imageWidth, imageHeight, config
      );
      applyGeometry(image, previewFrames[index], geometry);
    });

    render();
  }

  function cacheBustedSource(path) {
    return path + (path.indexOf('?') === -1 ? '?' : '&') + 'cropPreview=' + Date.now();
  }

  function setImageSource(source, label) {
    cropImage.src = source;
    previewImages.forEach(function (image) { image.src = source; });
    fileName.textContent = label;
  }

  function releaseTemporaryImage() {
    if (activeObjectUrl) {
      URL.revokeObjectURL(activeObjectUrl);
      activeObjectUrl = '';
    }
    fileInput.value = '';
  }

  function setStatus(message, isError) {
    window.clearTimeout(statusTimer);
    statusMessage.textContent = message;
    statusMessage.classList.toggle('is-error', Boolean(isError));
    if (message) {
      statusTimer = window.setTimeout(function () {
        statusMessage.textContent = '';
        statusMessage.classList.remove('is-error');
      }, 5000);
    }
  }

  function updateTargetUi() {
    var config = TARGETS[currentTarget];
    var aspectText = String(config.aspect);

    targetSelect.value = currentTarget;
    targetHint.textContent = config.hint;
    editorDescription.textContent = '当前调整：' + config.label + '。放大后可拖动图片位置。';
    previewDescription.textContent = config.description;

    stage.style.setProperty('--stage-width', config.stageWidth + 'px');
    stage.style.setProperty('--stage-aspect', aspectText);
    stage.classList.toggle('crop-stage--circle', config.circle);
    stage.setAttribute(
      'aria-label',
      '可拖动的' + config.label + '取景区域。使用方向键可微调图片位置。'
    );

    previewLarge.style.setProperty('--preview-large-width', config.largePreviewWidth + 'px');
    previewLarge.style.setProperty('--preview-aspect', aspectText);
    previewActual.style.setProperty('--preview-actual-width', config.actualPreviewWidth + 'px');
    previewActual.style.setProperty('--preview-aspect', aspectText);
    previewLarge.classList.toggle('image-preview--circle', config.circle);
    previewActual.classList.toggle('image-preview--circle', config.circle);
    previewLargeLabel.textContent = config.circle ? '96 × 96 放大预览' : '取景放大预览';
    previewActualLabel.textContent = config.actualLabel;

    cropImage.alt = config.label + '待调整图片';

    exportButton.textContent = config.circle ? '导出圆形 PNG' : '导出当前取景 PNG';
    releaseTemporaryImage();
    stageGeometry = null;
    setImageSource(cacheBustedSource(config.image), '当前：' + config.image);
    render();
  }

  function updateScale(nextScale) {
    state.scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    render();
  }

  cropImage.addEventListener('load', function () {
    window.requestAnimationFrame(layoutCurrentImages);
  });

  window.addEventListener('resize', function () {
    window.requestAnimationFrame(layoutCurrentImages);
  });

  targetSelect.addEventListener('change', function () {
    var nextTarget = targetSelect.value;
    if (!Object.prototype.hasOwnProperty.call(TARGETS, nextTarget)) return;
    workingStates[currentTarget] = cloneState(state);
    currentTarget = nextTarget;
    state = cloneState(workingStates[currentTarget]);
    updateTargetUi();
    setStatus('已切换到“' + TARGETS[currentTarget].label + '”。');
  });

  stage.addEventListener('pointerdown', function (event) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    stage.focus({ preventScroll: true });
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
    dragState = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      startX: state.x,
      startY: state.y
    };
  });

  stage.addEventListener('pointermove', function (event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    var rect = stage.getBoundingClientRect();
    state.x = dragState.startX + ((event.clientX - dragState.clientX) / rect.width) * 100;
    state.y = dragState.startY + ((event.clientY - dragState.clientY) / rect.height) * 100;
    render();
  });

  function endDrag(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    if (stage.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId);
    }
    dragState = null;
    stage.classList.remove('is-dragging');
  }

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  stage.addEventListener('wheel', function (event) {
    event.preventDefault();
    var direction = event.deltaY < 0 ? 1 : -1;
    updateScale(state.scale + direction * SCALE_STEP);
  }, { passive: false });

  stage.addEventListener('keydown', function (event) {
    var amount = event.shiftKey ? 1 : 0.25;
    var handled = true;

    if (event.key === 'ArrowLeft') state.x -= amount;
    else if (event.key === 'ArrowRight') state.x += amount;
    else if (event.key === 'ArrowUp') state.y -= amount;
    else if (event.key === 'ArrowDown') state.y += amount;
    else handled = false;

    if (handled) {
      event.preventDefault();
      render();
    }
  });

  zoomRange.addEventListener('input', function () {
    updateScale(Number(zoomRange.value));
  });

  zoomOutButton.addEventListener('click', function () {
    updateScale(state.scale - SCALE_STEP);
  });

  zoomInButton.addEventListener('click', function () {
    updateScale(state.scale + SCALE_STEP);
  });

  centerButton.addEventListener('click', function () {
    state.x = 0;
    state.y = 0;
    render();
    setStatus('图片偏移已归零，缩放比例保持不变。');
  });

  resetButton.addEventListener('click', function () {
    state = cloneState(TARGETS[currentTarget].defaultState);
    render();
    setStatus('“' + TARGETS[currentTarget].label + '”已恢复工程默认取景。');
  });

  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;

    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      fileInput.value = '';
      setStatus('请选择 PNG、JPEG 或 WebP 图片。', true);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      fileInput.value = '';
      setStatus('图片不能超过 20 MB。', true);
      return;
    }

    if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = URL.createObjectURL(file);
    state = { x: 0, y: 0, scale: 1 };

    function handleLoad() {
      cropImage.removeEventListener('load', handleLoad);
      cropImage.removeEventListener('error', handleError);
      layoutCurrentImages();
      setStatus('临时图片已载入。这里只预览取景，不会替换工程文件。');
    }

    function handleError() {
      cropImage.removeEventListener('load', handleLoad);
      cropImage.removeEventListener('error', handleError);
      setStatus('图片读取失败，请换一张图片重试。', true);
    }

    cropImage.addEventListener('load', handleLoad);
    cropImage.addEventListener('error', handleError);
    setImageSource(activeObjectUrl, '临时图片：' + file.name);
  });

  copyButton.addEventListener('click', function () {
    var css = generatedCss();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(css).then(function () {
        setStatus('“' + TARGETS[currentTarget].label + '”的 CSS 参数已复制。');
      }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  function fallbackCopy() {
    cssOutput.focus();
    cssOutput.select();
    try {
      var copied = document.execCommand('copy');
      setStatus(copied ? 'CSS 参数已复制到剪贴板。' : '请手动复制文本框中的 CSS。', !copied);
    } catch (error) {
      setStatus('请手动复制文本框中的 CSS。', true);
    }
  }

  applyButton.addEventListener('click', function () {
    var savedCrop = {
      x: round(state.x, 2),
      y: round(state.y, 2),
      scale: round(state.scale, 2)
    };

    savedStates[currentTarget] = savedCrop;
    persistSavedStates();

    var homepageUrl = new URL('index.html', window.location.href);
    homepageUrl.searchParams.set('cropTarget', currentTarget);
    homepageUrl.searchParams.set('cropX', savedCrop.x);
    homepageUrl.searchParams.set('cropY', savedCrop.y);
    homepageUrl.searchParams.set('cropScale', savedCrop.scale);
    homepageUrl.searchParams.set('cropPreview', Date.now());
    homepageUrl.hash = TARGETS[currentTarget].hash;

    setStatus('已保存“' + TARGETS[currentTarget].label + '”，正在打开主页预览……');
    window.setTimeout(function () {
      window.location.assign(homepageUrl.href);
    }, 180);
  });

  clearButton.addEventListener('click', function () {
    delete savedStates[currentTarget];
    var storageWorked = persistSavedStates();
    state = cloneState(TARGETS[currentTarget].defaultState);
    workingStates[currentTarget] = cloneState(state);
    render();
    setStatus(
      storageWorked
        ? '当前图片的浏览器预览设置已清除，主页将使用 style.css 默认值。'
        : '无法清除浏览器本地设置。',
      !storageWorked
    );
  });

  exportButton.addEventListener('click', function () {
    if (!cropImage.complete || !cropImage.naturalWidth) {
      setStatus('图片还未加载完成，请稍后重试。', true);
      return;
    }

    try {
      var config = TARGETS[currentTarget];
      var outputWidth = config.outputWidth;
      var outputHeight = config.outputHeight;
      var outputCanvas = document.createElement('canvas');
      var outputContext = outputCanvas.getContext('2d');

      if (!outputContext) throw new Error('Canvas is unavailable.');

      outputCanvas.width = outputWidth;
      outputCanvas.height = outputHeight;

      var imageWidth = cropImage.naturalWidth;
      var imageHeight = cropImage.naturalHeight;
      var coverScale = Math.max(outputWidth / imageWidth, outputHeight / imageHeight);
      var renderedWidth = imageWidth * coverScale;
      var renderedHeight = imageHeight * coverScale;
      var baseCenterX = (
        (outputWidth - renderedWidth) * config.positionX + renderedWidth / 2
      );
      var baseCenterY = (
        (outputHeight - renderedHeight) * config.positionY + renderedHeight / 2
      );

      outputContext.save();
      if (config.circle) {
        outputContext.beginPath();
        outputContext.arc(
          outputWidth / 2,
          outputHeight / 2,
          Math.min(outputWidth, outputHeight) / 2,
          0,
          Math.PI * 2
        );
        outputContext.clip();
      }
      outputContext.translate(
        baseCenterX + (state.x / 100) * outputWidth,
        baseCenterY + (state.y / 100) * outputHeight
      );
      outputContext.scale(state.scale, state.scale);
      outputContext.drawImage(
        cropImage,
        -renderedWidth / 2,
        -renderedHeight / 2,
        renderedWidth,
        renderedHeight
      );
      outputContext.restore();

      outputCanvas.toBlob(function (blob) {
        if (!blob) {
          setStatus('PNG 生成失败，请重试。', true);
          return;
        }
        var downloadUrl = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = downloadUrl;
        link.download = config.downloadName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 1000);
        setStatus(
          '已导出 ' + outputWidth + ' × ' + outputHeight +
          (config.circle ? ' 的透明圆形 PNG。' : ' 的 PNG。')
        );
      }, 'image/png');
    } catch (error) {
      setStatus('导出失败。请通过 http://localhost:8000 打开工具后重试。', true);
    }
  });

  window.addEventListener('beforeunload', function () {
    if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
  });

  updateTargetUi();
})();
