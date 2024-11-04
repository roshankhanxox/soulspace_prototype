let selectedMood = null;

document.addEventListener('DOMContentLoaded', () => {
  const moodButtons = document.querySelectorAll('.mood-button');
  const intensitySlider = document.getElementById('intensity');
  const intensityValue = document.getElementById('intensity-value');

  moodButtons.forEach(button => {
    button.addEventListener('click', () => {
      moodButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selectedMood = button.dataset.mood;
      button.style.animation = 'pulse 0.5s';
      setTimeout(() => {
        button.style.animation = '';
      }, 500);
    });
  });

  intensitySlider.addEventListener('input', () => {
    intensityValue.textContent = intensitySlider.value;
    intensityValue.style.animation = 'pulse 0.5s';
    setTimeout(() => {
      intensityValue.style.animation = '';
    }, 500);
  });
});

async function logMood() {
  if (!selectedMood) {
    showMessage('Please select a mood', 'error');
    return;
  }

  const intensity = document.getElementById('intensity').value;
  const context = document.getElementById('context').value;
  const access_token = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://localhost:8000/api/mood/logs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify({ mood_type: selectedMood, intensity, context })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Mood logged successfully!', 'success');
      resetForm();
    } else {
      showMessage('Failed to log mood: ' + (data.detail || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('An error occurred. Please try again.', 'error');
  }
}

function showMessage(text, type) {
  const message = document.getElementById('message');
  message.textContent = text;
  message.className = type;
  message.classList.add('show');

  setTimeout(() => {
    message.classList.remove('show');
  }, 3000);
}

function resetForm() {
  selectedMood = null;
  document.querySelectorAll('.mood-button').forEach(btn => btn.classList.remove('selected'));
  document.getElementById('intensity').value = 3;
  document.getElementById('intensity-value').textContent = '3';
  document.getElementById('context').value = '';
}

// Add this for the pulsing animation
document.styleSheets[0].insertRule(`
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`, document.styleSheets[0].cssRules.length);