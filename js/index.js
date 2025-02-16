// 图片移动、缩放

document.addEventListener("DOMContentLoaded", function () {
    const rangeInput = document.getElementById("scale-range");
    const viewerImage = document.getElementById("viewer-image");
    const imageViewer = document.getElementById("image-viewer");
    const closeButton = document.getElementById("closeButton");

    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let imageX = 0, imageY = 0; // 记录图片位置
    let scaleFactor = 1; // 初始缩放比例

    function updateImagePosition() {
        viewerImage.style.left = `${imageX}px`;
        viewerImage.style.top = `${imageY}px`;
    }

    function resetImageState() {
        viewerImage.style.width = "";
        viewerImage.style.height = "";
        viewerImage.style.position = "absolute";

        viewerImage.onload = function () {
            if (viewerImage.naturalWidth > 0) {
                const viewerWidth = window.innerWidth;  // 图片显示区域宽度
                const initialWidth = viewerWidth >= 1200 ? 600 : viewerWidth * 0.75;  // 图片初始宽度

                viewerImage.style.width = `${initialWidth}px`;
                viewerImage.style.height = "auto"; // 维持图片纵横比

                rangeInput.value = initialWidth / viewerImage.naturalWidth * 100;
                rangeInput.dispatchEvent(new Event("input"));
            }
            centerImage();
        };
    }


    function centerImage() {
        const viewerRect = imageViewer.getBoundingClientRect();
        const imageRect = viewerImage.getBoundingClientRect();

        imageX = (viewerRect.width - imageRect.width) / 2;
        imageY = (viewerRect.height - imageRect.height) / 2;

        updateImagePosition();
    }

    // 图片缩放
    if (rangeInput && viewerImage) {
        rangeInput.addEventListener("input", function () {
            scaleFactor = rangeInput.value / 100;
            const scale = rangeInput.value / 100;
            if (viewerImage.naturalWidth > 0) {
                viewerImage.style.width = `${viewerImage.naturalWidth * scale}px`;
                viewerImage.style.height = `${viewerImage.naturalHeight * scale}px`;
                centerImage(); // 重新居中
            }
        });

        viewerImage.addEventListener("mousedown", function (e) {
            isDragging = true;
            offsetX = e.clientX - imageX;
            offsetY = e.clientY - imageY;
        });

        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                imageX = e.clientX - offsetX;
                imageY = e.clientY - offsetY;
                updateImagePosition();
            }
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
        });
    }

    // 滚轮缩放图片
    imageViewer.addEventListener("wheel", function (event) {
        if (!imageViewer.classList.contains("active")) return;

        event.preventDefault(); // 阻止页面滚动

        const scaleStep = 0.1; // 缩放步长
        if (event.deltaY < 0) {
            scaleFactor = Math.min(scaleFactor + scaleStep, 2.5); // 最大放大 2.5 倍
        } else {
            scaleFactor = Math.max(scaleFactor - scaleStep, 0.1); // 最小缩小 0.4 倍
        }
        rangeInput.value = scaleFactor * 100;
        rangeInput.dispatchEvent(new Event("input"));

        updateImagePosition();
    });

    if (closeButton && imageViewer) {
        closeButton.addEventListener("click", function () {
            imageViewer.classList.remove("active");
            // resetImageState(); // 关闭时重置状态
        });
    }

    // **监听图片 src 变化，确保新图片时重置状态**
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "src") {
                resetImageState(); // **图片更新时重置状态**
            }
        });
    });

    observer.observe(viewerImage, { attributes: true, attributeFilter: ["src"] });

});
