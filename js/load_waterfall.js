// search func by chatgpt

// 出现动画
function appearAnimation(selector = '.item', delay = 500) {
    console.log('Selector:', selector);

    function init() {
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) {
            console.error(`No elements found for selector: ${selector}`);
            return;
        } else {
            console.log(`Found ${elements.length} elements.`);
        }

        elements.forEach(element => {
            element.style.opacity = '0';
        });

        setTimeout(() => { // 延迟启动 observer，等瀑布流布局完成
            const observerOptions = {
                root: null, // 视口为根
                threshold: 0.05 // 元素进入视口的 10% 时触发
            };

            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const rect = entry.boundingClientRect;
                        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

                        if (rect.top > viewportHeight / 2) {
                            // 从下方进入
                            entry.target.classList.add('visible-in-bottom');
                        } else if (rect.bottom <= viewportHeight && rect.top >= 0) {
                            // 如果元素最初就在视口内，确保它只应用 visible-in-bottom
                            entry.target.classList.add('visible-in-bottom');
                        } else {
                            // 从上方进入
                            entry.target.classList.add('visible-in-top');
                        }

                    } else {
                        // 元素离开视口时移除动画
                        entry.target.classList.remove('visible-in-top', 'visible-in-bottom');
                    }
                });
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            elements.forEach(element => observer.observe(element));
        }, delay); // 延迟执行 IntersectionObserver
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}



fetch('./updates/images.json') // 假设你的 JSON 文件名为 images.json
    .then(response => response.json())
    .then(data => {

        // 定义全局变量
        const gallery = document.getElementById('gallery');
        const clearButton = document.getElementById('clearButton');
        const items = data.hub_items;
        const tagColors = data.tags;

        // 显示所有项目
        function displayItems(itemsToDisplay) {
            gallery.innerHTML = ''; // 清空现有的展示
            itemsToDisplay.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('item');
                div.dataset.image = item.image; // 存储图片路径，方便后续使用

                const tagsHtml = item.tags.map(tag => {
                    const colorClass = tagColors[tag] || 'default';
                    return `<a href="javascript:void(0)" class="tag ${colorClass}" data-tag="${tag}">${tag}</a>`;
                }).join('');

                div.innerHTML = `
            <img src="updates/images/${item.image}" alt="${item.title}" loading="lazy">  <!-- 懒加载 -->
            <div class="tags">${tagsHtml}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        `;

                // 绑定点击事件
                div.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('tag')) { // 如果点击的不是标签
                        // 延迟加载图片，提高性能
                        setTimeout(() => {
                            const imageViewer = document.getElementById('image-viewer');
                            const viewerImg = imageViewer.querySelector('img');

                            viewerImg.src = `updates/images/${item.image}`;
                            imageViewer.classList.add('active');
                        }, 300);
                    }
                });

                gallery.appendChild(div);
            });

            appearAnimation(); // 出现动画
            window.scrollTo(0, 0);  // 回到顶部
        }


        // 初次展示所有项目
        displayItems(Object.values(items));

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        function filterItems(query) {
            const filteredItems = Object.values(items).filter(item => {
                // 搜索标题、描述和标签中包含查询字符串的项目
                const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
                const descriptionMatch = item.description.toLowerCase().includes(query.toLowerCase());
                const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

                // 返回标题、描述或标签符合查询的项目
                return titleMatch || descriptionMatch || tagMatch;
            });
            displayItems(filteredItems); // 显示过滤后的项目
        }

        // 当用户点击搜索按钮时触发过滤
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            filterItems(query);
        });

        // 按回车键触发搜索
        searchInput.addEventListener('keyup', (e) => {
            if (event.keyCode === 13) {
                const query = searchInput.value.trim();
                filterItems(query);
            }
        });

        // 当用户点击清除按钮时触发过滤
        clearButton.addEventListener('click', () => {
            searchInput.value = '';  // 清空搜索框
            displayItems(Object.values(items));  // 显示所有项目
        });

        // 当用户在输入框中输入时实时触发过滤
        // searchInput.addEventListener('input', () => {
        //     const query = searchInput.value.trim();
        //     filterItems(query);
        // });

        // 点击标签时触发搜索该标签
        gallery.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('tag')) {
                const tag = e.target.getAttribute('data-tag');
                searchInput.value = tag;  // 将标签值填入搜索框
                filterItems(tag);         // 触发过滤
            }
        });

    })
    .catch(error => console.error('Error loading JSON:', error));
