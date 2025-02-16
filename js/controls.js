document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.getElementById("closeButton");
    const imageViewer = document.getElementById("image-viewer");

    function updateProgress(rangeInput) {
        const min = rangeInput.min || 0;
        const max = rangeInput.max || 100;
        const value = rangeInput.value;
        const percent = ((value - min) / (max - min)) * 100;

        // 找到对应的文本元素
        const scaleText = document.getElementById(rangeInput.dataset.target);
        if (scaleText) {
            scaleText.textContent = `${value}%`;
        }

        // 更新进度条宽度
        const rangeContainer = rangeInput.closest(".range-container");
        if (rangeContainer) {
            rangeContainer.style.setProperty('--progress-width', `${percent}%`);
        }
    }


    // 选择所有 range 滑块
    document.querySelectorAll("input[type='range']").forEach((rangeInput) => {
        // 初始化
        updateProgress(rangeInput);

        // 绑定事件监听器
        rangeInput.addEventListener("input", function () {
            updateProgress(rangeInput);
        });
    });

    if (closeButton && imageViewer) {
        closeButton.addEventListener("click", function () {
            imageViewer.classList.remove("active");
        });
    }

});