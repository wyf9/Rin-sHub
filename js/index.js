document.addEventListener("DOMContentLoaded", function () {
    const rangeInput = document.getElementById("scale-range");
    const viewerImage = document.getElementById("viewer-image");
    const imageViewer = document.getElementById("image-viewer");
    const closeButton = document.getElementById("closeButton");

    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let imageX = 0, imageY = 0;
    let scaleFactor = 1; // 初始缩放比例

    function updateImageTransform() {
        viewerImage.style.transform = `translate(${imageX}px, ${imageY}px) scale(${scaleFactor})`;
    }

    function resetImageState() {
        scaleFactor = 1;
        rangeInput.value = 100;
        rangeInput.dispatchEvent(new Event("input"));
        centerAndFitImage();
    }

    function centerAndFitImage() {
        const viewerRect = imageViewer.getBoundingClientRect();
        const naturalWidth = viewerImage.naturalWidth;
        const naturalHeight = viewerImage.naturalHeight;

        if (naturalWidth > 0 && naturalHeight > 0) {
            // 计算目标宽度（视口宽度的 75%）
            const targetWidth = viewerRect.width * 0.75;
            const scale = targetWidth / naturalWidth; // 计算缩放比例

            scaleFactor = Math.min(scale, 1); // 避免放大超过原始尺寸

            // 计算居中位置
            imageX = 0;
            imageY = 0;
            updateImageTransform();
        }
    }

    // **滚轮缩放**
    imageViewer.addEventListener("wheel", function (event) {
        if (!imageViewer.classList.contains("active")) return;

        event.preventDefault(); // 阻止页面滚动

        const scaleStep = 0.1;
        if (event.deltaY < 0) {
            scaleFactor = Math.min(scaleFactor + scaleStep, 2.5);
        } else {
            scaleFactor = Math.max(scaleFactor - scaleStep, 0.4);
        }

        updateImageTransform();
    });

    // **拖拽图片**
    viewerImage.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - imageX;
        offsetY = e.clientY - imageY;
    });

    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            imageX = e.clientX - offsetX;
            imageY = e.clientY - offsetY;
            updateImageTransform();
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
    });

    // **关闭图片查看器**
    if (closeButton && imageViewer) {
        closeButton.addEventListener("click", function () {
            imageViewer.classList.remove("active");
            resetImageState();
        });
    }

    // **禁用页面滚动**
    function disableScroll(event) {
        if (imageViewer.classList.contains("active")) {
            event.preventDefault();
        }
    }

    document.addEventListener("wheel", disableScroll, { passive: false });

    // **监听图片 src 变化**
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "src") {
                setTimeout(centerAndFitImage, 50);
            }
        });
    });

    observer.observe(viewerImage, { attributes: true, attributeFilter: ["src"] });

    // **图片加载完成后适应窗口**
    viewerImage.onload = function () {
        centerAndFitImage();
    };
});
