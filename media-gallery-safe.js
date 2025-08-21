// Safe version of media gallery functions

// Load all media - simplified version
window.loadAllMedia = function() {
    console.log('=== loadAllMedia 실행 ===');
    
    try {
        // Load storyboard media
        loadStoryboardMediaSafe();
    } catch (e) {
        console.error('스토리보드 로딩 오류:', e);
    }
    
    try {
        // Load concept art media
        loadConceptArtMediaSafe();
    } catch (e) {
        console.error('컨셉아트 로딩 오류:', e);
    }
    
    // Update display
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        showTab(tabName);
    }
};

// Safe storyboard loader
function loadStoryboardMediaSafe() {
    console.log('스토리보드 미디어 로딩...');
    const gallery = document.getElementById('storyboard-gallery');
    if (!gallery) {
        console.error('storyboard-gallery 요소를 찾을 수 없습니다');
        return;
    }
    
    let mediaCount = 0;
    let galleryHTML = '';
    
    // Find all breakdownData keys
    const keys = Object.keys(localStorage);
    const breakdownKeys = keys.filter(k => k.startsWith('breakdownData_'));
    
    console.log(`발견된 breakdownData 키: ${breakdownKeys.length}개`);
    
    // Process each key
    breakdownKeys.forEach(key => {
        try {
            const data = localStorage.getItem(key);
            if (!data) return;
            
            const parsed = JSON.parse(data);
            console.log(`${key} 파싱 성공`);
            
            // Check for shots
            if (parsed.breakdown_data && parsed.breakdown_data.shots) {
                const shots = parsed.breakdown_data.shots;
                console.log(`  샷 개수: ${shots.length}`);
                
                // Process each shot
                shots.forEach(shot => {
                    // Check image_prompts
                    if (shot.image_prompts) {
                        ['midjourney', 'ideogram', 'leonardo', 'imagefx', 'openart', 'universal'].forEach(tool => {
                            if (shot.image_prompts[tool] && shot.image_prompts[tool].images) {
                                Object.values(shot.image_prompts[tool].images).forEach(img => {
                                    if (img && img.url) {
                                        mediaCount++;
                                        galleryHTML += createGalleryItemSafe({
                                            url: img.url,
                                            title: `샷 - ${tool}`,
                                            type: 'image'
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error(`${key} 처리 오류:`, e);
        }
    });
    
    // Update gallery
    if (mediaCount > 0) {
        gallery.innerHTML = galleryHTML;
        gallery.classList.remove('empty');
    } else {
        gallery.classList.add('empty');
        gallery.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎬</div>
                <div class="empty-state-title">스토리보드 미디어가 없습니다</div>
                <div class="empty-state-text">스토리보드에 이미지나 영상을 추가하면 여기에 표시됩니다</div>
            </div>
        `;
    }
    
    // Update count
    const countEl = document.getElementById('storyboard-count');
    if (countEl) countEl.textContent = mediaCount;
    
    console.log(`스토리보드 미디어: ${mediaCount}개 로드됨`);
}

// Safe concept art loader
function loadConceptArtMediaSafe() {
    console.log('컨셉아트 미디어 로딩...');
    const gallery = document.getElementById('conceptart-gallery');
    if (!gallery) return;
    
    let mediaCount = 0;
    let galleryHTML = '';
    
    const data = localStorage.getItem('conceptArtManagerData_v1.2');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            
            ['characters', 'locations', 'props'].forEach(category => {
                if (parsed[category] && Array.isArray(parsed[category])) {
                    parsed[category].forEach(item => {
                        if (item.image_url) {
                            mediaCount++;
                            galleryHTML += createGalleryItemSafe({
                                url: item.image_url,
                                title: item.name || '이름 없음',
                                type: 'image'
                            });
                        }
                    });
                }
            });
        } catch (e) {
            console.error('컨셉아트 파싱 오류:', e);
        }
    }
    
    // Update gallery
    if (mediaCount > 0) {
        gallery.innerHTML = galleryHTML;
        gallery.classList.remove('empty');
    } else {
        gallery.classList.add('empty');
        gallery.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎨</div>
                <div class="empty-state-title">컨셉아트가 없습니다</div>
                <div class="empty-state-text">컨셉아트를 추가하면 여기에 표시됩니다</div>
            </div>
        `;
    }
    
    // Update count
    const countEl = document.getElementById('conceptart-count');
    if (countEl) countEl.textContent = mediaCount;
    
    console.log(`컨셉아트 미디어: ${mediaCount}개 로드됨`);
}

// Safe gallery item creator
function createGalleryItemSafe(item) {
    const isVideo = item.type === 'video';
    return `
        <div class="gallery-item" data-type="${item.type}">
            ${isVideo ? 
                `<div class="gallery-item-video">
                    <iframe src="${item.url}" frameborder="0"></iframe>
                </div>` :
                `<div class="gallery-item-image">
                    <img src="${item.url}" alt="${item.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"200\"><rect fill=\"%23333\" width=\"300\" height=\"200\"/><text fill=\"%23999\" x=\"50%\" y=\"50%\" text-anchor=\"middle\">로드 실패</text></svg>'">
                </div>`
            }
            <div class="gallery-item-info">
                <div class="gallery-item-title">${item.title || '제목 없음'}</div>
            </div>
        </div>
    `;
}

console.log('Safe media gallery functions loaded. Call loadAllMedia() to test.');