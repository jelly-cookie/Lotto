document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const balls = document.querySelectorAll('.ball');
    const historyList = document.getElementById('historyList');
    
    // 로컬 스토리지에서 히스토리 불러오기
    let numberHistory = JSON.parse(localStorage.getItem('lottoHistory')) || [];
    
    // 초기 히스토리 표시
    updateHistory();
    
    generateBtn.addEventListener('click', () => {
        // 버튼 텍스트 변경
        if (generateBtn.textContent === '번호 추첨하기') {
            generateNumbers();
            generateBtn.textContent = '다시 추첨하기';
        } else {
            // 기존 번호 리셋
            resetBalls();
            // 약간의 딜레이 후 새로운 번호 생성
            setTimeout(generateNumbers, 100);
        }
    });

    function generateNumbers() {
        const numbers = new Set();
        
        // 1부터 45까지의 숫자 중 6개를 무작위로 선택
        while(numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        
        // 선택된 숫자를 정렬
        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
        
        // 각 공에 번호 표시 및 색상 설정
        balls.forEach((ball, index) => {
            setTimeout(() => {
                const number = sortedNumbers[index];
                ball.setAttribute('data-number', number);
                ball.textContent = number;
                
                // 번호 범위에 따른 색상 설정
                if (number <= 10) {
                    ball.style.backgroundColor = '#fbc400';
                } else if (number <= 20) {
                    ball.style.backgroundColor = '#69c8f2';
                } else if (number <= 30) {
                    ball.style.backgroundColor = '#ff7272';
                } else if (number <= 40) {
                    ball.style.backgroundColor = '#aaa';
                } else {
                    ball.style.backgroundColor = '#b0d840';
                }

                // 마지막 공이 표시된 후 히스토리에 추가
                if (index === balls.length - 1) {
                    addToHistory(sortedNumbers);
                }
            }, index * 300); // 각 공이 0.3초 간격으로 나타남
        });
    }
    
    function resetBalls() {
        balls.forEach(ball => {
            ball.style.transform = 'scale(0)';
            ball.style.opacity = '0';
            
            setTimeout(() => {
                ball.setAttribute('data-number', '');
                ball.textContent = '';
                ball.style.backgroundColor = '#e0e0e0';
                ball.style.transform = 'scale(1)';
                ball.style.opacity = '1';
            }, 200);
        });
    }
    
    function addToHistory(numbers) {
        const now = new Date();
        const historyItem = {
            numbers: numbers,
            timestamp: now.toLocaleString()
        };
        
        numberHistory.unshift(historyItem);
        // 최대 10개까지만 저장
        if (numberHistory.length > 10) {
            numberHistory.pop();
        }
        
        // 로컬 스토리지에 저장
        localStorage.setItem('lottoHistory', JSON.stringify(numberHistory));
        updateHistory();
    }
    
    function updateHistory() {
        historyList.innerHTML = '';
        numberHistory.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            historyElement.innerHTML = `
                <div class="history-numbers">
                    ${item.numbers.map(num => `<span class="mini-ball" style="background-color: ${getBallColor(num)}">${num}</span>`).join('')}
                </div>
                <div class="history-timestamp">${item.timestamp}</div>
            `;
            historyList.appendChild(historyElement);
        });
    }
    
    function getBallColor(number) {
        if (number <= 10) return '#fbc400';
        if (number <= 20) return '#69c8f2';
        if (number <= 30) return '#ff7272';
        if (number <= 40) return '#aaa';
        return '#b0d840';
    }
}); 