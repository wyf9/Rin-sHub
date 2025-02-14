// search func by chatgpt

fetch('./updates/images.json') // 假设你的 JSON 文件名为 images.json
    .then(response => response.json())
    .then(data => {
        const gallery = document.getElementById('gallery');
        const items = data.hub_items;
        const tagColors = data.tags;

        // 显示所有项目
        function displayItems(itemsToDisplay) {
            gallery.innerHTML = ''; // 清空现有的展示
            itemsToDisplay.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('item');
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
                gallery.appendChild(div);
            });
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

        // 当用户在输入框中输入时实时触发过滤
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            filterItems(query);
        });

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
