document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyze-button');
    const textarea = document.getElementById('termsSummary');
    const subtitle = document.getElementById('subtitle');

    analyzeButton.addEventListener('click', async () => {
        const terms = textarea.value;

        if (!terms.trim()) {
            alert("Please enter some terms to analyze.");
            return;
        }

        // Add loading states
        analyzeButton.disabled = true;
        analyzeButton.classList.add('loading');
        analyzeButton.textContent = "Analyzing...";
        textarea.disabled = true;
        subtitle.classList.add('loading');

        try {
            const response = await fetch('http://localhost:5000/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ terms }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            animatePageTransition(() => displaySummary(data.summary));
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed to analyze terms: ${error.message}`);
            
            // Reset the form on error
            resetFormState();
        } finally {
            if (!analyzeButton.disabled) {
                resetFormState();
            }
        }
    });
});

function resetFormState() {
    const analyzeButton = document.getElementById('analyze-button');
    const textarea = document.getElementById('termsSummary');
    const subtitle = document.getElementById('subtitle');

    analyzeButton.disabled = false;
    analyzeButton.classList.remove('loading');
    analyzeButton.textContent = "Analyze Terms";
    textarea.disabled = false;
    subtitle.classList.remove('loading');
}

function animatePageTransition(callback) {
    const page1Elements = document.getElementById('page1-elements');
    const page3Elements = document.getElementById('page3-elements');

    // Start animation for hiding page 1
    page1Elements.style.transition = 'transform 260ms ease-out, opacity 260ms ease-out';
    page1Elements.style.transform = 'translateY(150px)';
    page1Elements.style.opacity = '0';

    setTimeout(() => {
        // Hide page 1 and show page 3
        page1Elements.classList.add('hidden');
        page3Elements.classList.remove('hidden');

        // Start animation for showing page 3
        page3Elements.style.transform = 'translateY(0px)';
        page3Elements.style.opacity = '1';
        page3Elements.style.transition = 'transform 260ms ease-out, opacity 260ms ease-out';

        if (callback) callback();
    }, 300); // Match the CSS transition duration
}

function displaySummary(summary) {
    const summaryList = document.querySelector('.summary-list');
    summaryList.innerHTML = '';

    const bullets = summary.split('\n').filter(bullet => bullet.trim());
    
    if (bullets.length === 0) {
        const listItem = document.createElement('li');
        listItem.textContent = "No summary points available.";
        summaryList.appendChild(listItem);
        return;
    }

    bullets.forEach(bullet => {
        const listItem = document.createElement('li');
        listItem.textContent = bullet;
        summaryList.appendChild(listItem);
    });
}

function goBack() {
    const page1Elements = document.getElementById('page1-elements');
    const page3Elements = document.getElementById('page3-elements');
    
    // Reset all form elements
    resetFormState();
    
    // Animate transition back to page 1
    page3Elements.style.transition = 'transform 260ms ease-out, opacity 260ms ease-out';
    page3Elements.style.transform = 'translateY(-150px)';
    page3Elements.style.opacity = '0';
    
    setTimeout(() => {
        page3Elements.classList.add('hidden');
        page1Elements.classList.remove('hidden');
        
        page1Elements.style.transform = 'translateY(-150px)';
        page1Elements.style.opacity = '0';
        
        requestAnimationFrame(() => {
            page1Elements.style.transform = 'translateY(0)';
            page1Elements.style.opacity = '1';
        });
    }, 260);
}