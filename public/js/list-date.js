document.addEventListener('DOMContentLoaded', function () {
    flatpickr('.flatpickr', {
        dateFormat: 'Y-m-d',
        enableTime: false,
        time_24hr: true,
    });

    document.getElementById('submitBtn').addEventListener('click', function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Validate if both dates are selected
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        // Format the dates as needed and send to API
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();
        console.log(formattedStartDate, formattedEndDate)
        // Replace the following with your API endpoint and data format
        const apiUrl = 'YOUR_API_ENDPOINT';
        const requestData = {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        };

        // Example: Sending data to the API using fetch
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            // Handle the API response as needed
            // You may close the popup or display a success message
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors, display error message, etc.
        });
    });
});
