const rangeInput = document.querySelector('input[type="range"]');
const rangeContainer = document.querySelector('.range-container');

rangeInput.addEventListener('input', function () {
    const min = this.min || 0;
    const max = this.max || 100;
    const percent = ((this.value - min) / (max - min)) * 100;
    rangeContainer.style.setProperty('--progress-width', `${percent}%`);
});
