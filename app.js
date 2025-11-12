// 示例食谱数据
const recipe = {
    title: "Garlic Butter Steak",
    description: "Juicy pan-seared steak with garlic butter sauce.",
    images: [
        "./assets/steak.jpg",
        "./assets/steak2.jpg",
        "./assets/steak3.jpg"
    ],
    ingredients: [
        { name: "Steak", amount: "300g" },
        { name: "Butter", amount: "20g" },
        { name: "Garlic", amount: "3 cloves" },
        { name: "Salt", amount: "to taste" },
    ],
    steps: [
        { step: 1, text: "Season steak with salt and pepper.", duration: "1 min" },
        { step: 2, text: "Sear both sides until golden brown.", duration: "5 min" },
        { step: 3, text: "Add butter and garlic, baste for 1 minute.", duration: "1 min", tip: "Don't burn the butter!" },
    ],
};

// 当前图片索引
let currentImageIndex = 0;

// 当前步骤索引
let currentStep = 0;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadRecipe();
    initNavigation();
    initBookmark();
    initImageNavigation();
    initCookButton();
    initMoreMenu();
    initStepNavigator();
});

// 加载食谱内容
function loadRecipe() {
    // 设置标题和描述
    document.getElementById('recipe-title').textContent = recipe.title;
    document.getElementById('recipe-description').textContent = recipe.description;
    
    // 加载第一张图片
    loadImage(0);

    // 加载食材列表
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.className = 'ingredient-item';
        li.innerHTML = `
            <span class="ingredient-name">${ingredient.name}</span>
            <span class="ingredient-amount">${ingredient.amount}</span>
        `;
        ingredientsList.appendChild(li);
    });

    // 加载步骤列表
    const stepsList = document.getElementById('steps-list');
    stepsList.innerHTML = '';
    recipe.steps.forEach(step => {
        const li = document.createElement('li');
        li.className = 'step-card';
        li.id = `step-${step.step - 1}`;
        li.setAttribute('data-step', step.step);
        
        // 构建 tips HTML
        let tipsHTML = '';
        if (step.tip) {
            tipsHTML = `
                <ul class="step-tips">
                    <li class="tip-chip">${step.tip}</li>
                </ul>
            `;
        }
        
        // 构建文本，包含时长
        let textHTML = step.text;
        if (step.duration) {
            textHTML += ` <span class="step-duration">(${step.duration})</span>`;
        }
        
        li.innerHTML = `
            <div class="step-header">
                <span class="step-badge">STEP ${step.step}</span>
                <button class="step-speak" aria-label="Read step ${step.step}" title="Read">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                </button>
            </div>
            <div class="step-media">
                <img src="./assets/placeholder.jpg" alt="Step ${step.step} media" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'225\'%3E%3Crect fill=\'%23e0e0e0\' width=\'400\' height=\'225\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'16\'%3EMedia%3C/text%3E%3C/svg%3E';" />
            </div>
            <div class="step-body">
                <p class="step-text">${textHTML}</p>
                ${tipsHTML}
            </div>
            <div class="step-progress" aria-hidden="true">
                <div class="step-progress-bar" style="width:0%"></div>
            </div>
            <hr class="step-divider" />
        `;
        stepsList.appendChild(li);
        
        // 为语音按钮添加点击事件
        const speakBtn = li.querySelector('.step-speak');
        speakBtn.addEventListener('click', function() {
            // 语音播放功能（后续可扩展）
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(step.text);
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
            } else {
                alert(`Step ${step.step}: ${step.text}`);
            }
        });
    });
}

// 加载图片
function loadImage(index) {
    if (!recipe.images || recipe.images.length === 0) {
        return;
    }
    
    currentImageIndex = index;
    const recipeImage = document.getElementById('recipe-image');
    const imageUrl = recipe.images[index];
    
    recipeImage.src = imageUrl;
    recipeImage.alt = recipe.title + ' - 图片 ' + (index + 1);
    
    recipeImage.onerror = function() {
        // 如果图片加载失败，使用占位符
        this.style.backgroundColor = '#e0e0e0';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.minHeight = '200px';
        this.style.color = '#999';
        this.alt = 'Media';
    };
    
    // 更新按钮状态
    updateImageNavButtons();
}

// 更新图片导航按钮状态
function updateImageNavButtons() {
    const prevBtn = document.getElementById('image-prev-btn');
    const nextBtn = document.getElementById('image-next-btn');
    
    if (recipe.images && recipe.images.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        
        // 如果是第一张，禁用上一张按钮
        if (currentImageIndex === 0) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        // 如果是最后一张，禁用下一张按钮
        if (currentImageIndex === recipe.images.length - 1) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
}

// 初始化图片导航
function initImageNavigation() {
    const prevBtn = document.getElementById('image-prev-btn');
    const nextBtn = document.getElementById('image-next-btn');
    
    prevBtn.addEventListener('click', function() {
        if (currentImageIndex > 0 && recipe.images && recipe.images.length > 0) {
            loadImage(currentImageIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentImageIndex < recipe.images.length - 1 && recipe.images && recipe.images.length > 0) {
            loadImage(currentImageIndex + 1);
        }
    });
    
    // 初始化按钮状态
    updateImageNavButtons();
}

// 初始化导航栏
function initNavigation() {
    const backBtn = document.getElementById('nav-back-btn');
    
    backBtn.addEventListener('click', function() {
        // 检查是否有历史记录可以返回
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // 如果没有历史记录，可以跳转到首页或其他页面
            alert('这是第一页，无法返回');
        }
    });
}

// 初始化书签功能
function initBookmark() {
    const bookmarkBtn = document.getElementById('nav-bookmark-btn');
    const bookmarkIcon = bookmarkBtn.querySelector('.nav-bookmark-icon');
    
    // 从 localStorage 读取收藏状态
    const isBookmarked = localStorage.getItem('bookmarked_' + recipe.title) === 'true';
    if (isBookmarked) {
        bookmarkBtn.classList.add('active');
        bookmarkIcon.textContent = '★';
    }
    
    // 点击切换收藏状态
    bookmarkBtn.addEventListener('click', function() {
        const isCurrentlyBookmarked = bookmarkBtn.classList.contains('active');
        
        if (isCurrentlyBookmarked) {
            bookmarkBtn.classList.remove('active');
            bookmarkIcon.textContent = '☆';
            localStorage.removeItem('bookmarked_' + recipe.title);
        } else {
            bookmarkBtn.classList.add('active');
            bookmarkIcon.textContent = '★';
            localStorage.setItem('bookmarked_' + recipe.title, 'true');
        }
    });
}

// 初始化更多菜单
function initMoreMenu() {
    const moreBtn = document.getElementById('nav-more-btn');
    
    moreBtn.addEventListener('click', function() {
        // 创建简单的下拉菜单
        const menu = document.createElement('div');
        menu.className = 'more-menu';
        menu.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            padding: 0.5rem 0;
            z-index: 1000;
            min-width: 150px;
        `;
        
        const menuItems = [
            { text: '分享食谱', action: () => alert('分享功能') },
            { text: '打印食谱', action: () => window.print() },
            { text: '报告问题', action: () => alert('报告问题功能') }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                padding: 0.8rem 1.2rem;
                cursor: pointer;
                transition: background 0.2s;
            `;
            menuItem.textContent = item.text;
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.backgroundColor = '#f5f5f5';
            });
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.backgroundColor = 'transparent';
            });
            menuItem.addEventListener('click', () => {
                item.action();
                document.body.removeChild(menu);
            });
            menu.appendChild(menuItem);
        });
        
        document.body.appendChild(menu);
        
        // 点击外部关闭菜单
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== moreBtn) {
                if (document.body.contains(menu)) {
                    document.body.removeChild(menu);
                }
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    });
}

// 初始化 COOK! 按钮
function initCookButton() {
    const cookBtn = document.getElementById('cookBtn');
    
    if (cookBtn) {
        cookBtn.addEventListener('click', function() {
            // 保存当前食谱到 localStorage
            localStorage.setItem('currentRecipe', JSON.stringify(recipe));
            
            // 跳转到烹饪模式页面
            window.location.href = 'cooking.html';
        });
    }
    
    // 初始化计时器图标按钮（占位功能）
    const timerBtn = document.getElementById('timerIconBtn');
    if (timerBtn) {
        timerBtn.addEventListener('click', function() {
            // 后续可扩展：打开/折叠计时器 UI
            alert('计时器功能（待实现）');
        });
    }
    
    // 初始化聊天按钮（占位功能）
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            // 后续可扩展：打开烹饪助手聊天
            alert('烹饪助手功能（待实现）');
        });
    }
}

// 跳转到指定步骤
function goToStep(index, opts = {scroll: true}) {
    if (!recipe.steps || recipe.steps.length === 0) return;
    
    index = Math.max(0, Math.min(index, recipe.steps.length - 1));
    currentStep = index;
    
    // 更新 step-card 高亮
    document.querySelectorAll('.step-card').forEach((el, i) => {
        el.classList.toggle('active', i === index);
        el.setAttribute('aria-current', i === index ? 'step' : 'false');
        if (i === index && opts.scroll) {
            el.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    });
    
    // 更新圆点与箭头
    document.querySelectorAll('.nav-dot').forEach((b, i) => {
        b.classList.toggle('active', i === index);
        b.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    
    const prevBtn = document.getElementById('navPrev');
    const nextBtn = document.getElementById('navNext');
    if (prevBtn) prevBtn.disabled = (index === 0);
    if (nextBtn) nextBtn.disabled = (index === recipe.steps.length - 1);
}

// 初始化步骤导航器
function initStepNavigator() {
    if (!recipe.steps || recipe.steps.length === 0) return;
    
    const navDots = document.getElementById('navDots');
    if (!navDots) return;
    
    // 构建圆点
    navDots.innerHTML = '';
    recipe.steps.forEach((step, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'nav-dot';
        button.setAttribute('data-index', index);
        button.setAttribute('aria-controls', `step-${index}`);
        button.setAttribute('aria-label', `Go to step ${step.step}: ${step.text.substring(0, 20)}`);
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('tabindex', index === 0 ? '0' : '-1');
        
        button.addEventListener('click', function() {
            goToStep(index);
        });
        
        li.appendChild(button);
        navDots.appendChild(li);
    });
    
    // 箭头点击事件
    const prevBtn = document.getElementById('navPrev');
    const nextBtn = document.getElementById('navNext');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentStep > 0) {
                goToStep(currentStep - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentStep < recipe.steps.length - 1) {
                goToStep(currentStep + 1);
            }
        });
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 检查是否在步骤区域内或页面焦点
        const activeElement = document.activeElement;
        const isInSteps = activeElement.closest('.steps-section') || 
                         activeElement.tagName === 'BODY' ||
                         activeElement.tagName === 'HTML';
        
        if (!isInSteps) return;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentStep > 0) {
                    goToStep(currentStep - 1);
                }
                break;
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (currentStep < recipe.steps.length - 1) {
                    goToStep(currentStep + 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                goToStep(0);
                break;
            case 'End':
                e.preventDefault();
                goToStep(recipe.steps.length - 1);
                break;
        }
    });
    
    // 滑动手势支持
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    const stepsList = document.getElementById('steps-list');
    const stepsSection = document.querySelector('.steps-section');
    
    if (stepsList && stepsSection) {
        // 使用 Pointer Events 支持鼠标和触摸
        const handlePointerDown = function(e) {
            // 只在步骤卡片或媒体区域触发
            if (e.target.closest('.step-card') || e.target.closest('.step-media')) {
                startX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
                startY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
                isDragging = true;
                if (e.pointerId !== undefined) {
                    stepsList.setPointerCapture(e.pointerId);
                }
            }
        };
        
        const handlePointerMove = function(e) {
            if (!isDragging) return;
            e.preventDefault();
        };
        
        const handlePointerUp = function(e) {
            if (!isDragging) return;
            
            const endX = e.clientX || (e.changedTouches && e.changedTouches[0]?.clientX) || 0;
            const endY = e.clientY || (e.changedTouches && e.changedTouches[0]?.clientY) || 0;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance >= 50) {
                // 判断方向
                const absX = Math.abs(deltaX);
                const absY = Math.abs(deltaY);
                
                if (absX > absY) {
                    // 横向滑动
                    if (deltaX < 0 && currentStep > 0) {
                        // 向左 → 上一步
                        goToStep(currentStep - 1);
                    } else if (deltaX > 0 && currentStep < recipe.steps.length - 1) {
                        // 向右 → 下一步
                        goToStep(currentStep + 1);
                    }
                } else {
                    // 纵向滑动
                    if (deltaY < 0 && currentStep > 0) {
                        // 向上 → 上一步
                        goToStep(currentStep - 1);
                    } else if (deltaY > 0 && currentStep < recipe.steps.length - 1) {
                        // 向下 → 下一步
                        goToStep(currentStep + 1);
                    }
                }
            }
            
            isDragging = false;
            if (e.pointerId !== undefined) {
                stepsList.releasePointerCapture(e.pointerId);
            }
        };
        
        // 绑定事件到步骤区域
        stepsSection.addEventListener('pointerdown', handlePointerDown);
        stepsSection.addEventListener('pointermove', handlePointerMove);
        stepsSection.addEventListener('pointerup', handlePointerUp);
        stepsSection.addEventListener('pointercancel', handlePointerUp);
        
        // 触摸事件备用（某些浏览器可能不支持 Pointer Events）
        stepsSection.addEventListener('touchstart', function(e) {
            if (e.target.closest('.step-card') || e.target.closest('.step-media')) {
                startX = e.touches[0]?.clientX || 0;
                startY = e.touches[0]?.clientY || 0;
                isDragging = true;
            }
        });
        
        stepsSection.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0]?.clientX || 0;
            const endY = e.changedTouches[0]?.clientY || 0;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance >= 50) {
                const absX = Math.abs(deltaX);
                const absY = Math.abs(deltaY);
                
                if (absX > absY) {
                    if (deltaX < 0 && currentStep > 0) {
                        goToStep(currentStep - 1);
                    } else if (deltaX > 0 && currentStep < recipe.steps.length - 1) {
                        goToStep(currentStep + 1);
                    }
                } else {
                    if (deltaY < 0 && currentStep > 0) {
                        goToStep(currentStep - 1);
                    } else if (deltaY > 0 && currentStep < recipe.steps.length - 1) {
                        goToStep(currentStep + 1);
                    }
                }
            }
            
            isDragging = false;
        });
    }
    
    // 初始化：跳转到第一步（不滚动）
    goToStep(0, {scroll: false});
}

