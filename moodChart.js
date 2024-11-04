async function fetchMoodData() {
    const token = localStorage.getItem('access_token');

    try {
        // Fetch mood chart data
        const response = await fetch('http://localhost:8000/api/mood/mood-chart-data/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const moodData = await response.json();

        // Fetch mood trend suggestions
        const suggestionsResponse = await fetch('http://localhost:8000/api/mood/mood-trend/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const suggestionsData = await suggestionsResponse.json();

        createMoodChart(moodData);
        updateSuggestions(suggestionsData.suggestions);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function createMoodChart(moodData) {
    const chartData = moodData.map(log => ({
        x: new Date(log.date.replace(/-/g, '/')),
        y: log.intensity,
        r: log.intensity * 3,
        mood: log.mood_type,
        context: log.context
    }));

    const moodColors = {
        happy: 'rgba(255, 193, 7, 0.7)',
        sad: 'rgba(13, 110, 253, 0.7)',
        anxious: 'rgba(220, 53, 69, 0.7)',
        calm: 'rgba(25, 135, 84, 0.7)',
        excited: 'rgba(255, 128, 0, 0.7)',
        angry: 'rgba(220, 53, 69, 0.7)'
    };

    const ctx = document.getElementById('moodChart').getContext('2d');
    new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Mood Intensity Over Time',
                data: chartData,
                backgroundColor: chartData.map(d => moodColors[d.mood])
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Date',
                        color: '#2d6a4f'
                    },
                    ticks: {
                        color: '#2d6a4f'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Intensity',
                        color: '#2d6a4f'
                    },
                    ticks: {
                        color: '#2d6a4f',
                        stepSize: 1,
                        callback: function(value) {
                            if (Number.isInteger(value) && value >= 0 && value <= 5) {
                                return value.toString();
                            }
                            return null;
                        }
                    },
                    min: 0,
                    max: 5.5,
                    suggestedMax: 5.5
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const mood = context.raw.mood;
                            const intensity = context.raw.y;
                            const date = new Date(context.raw.x).toLocaleDateString();
                            const contextText = context.raw.context;
                            return [
                                `Date: ${date}`,
                                `Mood: ${mood}`,
                                `Intensity: ${intensity}`,
                                `Context: ${contextText || 'No context provided'}`
                            ];
                        }
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#2d6a4f',
                    bodyColor: '#2d6a4f',
                    borderColor: '#2d6a4f',
                    borderWidth: 1,
                    padding: 10,
                    bodyFont: {
                        size: 14
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

function updateSuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';
    suggestions.forEach(suggestion => {
        const listItem = document.createElement('li');
        
        const suggestionText = document.createElement('p');
        suggestionText.textContent = suggestion.suggestion;
        listItem.appendChild(suggestionText);
        
        if (suggestion.links && suggestion.links.length > 0) {
            const linksList = document.createElement('ul');
            suggestion.links.forEach(link => {
                const linkItem = document.createElement('li');
                const linkElement = document.createElement('a');
                linkElement.href = link;
                linkElement.textContent = link;
                linkElement.target = "_blank";
                linkItem.appendChild(linkElement);
                linksList.appendChild(linkItem);
            });
            listItem.appendChild(linksList);
        }

        suggestionsList.appendChild(listItem);
    });
}

fetchMoodData();

window.addEventListener('resize', () => {
    const chart = Chart.getChart('moodChart');
    if (chart) {
        chart.resize();
    }
});





// async function fetchMoodData() {
//     const token = localStorage.getItem('access_token'); // Adjust the key based on your storage method

//     // Fetch mood chart data
//     const response = await fetch('http://localhost:8000/api/mood/mood-chart-data/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });

//     const moodData = await response.json();

//     // Fetch mood trend suggestions
//     const suggestionsResponse = await fetch('http://localhost:8000/api/mood/mood-trend/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });

//     const suggestionsData = await suggestionsResponse.json();

//     // Process mood data for the bubble chart
//     const chartData = moodData.map(log => ({
//         x: new Date(log.date.replace(/-/g, '/')),
//         y: log.intensity,
//         r: log.intensity * 3,
//         mood: log.mood_type,
//         context: log.context
//     }));

//     // Define color mapping for moods
//     const moodColors = {
//         happy: 'rgba(255, 193, 7, 0.7)',
//         sad: 'rgba(13, 110, 253, 0.7)',
//         anxious: 'rgba(220, 53, 69, 0.7)',
//         calm: 'rgba(25, 135, 84, 0.7)',
//         excited: 'rgba(255, 128, 0, 0.7)',
//         angry: 'rgba(220, 53, 69, 0.7)'
//     };

//     const ctx = document.getElementById('moodChart').getContext('2d');
//     const moodChart = new Chart(ctx, {
//         type: 'bubble',
//         data: {
//             datasets: [{
//                 label: 'Mood Intensity Over Time',
//                 data: chartData,
//                 backgroundColor: chartData.map(d => moodColors[d.mood])
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 x: {
//                     type: 'time',
//                     time: {
//                         unit: 'day'
//                     },
//                     title: {
//                         display: true,
//                         text: 'Date',
//                         color: '#2d6a4f'
//                     },
//                     ticks: {
//                         color: '#2d6a4f'
//                     }
//                 },
//                 y: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: 'Intensity',
//                         color: '#2d6a4f'
//                     },
//                     ticks: {
//                         color: '#2d6a4f',
//                         stepSize: 1,
//                         callback: function(value) {
//                             if (Number.isInteger(value) && value >= 0 && value <= 5) {
//                                 return value.toString();
//                             }
//                             return null;
//                         }
//                     },
//                     min: 0,
//                     max: 5.5,
//                     suggestedMax: 5.5
//                 }
//             },
//             plugins: {
//                 legend: {
//                     display: false
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: (context) => {
//                             const mood = context.raw.mood;
//                             const intensity = context.raw.y;
//                             const date = new Date(context.raw.x).toLocaleDateString();
//                             const contextText = context.raw.context;
//                             return [
//                                 `Date: ${date}`,
//                                 `Mood: ${mood}`,
//                                 `Intensity: ${intensity}`,
//                                 `Context: ${contextText || 'No context provided'}`
//                             ];
//                         }
//                     },
//                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                     titleColor: '#2d6a4f',
//                     bodyColor: '#2d6a4f',
//                     borderColor: '#2d6a4f',
//                     borderWidth: 1,
//                     padding: 10,
//                     bodyFont: {
//                         size: 14
//                     }
//                 }
//             },
//             animation: {
//                 duration: 1500,
//                 easing: 'easeOutQuart'
//             }
//         }
//     });

//     // Update the suggestions list
//     const suggestionsList = document.getElementById('suggestions-list');
//     suggestionsList.innerHTML = ''; // Clear any previous suggestions
//     suggestionsData.suggestions.forEach(suggestion => {
//         const listItem = document.createElement('li');
        
//         // Create suggestion text
//         const suggestionText = document.createElement('span');
//         suggestionText.textContent = suggestion.suggestion; // Assuming suggestion object has a 'suggestion' field
        
//         listItem.appendChild(suggestionText);
        
//         // Create links if they exist
//         if (suggestion.links && suggestion.links.length > 0) {
//             const linksList = document.createElement('ul'); // Create a sublist for links
//             suggestion.links.forEach(link => {
//                 const linkItem = document.createElement('li');
//                 const linkElement = document.createElement('a');
//                 linkElement.href = link; // Set the href to the link
//                 linkElement.textContent = link; // Use the link as text or customize it
//                 linkElement.target = "_blank"; // Open link in a new tab
//                 linkItem.appendChild(linkElement);
//                 linksList.appendChild(linkItem);
//             });
//             listItem.appendChild(linksList); // Add links to the suggestion list item
//         }

//         suggestionsList.appendChild(listItem);
//     });
// }

// fetchMoodData();

// // Add resize listener to make the chart responsive
// window.addEventListener('resize', () => {
//     const chart = Chart.getChart('moodChart');
//     if (chart) {
//         chart.resize();
//     }
// });






// async function fetchMoodData() {
//     const token = localStorage.getItem('access_token'); // Adjust the key based on your storage method

//     // Fetch mood chart data
//     const response = await fetch('http://localhost:8000/api/mood/mood-chart-data/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });

//     const moodData = await response.json();

//     // Fetch mood trend suggestions
//     const suggestionsResponse = await fetch('http://localhost:8000/api/mood/mood-trend/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     });

//     const suggestionsData = await suggestionsResponse.json();

//     // Process mood data for the bubble chart
//     const chartData = moodData.map(log => ({
//         x: new Date(log.date.replace(/-/g, '/')),
//         y: log.intensity,
//         r: log.intensity * 3,
//         mood: log.mood_type,
//         context: log.context
//     }));

//     // Define color mapping for moods
//     const moodColors = {
//         happy: 'rgba(255, 193, 7, 0.7)',
//         sad: 'rgba(13, 110, 253, 0.7)',
//         anxious: 'rgba(220, 53, 69, 0.7)',
//         calm: 'rgba(25, 135, 84, 0.7)',
//         excited: 'rgba(255, 128, 0, 0.7)',
//         angry: 'rgba(220, 53, 69, 0.7)'
//     };

//     const ctx = document.getElementById('moodChart').getContext('2d');
//     const moodChart = new Chart(ctx, {
//         type: 'bubble',
//         data: {
//             datasets: [{
//                 label: 'Mood Intensity Over Time',
//                 data: chartData,
//                 backgroundColor: chartData.map(d => moodColors[d.mood])
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 x: {
//                     type: 'time',
//                     time: {
//                         unit: 'day'
//                     },
//                     title: {
//                         display: true,
//                         text: 'Date',
//                         color: '#2d6a4f'
//                     },
//                     ticks: {
//                         color: '#2d6a4f'
//                     }
//                 },
//                 y: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: 'Intensity',
//                         color: '#2d6a4f'
//                     },
//                     ticks: {
//                         color: '#2d6a4f',
//                         stepSize: 1,
//                         callback: function(value) {
//                             if (Number.isInteger(value) && value >= 0 && value <= 5) {
//                                 return value.toString();
//                             }
//                             return null;
//                         }
//                     },
//                     min: 0,
//                     max: 5.5,
//                     suggestedMax: 5.5
//                 }
//             },
//             plugins: {
//                 legend: {
//                     display: false
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: (context) => {
//                             const mood = context.raw.mood;
//                             const intensity = context.raw.y;
//                             const date = new Date(context.raw.x).toLocaleDateString();
//                             const contextText = context.raw.context;
//                             return [
//                                 `Date: ${date}`,
//                                 `Mood: ${mood}`,
//                                 `Intensity: ${intensity}`,
//                                 `Context: ${contextText || 'No context provided'}`
//                             ];
//                         }
//                     },
//                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                     titleColor: '#2d6a4f',
//                     bodyColor: '#2d6a4f',
//                     borderColor: '#2d6a4f',
//                     borderWidth: 1,
//                     padding: 10,
//                     bodyFont: {
//                         size: 14
//                     }
//                 }
//             },
//             animation: {
//                 duration: 1500,
//                 easing: 'easeOutQuart'
//             }
//         }
//     });

//     // Update the suggestions list
//     const suggestionsList = document.getElementById('suggestions-list');
//     suggestionsList.innerHTML = ''; // Clear any previous suggestions
//     suggestionsData.suggestions.forEach(suggestion => {
//         const listItem = document.createElement('li');
//         listItem.textContent = suggestion;
//         suggestionsList.appendChild(listItem);
//     });
// }

// fetchMoodData();

// // Add resize listener to make the chart responsive
// window.addEventListener('resize', () => {
//     const chart = Chart.getChart('moodChart');
//     if (chart) {
//         chart.resize();
//     }
// });

// async function fetchMoodData() {
    
//     const token = localStorage.getItem('access_token'); // Adjust the key based on your storage method

//     const response = await fetch('http://localhost:8000/api/mood/mood-chart-data/', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
//             'Content-Type': 'application/json' // Ensure the content type is set
//         }
//     });
    
    
//     const data = await response.json();

//     // Process data for the bubble chart
//     const chartData = data.map(log => ({
//         x: new Date(log.date.replace(/-/g, '/')),
//         y: log.intensity,
//         r: log.intensity * 3,
//         mood: log.mood_type,
//         context: log.context
//     }));

//     // Define color mapping for moods
//     const moodColors = {
//         happy: 'rgba(255, 193, 7, 0.7)',
//         sad: 'rgba(13, 110, 253, 0.7)',
//         anxious: 'rgba(220, 53, 69, 0.7)',
//         calm: 'rgba(25, 135, 84, 0.7)',
//         excited: 'rgba(255, 128, 0, 0.7)',
//         angry: 'rgba(220, 53, 69, 0.7)'
//     };

//     const ctx = document.getElementById('moodChart').getContext('2d');
//     const moodChart = new Chart(ctx, {
//         type: 'bubble',
//         data: {
//             datasets: [{
//                 label: 'Mood Intensity Over Time',
//                 data: chartData,
//                 backgroundColor: chartData.map(d => moodColors[d.mood])
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 x: {
//                     type: 'time',
//                     time: {
//                         unit: 'day'
//                     },
//                     title: {
//                         display: true,
//                         text: 'Date',
//                         color: '#2d6a4f'
//                     },
//                     ticks: {
//                         color: '#2d6a4f'
//                     }
//                 },
//                 y: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: 'Intensity',
//                         color: '#2d6a4f'
//                     },
//                     ticks: {
//                         color: '#2d6a4f',
//                         stepSize: 1,
//                         callback: function(value) {
//                             if (Number.isInteger(value) && value >= 0 && value <= 5) {
//                                 return value.toString();
//                             }
//                             return null;
//                         }
//                     },
//                     min: 0,
//                     max: 5.5, // Increased to 5.5 to ensure bubbles with intensity 5 are fully visible
//                     suggestedMax: 5.5
//                 }
//             },
//             plugins: {
//                 legend: {
//                     display: false
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: (context) => {
//                             const mood = context.raw.mood;
//                             const intensity = context.raw.y;
//                             const date = new Date(context.raw.x).toLocaleDateString();
//                             const contextText = context.raw.context;
//                             return [
//                                 `Date: ${date}`,
//                                 `Mood: ${mood}`,
//                                 `Intensity: ${intensity}`,
//                                 `Context: ${contextText || 'No context provided'}`
//                             ];
//                         }
//                     },
//                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                     titleColor: '#2d6a4f',
//                     bodyColor: '#2d6a4f',
//                     borderColor: '#2d6a4f',
//                     borderWidth: 1,
//                     padding: 10,
//                     bodyFont: {
//                         size: 14
//                     }
//                 }
//             },
//             animation: {
//                 duration: 1500,
//                 easing: 'easeOutQuart'
//             }
//         }
//     });
// }

// fetchMoodData();

// // Add resize listener to make the chart responsive
// window.addEventListener('resize', () => {
//     const chart = Chart.getChart('moodChart');
//     if (chart) {
//         chart.resize();
//     }
// });