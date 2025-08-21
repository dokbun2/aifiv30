// 스토리보드 전역 함수들
window.exportJSON = function() {
    if (!currentData) {
        showMessage('내보낼 데이터가 없습니다', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = currentData.project_info?.name || 'storyboard_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showMessage('JSON 파일이 다운로드되었습니다', 'success');
};

window.clearAllData = function() {
    localStorage.clear();
    currentData = null;
    selectedType = null;
    selectedId = null;
    selectedSceneId = null;
    
    // UI 초기화
    document.getElementById('navigation-content').innerHTML = `
        <div class="empty-state" id="nav-empty">
            <div class="empty-state-icon">📁</div>
            <div>데이터가 없습니다</div>
            <div style="font-size: 0.9rem; margin-top: 10px;">JSON 가져오기를 사용해 데이터를 로드해주세요</div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">🎬</div>
            <div>시퀀스, 씬, 또는 샷을 선택하여 상세 정보를 확인하세요</div>
        </div>
    `;
    
    showMessage('모든 데이터가 초기화되었습니다', 'success');
};

window.resetToDefaults = function() {
    // 기본 샘플 데이터 로드
    fetch('../sample-storyboard.json')
        .then(response => response.json())
        .then(data => {
            currentData = data;
            localStorage.setItem('storyboardData', JSON.stringify(data));
            updateNavigation();
            showMessage('초기 데이터가 로드되었습니다', 'success');
        })
        .catch(error => {
            console.error('Error loading default data:', error);
            showMessage('초기 데이터 로드에 실패했습니다', 'error');
        });
};

window.expandAll = function() {
    document.querySelectorAll('.sequence-header').forEach(header => {
        header.classList.add('expanded');
        const container = header.nextElementSibling;
        if (container && container.classList.contains('scenes-container')) {
            container.classList.remove('collapsed');
        }
    });
    
    document.querySelectorAll('.scene-header').forEach(header => {
        header.classList.add('expanded');
        const container = header.nextElementSibling;
        if (container && container.classList.contains('shots-container')) {
            container.classList.remove('collapsed');
        }
    });
};

window.collapseAll = function() {
    document.querySelectorAll('.sequence-header').forEach(header => {
        header.classList.remove('expanded');
        const container = header.nextElementSibling;
        if (container && container.classList.contains('scenes-container')) {
            container.classList.add('collapsed');
        }
    });
    
    document.querySelectorAll('.scene-header').forEach(header => {
        header.classList.remove('expanded');
        const container = header.nextElementSibling;
        if (container && container.classList.contains('shots-container')) {
            container.classList.add('collapsed');
        }
    });
};

// Message display function
window.showMessage = function(message, type) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        const container = document.createElement('div');
        container.id = 'message-container';
        container.className = 'message-container';
        document.body.appendChild(container);
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    messageElement.innerHTML = `
        ${message}
        <button class="close-button" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.getElementById('message-container').appendChild(messageElement);
    
    if (type !== 'error') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
};

// Export global functions for use in HTML
if (typeof window !== 'undefined') {
    window.storyboardFunctions = {
        exportJSON: window.exportJSON,
        clearAllData: window.clearAllData,
        resetToDefaults: window.resetToDefaults,
        expandAll: window.expandAll,
        collapseAll: window.collapseAll,
        showMessage: window.showMessage
    };
}